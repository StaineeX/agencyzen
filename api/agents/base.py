"""
Base Agent Class
Classe base para todos os agentes de IA.
"""

from typing import Optional, List, Dict, Any
from datetime import datetime
import os

try:
    from openai import OpenAI
except ImportError:
    OpenAI = None


class AgentConfig:
    """Configuração de um agente"""
    def __init__(
        self,
        model: str = "gpt-4-turbo",
        temperature: float = 0.7,
        max_tokens: int = 1000
    ):
        self.model = model
        self.temperature = temperature
        self.max_tokens = max_tokens


class Agent:
    """Classe base para todos os agentes"""
    
    def __init__(
        self,
        id: str,
        name: str,
        type: str,
        description: str,
        system_prompt: str,
        client_id: Optional[str] = None,
        config: Optional[AgentConfig] = None
    ):
        self.id = id
        self.name = name
        self.type = type
        self.description = description
        self.system_prompt = system_prompt
        self.client_id = client_id
        self.config = config or AgentConfig()
        self.status = "active"
        self.created_at = datetime.now()
        self.messages_history: List[Dict[str, str]] = []
        self.tasks_completed = 0
        self.pending_approvals: List[dict] = []
        
    def to_dict(self) -> dict:
        """Converte agente para dicionário"""
        return {
            "id": self.id,
            "name": self.name,
            "type": self.type,
            "description": self.description,
            "system_prompt": self.system_prompt,
            "client_id": self.client_id,
            "status": self.status,
            "created_at": self.created_at.isoformat(),
            "tasks_completed": self.tasks_completed,
            "config": {
                "model": self.config.model,
                "temperature": self.config.temperature
            }
        }
    
    async def process_message(self, message: str) -> str:
        """Processa uma mensagem e retorna resposta"""
        
        # Adiciona mensagem ao histórico
        self.messages_history.append({
            "role": "user",
            "content": message
        })
        
        # Tenta usar OpenAI
        api_key = os.getenv("OPENAI_API_KEY")
        
        if api_key and OpenAI:
            try:
                client = OpenAI(api_key=api_key)
                
                messages = [
                    {"role": "system", "content": self.system_prompt}
                ] + self.messages_history[-10:]  # Últimas 10 mensagens
                
                response = client.chat.completions.create(
                    model=self.config.model,
                    messages=messages,
                    temperature=self.config.temperature,
                    max_tokens=self.config.max_tokens
                )
                
                assistant_message = response.choices[0].message.content
                
                self.messages_history.append({
                    "role": "assistant",
                    "content": assistant_message
                })
                
                return assistant_message
                
            except Exception as e:
                return f"Erro ao processar: {str(e)}"
        
        # Fallback se não tiver API key
        return self._generate_fallback_response(message)
    
    def _generate_fallback_response(self, message: str) -> str:
        """Resposta de fallback quando não há API configurada"""
        responses = {
            "manager": f"[{self.name}] Vou coordenar essa tarefa com a equipe. Por favor, configure a API Key da OpenAI para respostas reais.",
            "whatsapp": f"[{self.name}] Entendi sua mensagem. Configure a API Key para ativar o atendimento automático.",
            "social_media": f"[{self.name}] Vou preparar o conteúdo. Configure a API Key para criação de posts.",
            "traffic": f"[{self.name}] Analisando métricas. Configure a API Key para otimização de campanhas."
        }
        return responses.get(self.type, f"[{self.name}] Mensagem recebida. Configure a API Key da OpenAI.")
    
    def clear_history(self):
        """Limpa histórico de mensagens"""
        self.messages_history = []
    
    def add_pending_approval(self, item: dict):
        """Adiciona item para aprovação (usado pelo Gerente)"""
        self.pending_approvals.append({
            **item,
            "submitted_at": datetime.now().isoformat(),
            "status": "pending"
        })
    
    def get_pending_approvals(self) -> List[dict]:
        """Retorna itens pendentes de aprovação"""
        return [a for a in self.pending_approvals if a["status"] == "pending"]
