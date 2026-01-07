"""
AgencyZen API - Backend Principal
FastAPI server para gerenciar agentes de IA, WhatsApp e geração de imagens.
"""

from fastapi import FastAPI, HTTPException, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
import os
import json
import asyncio
from datetime import datetime
from dotenv import load_dotenv

# Import our modules
from agents.base import Agent, AgentConfig
from agents.manager import ManagerAgent
from agents.whatsapp_agent import WhatsAppAgent
from agents.social_agent import SocialMediaAgent
from agents.traffic_agent import TrafficAgent
from whatsapp.connection import WhatsAppConnection
from image_gen.replicate_client import ImageGenerator
from flows.engine import FlowEngine

load_dotenv()

app = FastAPI(
    title="AgencyZen API",
    description="Backend para sistema multi-agente de IA",
    version="3.0.0"
)

# CORS para permitir frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Storage (em memória por enquanto, depois SQLite)
agents_db: Dict[str, Agent] = {}
flows_db: Dict[str, dict] = {}
conversations_db: Dict[str, List[dict]] = {}
whatsapp_connection: Optional[WhatsAppConnection] = None

# ============== Models ==============

class AgentCreate(BaseModel):
    name: str
    type: str  # manager, whatsapp, social_media, traffic
    description: str
    system_prompt: str
    client_id: Optional[str] = None

class AgentUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    system_prompt: Optional[str] = None
    status: Optional[str] = None

class FlowCreate(BaseModel):
    name: str
    description: str
    nodes: List[dict]
    edges: List[dict]
    agent_id: str

class MessageSend(BaseModel):
    to: str
    content: str
    agent_id: str

class ImageGenerate(BaseModel):
    prompt: str
    style: Optional[str] = "realistic"
    client_id: Optional[str] = None

class ConfigUpdate(BaseModel):
    openai_key: Optional[str] = None
    replicate_key: Optional[str] = None
    model: Optional[str] = "gpt-4-turbo"

# ============== Config ==============

config_store = {
    "openai_key": os.getenv("OPENAI_API_KEY", ""),
    "replicate_key": os.getenv("REPLICATE_API_TOKEN", ""),
    "model": "gpt-4-turbo"
}

@app.get("/")
async def root():
    return {"message": "AgencyZen API v3.0", "status": "running"}

@app.get("/api/config")
async def get_config():
    return {
        "openai_configured": bool(config_store["openai_key"]),
        "replicate_configured": bool(config_store["replicate_key"]),
        "model": config_store["model"]
    }

@app.put("/api/config")
async def update_config(config: ConfigUpdate):
    if config.openai_key:
        config_store["openai_key"] = config.openai_key
        os.environ["OPENAI_API_KEY"] = config.openai_key
    if config.replicate_key:
        config_store["replicate_key"] = config.replicate_key
        os.environ["REPLICATE_API_TOKEN"] = config.replicate_key
    if config.model:
        config_store["model"] = config.model
    return {"status": "updated"}

# ============== Agents ==============

@app.get("/api/agents")
async def list_agents():
    return list(agents_db.values())

@app.post("/api/agents")
async def create_agent(agent_data: AgentCreate):
    agent_id = f"agent_{datetime.now().timestamp()}"
    
    agent_classes = {
        "manager": ManagerAgent,
        "whatsapp": WhatsAppAgent,
        "social_media": SocialMediaAgent,
        "traffic": TrafficAgent
    }
    
    AgentClass = agent_classes.get(agent_data.type, Agent)
    
    agent = AgentClass(
        id=agent_id,
        name=agent_data.name,
        type=agent_data.type,
        description=agent_data.description,
        system_prompt=agent_data.system_prompt,
        client_id=agent_data.client_id
    )
    
    agents_db[agent_id] = agent
    return agent.to_dict()

@app.get("/api/agents/{agent_id}")
async def get_agent(agent_id: str):
    if agent_id not in agents_db:
        raise HTTPException(status_code=404, detail="Agent not found")
    return agents_db[agent_id].to_dict()

@app.put("/api/agents/{agent_id}")
async def update_agent(agent_id: str, update: AgentUpdate):
    if agent_id not in agents_db:
        raise HTTPException(status_code=404, detail="Agent not found")
    
    agent = agents_db[agent_id]
    if update.name:
        agent.name = update.name
    if update.description:
        agent.description = update.description
    if update.system_prompt:
        agent.system_prompt = update.system_prompt
    if update.status:
        agent.status = update.status
    
    return agent.to_dict()

@app.delete("/api/agents/{agent_id}")
async def delete_agent(agent_id: str):
    if agent_id not in agents_db:
        raise HTTPException(status_code=404, detail="Agent not found")
    del agents_db[agent_id]
    return {"status": "deleted"}

@app.post("/api/agents/{agent_id}/chat")
async def chat_with_agent(agent_id: str, message: dict):
    if agent_id not in agents_db:
        raise HTTPException(status_code=404, detail="Agent not found")
    
    agent = agents_db[agent_id]
    response = await agent.process_message(message.get("content", ""))
    return {"response": response}

# ============== Flows ==============

