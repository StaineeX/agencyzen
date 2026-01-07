"""
WhatsApp Agent
Agente de atendimento via WhatsApp.
"""

from .base import Agent, AgentConfig
from typing import Optional, List, Dict


class WhatsAppAgent(Agent):
    """Agente especializado em atendimento WhatsApp"""
    
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.conversations: Dict[str, List[dict]] = {}  # phone -> messages
        self.qualified_leads: List[dict] = []
        self.scripts: Dict[str, str] = {
            "greeting": "Olá! 👋 Bem-vindo! Como posso ajudá-lo hoje?",
            "qualification": "Para entender melhor suas necessidades, pode me contar um pouco sobre seu negócio?",
            "closing": "Ótimo! Vou passar suas informações para nossa equipe. Entraremos em contato em breve! 🚀"
        }
    
    async def process_message(self, message: str, phone: Optional[str] = None) -> str:
        """Processa mensagem de WhatsApp"""
        
        # Se tiver número, salva no histórico de conversas
        if phone:
            if phone not in self.conversations:
                self.conversations[phone] = []
            self.conversations[phone].append({
                "role": "user",
                "content": message,
                "phone": phone
            })
        
        # Verifica se é lead qualificado
        lower_msg = message.lower()
        
        # Keywords de qualificação
        interest_keywords = ["preço", "valor", "orçamento", "quanto custa", "contratar", "interesse"]
        if any(kw in lower_msg for kw in interest_keywords):
            if phone:
                self.qualified_leads.append({
                    "phone": phone,
                    "message": message,
                    "qualified": True
                })
        
        # Processa com IA
        response = await super().process_message(message)
        
        # Salva resposta
        if phone:
            self.conversations[phone].append({
                "role": "assistant",
                "content": response
            })
        
        return response
    
    def get_conversation(self, phone: str) -> List[dict]:
        """Retorna histórico de conversa com um número"""
        return self.conversations.get(phone, [])
    
    def get_all_conversations(self) -> Dict[str, List[dict]]:
        """Retorna todas as conversas"""
        return self.conversations
    
    def get_qualified_leads(self) -> List[dict]:
        """Retorna leads qualificados"""
        return self.qualified_leads
    
    def set_script(self, script_type: str, content: str):
        """Define um script de atendimento"""
        self.scripts[script_type] = content
    
    def get_scripts(self) -> Dict[str, str]:
        """Retorna todos os scripts"""
        return self.scripts
