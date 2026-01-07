"""
Flow Engine
Motor de execução de fluxos (estilo n8n/EvoAI).
"""

from typing import List, Dict, Any, Optional, Callable
from datetime import datetime
import asyncio


class FlowNode:
    """Representa um nó no fluxo"""
    
    def __init__(
        self,
        id: str,
        type: str,
        data: dict,
        position: dict = None
    ):
        self.id = id
        self.type = type
        self.data = data
        self.position = position or {"x": 0, "y": 0}
        
    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "type": self.type,
            "data": self.data,
            "position": self.position
        }


class FlowEdge:
    """Representa uma conexão entre nós"""
    
    def __init__(
        self,
        id: str,
        source: str,
        target: str,
        sourceHandle: str = None,
        targetHandle: str = None
    ):
        self.id = id
        self.source = source
        self.target = target
        self.sourceHandle = sourceHandle
        self.targetHandle = targetHandle
        
    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "source": self.source,
            "target": self.target,
            "sourceHandle": self.sourceHandle,
            "targetHandle": self.targetHandle
        }


class Flow:
    """Representa um fluxo completo"""
    
    def __init__(
        self,
        id: str,
        name: str,
        description: str = "",
        nodes: List[dict] = None,
        edges: List[dict] = None
    ):
        self.id = id
        self.name = name
        self.description = description
        self.nodes = [FlowNode(**n) for n in (nodes or [])]
        self.edges = [FlowEdge(**e) for e in (edges or [])]
        self.status = "inactive"
        self.created_at = datetime.now()
        self.last_run = None
        
    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "name": self.name,
            "description": self.description,
            "nodes": [n.to_dict() for n in self.nodes],
            "edges": [e.to_dict() for e in self.edges],
            "status": self.status,
            "created_at": self.created_at.isoformat(),
            "last_run": self.last_run.isoformat() if self.last_run else None
        }