@app.get("/api/flows")
async def list_flows():
    return list(flows_db.values())

@app.post("/api/flows")
async def create_flow(flow_data: FlowCreate):
    flow_id = f"flow_{datetime.now().timestamp()}"
    
    flow = {
        "id": flow_id,
        "name": flow_data.name,
        "description": flow_data.description,
        "nodes": flow_data.nodes,
        "edges": flow_data.edges,
        "agent_id": flow_data.agent_id,
        "created_at": datetime.now().isoformat(),
        "status": "active"
    }
    
    flows_db[flow_id] = flow
    return flow

@app.get("/api/flows/{flow_id}")
async def get_flow(flow_id: str):
    if flow_id not in flows_db:
        raise HTTPException(status_code=404, detail="Flow not found")
    return flows_db[flow_id]

@app.put("/api/flows/{flow_id}")
async def update_flow(flow_id: str, flow_data: FlowCreate):
    if flow_id not in flows_db:
        raise HTTPException(status_code=404, detail="Flow not found")
    
    flows_db[flow_id].update({
        "name": flow_data.name,
        "description": flow_data.description,
        "nodes": flow_data.nodes,
        "edges": flow_data.edges
    })
    return flows_db[flow_id]

@app.delete("/api/flows/{flow_id}")
async def delete_flow(flow_id: str):
    if flow_id not in flows_db:
        raise HTTPException(status_code=404, detail="Flow not found")
    del flows_db[flow_id]
    return {"status": "deleted"}

# ============== WhatsApp ==============

@app.post("/api/whatsapp/connect")
async def connect_whatsapp():
    global whatsapp_connection
    whatsapp_connection = WhatsAppConnection()
    qr_code = await whatsapp_connection.generate_qr()
    return {"qr_code": qr_code, "status": "waiting_scan"}

@app.get("/api/whatsapp/status")
async def whatsapp_status():
    if whatsapp_connection:
        return {"connected": whatsapp_connection.is_connected}
    return {"connected": False}

@app.post("/api/whatsapp/send")
async def send_whatsapp(message: MessageSend):
    if not whatsapp_connection or not whatsapp_connection.is_connected:
        raise HTTPException(status_code=400, detail="WhatsApp not connected")
    
    result = await whatsapp_connection.send_message(message.to, message.content)
    return result

@app.get("/api/whatsapp/conversations")
async def get_conversations():
    return conversations_db

# ============== Image Generation ==============

image_generator = None

@app.post("/api/images/generate")
async def generate_image(request: ImageGenerate):
    global image_generator
    
    if not config_store["replicate_key"]:
        raise HTTPException(status_code=400, detail="Replicate API key not configured")
    
    if not image_generator:
        image_generator = ImageGenerator(config_store["replicate_key"])
    
    result = await image_generator.generate(
        prompt=request.prompt,
        style=request.style
    )
    return result

# ============== WebSocket for Real-time ==============

connected_clients: List[WebSocket] = []

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    connected_clients.append(websocket)
    try:
        while True:
            data = await websocket.receive_text()
            # Broadcast to all clients
            for client in connected_clients:
                await client.send_text(data)
    except WebSocketDisconnect:
        connected_clients.remove(websocket)

# ============== Startup ==============

@app.on_event("startup")
async def startup():
    # Create default agents
    default_agents = [
        {
            "id": "manager",
            "name": "Gerente Geral",
            "type": "manager",
            "description": "Coordena todos os agentes e aprova entregas",
            "system_prompt": "Você é o Gerente Geral da agência. Seu trabalho é coordenar os outros agentes, aprovar posts e anúncios antes de serem publicados, e garantir que tudo esteja alinhado com a identidade de cada cliente."
        },
        {
            "id": "whatsapp",
            "name": "Zap Zen",
            "type": "whatsapp", 
            "description": "Atendimento e qualificação de leads via WhatsApp",
            "system_prompt": "Você é o Zap Zen, especialista em atendimento ao cliente via WhatsApp. Seja cordial, objetivo e sempre tente qualificar o lead perguntando sobre suas necessidades."
        },
        {
            "id": "social",
            "name": "Social Zen",
            "type": "social_media",
            "description": "Criação de posts e conteúdo visual",
            "system_prompt": "Você é o Social Zen, especialista em social media. Crie legendas engajadoras, sugira hashtags relevantes e trabalhe com a identidade visual de cada cliente."
        },
        {
            "id": "traffic",
            "name": "Traffic Master",
            "type": "traffic",
            "description": "Gestão de anúncios e campanhas",
            "system_prompt": "Você é o Traffic Master, especialista em tráfego pago. Crie campanhas otimizadas, sugira segmentações e sempre peça aprovação do Gerente antes de publicar."
        }
    ]
    
    for agent_data in default_agents:
        agent_classes = {
            "manager": ManagerAgent,
            "whatsapp": WhatsAppAgent,
            "social_media": SocialMediaAgent,
            "traffic": TrafficAgent
        }
        AgentClass = agent_classes.get(agent_data["type"], Agent)
        agent = AgentClass(**agent_data)
        agents_db[agent_data["id"]] = agent
    
    print("✅ AgencyZen API started with default agents")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
