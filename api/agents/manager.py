"""
Manager Agent
Agente Gerente Geral - aprova posts e anúncios.
"""

from .base import Agent, AgentConfig
from typing import Optional, List


class ManagerAgent(Agent):
    """Agente Gerente que coordena e aprova"""
    
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.approval_queue: List[dict] = []
        self.approved_items: List[dict] = []
        self.rejected_items: List[dict] = []
    
    async def process_message(self, message: str) -> str:
        """Processa mensagem com lógica de gerente"""
        
        # Verifica comandos especiais
        lower_msg = message.lower()
        
        if "aprovar" in lower_msg or "approve" in lower_msg:
            return await self._handle_approval(message)
        
        if "rejeitar" in lower_msg or "reject" in lower_msg:
            return await self._handle_rejection(message)
        
        if "pendentes" in lower_msg or "fila" in lower_msg:
            return self._show_pending()
        
        # Processa normalmente
        return await super().process_message(message)
    
    async def _handle_approval(self, message: str) -> str:
        """Aprova um item da fila"""
        if not self.approval_queue:
            return "Não há itens pendentes para aprovar."
        
        item = self.approval_queue.pop(0)
        item["status"] = "approved"
        self.approved_items.append(item)
        self.tasks_completed += 1
        
        return f"✅ Aprovado: {item.get('title', 'Item')} do agente {item.get('agent_name', 'desconhecido')}"
    
    async def _handle_rejection(self, message: str) -> str:
        """Rejeita um item da fila"""
        if not self.approval_queue:
            return "Não há itens pendentes para rejeitar."
        
        item = self.approval_queue.pop(0)
        item["status"] = "rejected"
        item["rejection_reason"] = message
        self.rejected_items.append(item)
        
        return f"❌ Rejeitado: {item.get('title', 'Item')}. Motivo enviado ao agente."
    
    def _show_pending(self) -> str:
        """Mostra itens pendentes"""
        if not self.approval_queue:
            return "✨ Nenhum item pendente de aprovação!"
        
        pending = []
        for i, item in enumerate(self.approval_queue, 1):
            pending.append(f"{i}. {item.get('title', 'Sem título')} - {item.get('type', 'post')} de {item.get('agent_name', '?')}")
        
        return f"📋 Itens pendentes ({len(self.approval_queue)}):\n" + "\n".join(pending)
    
    def add_to_queue(self, item: dict):
        """Adiciona item para aprovação"""
        self.approval_queue.append(item)
    
    def get_stats(self) -> dict:
        """Retorna estatísticas do gerente"""
        return {
            "pending": len(self.approval_queue),
            "approved": len(self.approved_items),
            "rejected": len(self.rejected_items),
            "total_processed": self.tasks_completed
        }