class FlowEngine:
    """
    Motor de execução de fluxos.
    
    Tipos de nós suportados:
    - trigger: Inicia o fluxo (ex: mensagem recebida, timer)
    - message: Envia mensagem
    - condition: Condição IF/ELSE
    - action: Executa ação (ex: chamar agente)
    - delay: Aguarda tempo
    - api: Chama API externa
    """
    
    NODE_TYPES = {
        "trigger": {
            "label": "Evento",
            "color": "#22c55e",
            "icon": "Zap",
            "inputs": [],
            "outputs": ["next"]
        },
        "message": {
            "label": "Enviar Mensagem",
            "color": "#3b82f6",
            "icon": "MessageSquare",
            "inputs": ["input"],
            "outputs": ["next"]
        },
        "condition": {
            "label": "Condição",
            "color": "#f59e0b",
            "icon": "GitBranch",
            "inputs": ["input"],
            "outputs": ["true", "false"]
        },
        "agent": {
            "label": "Chamar Agente",
            "color": "#8b5cf6",
            "icon": "Bot",
            "inputs": ["input"],
            "outputs": ["response"]
        },
        "delay": {
            "label": "Aguardar",
            "color": "#64748b",
            "icon": "Clock",
            "inputs": ["input"],
            "outputs": ["next"]
        },
        "tag": {
            "label": "Adicionar Etiqueta",
            "color": "#22c55e",
            "icon": "Tag",
            "inputs": ["input"],
            "outputs": ["next"]
        },
        "end": {
            "label": "Fim",
            "color": "#ef4444",
            "icon": "Square",
            "inputs": ["input"],
            "outputs": []
        }
    }
    
    def __init__(self, agents: dict = None):
        self.flows: Dict[str, Flow] = {}
        self.agents = agents or {}
        self.execution_logs: List[dict] = []
        
    def create_flow(
        self,
        name: str,
        description: str = "",
        nodes: List[dict] = None,
        edges: List[dict] = None
    ) -> Flow:
        """Cria novo fluxo"""
        flow_id = f"flow_{datetime.now().timestamp()}"
        flow = Flow(
            id=flow_id,
            name=name,
            description=description,
            nodes=nodes,
            edges=edges
        )
        self.flows[flow_id] = flow
        return flow
    
    def get_flow(self, flow_id: str) -> Optional[Flow]:
        """Retorna fluxo por ID"""
        return self.flows.get(flow_id)
    
    def update_flow(
        self,
        flow_id: str,
        nodes: List[dict] = None,
        edges: List[dict] = None,
        name: str = None,
        description: str = None
    ) -> Optional[Flow]:
        """Atualiza fluxo existente"""
        flow = self.flows.get(flow_id)
        if not flow:
            return None
        
        if nodes:
            flow.nodes = [FlowNode(**n) for n in nodes]
        if edges:
            flow.edges = [FlowEdge(**e) for e in edges]
        if name:
            flow.name = name
        if description:
            flow.description = description
        
        return flow
    
    def delete_flow(self, flow_id: str) -> bool:
        """Remove fluxo"""
        if flow_id in self.flows:
            del self.flows[flow_id]
            return True
        return False
    
    async def execute_flow(
        self,
        flow_id: str,
        trigger_data: dict = None
    ) -> dict:
        """
        Executa um fluxo.
        
        Args:
            flow_id: ID do fluxo
            trigger_data: Dados do evento que disparou
            
        Returns:
            Resultado da execução
        """
        flow = self.flows.get(flow_id)
        if not flow:
            return {"success": False, "error": "Flow not found"}
        
        flow.last_run = datetime.now()
        flow.status = "running"
        
        execution = {
            "flow_id": flow_id,
            "started_at": datetime.now().isoformat(),
            "steps": [],
            "data": trigger_data or {}
        }
        
        try:
            # Encontra nó trigger
            trigger_node = next(
                (n for n in flow.nodes if n.type == "trigger"),
                None
            )
            
            if not trigger_node:
                return {"success": False, "error": "No trigger node found"}
            
            # Executa começando pelo trigger
            current_node = trigger_node
            context = {"input": trigger_data, "variables": {}}
            
            while current_node:
                result = await self._execute_node(current_node, context)
                
                execution["steps"].append({
                    "node_id": current_node.id,
                    "type": current_node.type,
                    "result": result
                })
                
                # Atualiza contexto
                context["input"] = result.get("output", context["input"])
                
                # Encontra próximo nó
                next_handle = result.get("next_handle", "next")
                next_edge = next(
                    (e for e in flow.edges 
                     if e.source == current_node.id 
                     and (e.sourceHandle == next_handle or not e.sourceHandle)),
                    None
                )
                
                if next_edge:
                    current_node = next(
                        (n for n in flow.nodes if n.id == next_edge.target),
                        None
                    )
                else:
                    current_node = None
            
            flow.status = "active"
            execution["completed_at"] = datetime.now().isoformat()
            execution["success"] = True
            
            self.execution_logs.append(execution)
            
            return execution
            
        except Exception as e:
            flow.status = "error"
            execution["error"] = str(e)
            execution["success"] = False
            
            self.execution_logs.append(execution)
            
            return execution
    
    async def _execute_node(self, node: FlowNode, context: dict) -> dict:
        """Executa um nó individual"""
        
        handlers = {
            "trigger": self._handle_trigger,
            "message": self._handle_message,
            "condition": self._handle_condition,
            "agent": self._handle_agent,
            "delay": self._handle_delay,
            "tag": self._handle_tag,
            "end": self._handle_end
        }
        
        handler = handlers.get(node.type, self._handle_default)
        return await handler(node, context)
    
    async def _handle_trigger(self, node: FlowNode, context: dict) -> dict:
        """Processa nó trigger"""
        return {"output": context.get("input", {}), "next_handle": "next"}
    
    async def _handle_message(self, node: FlowNode, context: dict) -> dict:
        """Processa nó de mensagem"""
        message = node.data.get("message", "")
        # Substitui variáveis
        for key, value in context.get("variables", {}).items():
            message = message.replace(f"{{{key}}}", str(value))
        
        return {"output": {"message": message}, "next_handle": "next"}
    
    async def _handle_condition(self, node: FlowNode, context: dict) -> dict:
        """Processa nó de condição"""
        condition = node.data.get("condition", "")
        value = node.data.get("value", "")
        input_data = context.get("input", {})
        
        # Avalia condição simples
        input_str = str(input_data).lower()
        value_lower = value.lower()
        
        if condition == "contains":
            result = value_lower in input_str
        elif condition == "equals":
            result = input_str == value_lower
        elif condition == "not_empty":
            result = bool(input_str.strip())
        else:
            result = False
        
        return {
            "output": input_data,
            "next_handle": "true" if result else "false"
        }
    
    async def _handle_agent(self, node: FlowNode, context: dict) -> dict:
        """Processa nó de agente"""
        agent_id = node.data.get("agent_id", "")
        agent = self.agents.get(agent_id)
        
        if agent:
            input_message = str(context.get("input", ""))
            response = await agent.process_message(input_message)
            return {"output": {"response": response}, "next_handle": "response"}
        
        return {"output": {"error": "Agent not found"}, "next_handle": "response"}
    
    async def _handle_delay(self, node: FlowNode, context: dict) -> dict:
        """Processa nó de delay"""
        seconds = node.data.get("seconds", 1)
        await asyncio.sleep(seconds)
        return {"output": context.get("input", {}), "next_handle": "next"}
    
    async def _handle_tag(self, node: FlowNode, context: dict) -> dict:
        """Processa nó de etiqueta"""
        tag = node.data.get("tag", "")
        return {
            "output": {**context.get("input", {}), "tag": tag},
            "next_handle": "next"
        }
    
    async def _handle_end(self, node: FlowNode, context: dict) -> dict:
        """Processa nó final"""
        return {"output": context.get("input", {}), "finished": True}
    
    async def _handle_default(self, node: FlowNode, context: dict) -> dict:
        """Handler padrão para nós desconhecidos"""
        return {"output": context.get("input", {}), "next_handle": "next"}
    
    def get_node_types(self) -> dict:
        """Retorna tipos de nós disponíveis"""
        return self.NODE_TYPES
    
    def get_execution_logs(self, flow_id: str = None) -> List[dict]:
        """Retorna logs de execução"""
        if flow_id:
            return [log for log in self.execution_logs if log["flow_id"] == flow_id]
        return self.execution_logs
