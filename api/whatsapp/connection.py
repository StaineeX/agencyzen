"""
WhatsApp Connection
Conexão própria com WhatsApp Web usando websockets.
Nota: Para produção, use whatsapp-web.js via subprocess ou API própria.
"""

import asyncio
import qrcode
import io
import base64
from typing import Optional, Callable, Dict, List
from datetime import datetime
import json
import os


class WhatsAppConnection:
    """
    Gerencia conexão com WhatsApp.
    
    Nota: Esta é uma implementação base. Para produção real, você pode:
    1. Usar whatsapp-web.js (Node.js) via subprocess
    2. Usar Baileys (TypeScript) via subprocess  
    3. Implementar protocolo WhatsApp diretamente (complexo)
    
    Por enquanto, simula a conexão para desenvolvimento do frontend.
    """
    
    def __init__(self):
        self.is_connected = False
        self.phone_number: Optional[str] = None
        self.qr_code: Optional[str] = None
        self.messages: List[dict] = []
        self.on_message_callback: Optional[Callable] = None
        self.session_data: Optional[dict] = None
        
    async def generate_qr(self) -> str:
        """
        Gera QR Code para conexão.
        Em produção, isso viria do whatsapp-web.js ou Baileys.
        """
        # Simula dados do QR Code (em produção, vem do WhatsApp)
        qr_data = f"whatsapp://connect?session={datetime.now().timestamp()}"
        
        # Gera imagem do QR Code
        qr = qrcode.QRCode(
            version=1,
            error_correction=qrcode.constants.ERROR_CORRECT_L,
            box_size=10,
            border=4,
        )
        qr.add_data(qr_data)
        qr.make(fit=True)
        
        img = qr.make_image(fill_color="black", back_color="white")
        
        # Converte para base64
        buffer = io.BytesIO()
        img.save(buffer, format="PNG")
        img_str = base64.b64encode(buffer.getvalue()).decode()
        
        self.qr_code = f"data:image/png;base64,{img_str}"
        
        # Simula espera por scan (em produção, seria evento real)
        asyncio.create_task(self._simulate_connection())
        
        return self.qr_code
    
    async def _simulate_connection(self):
        """Simula conexão após scan do QR (para desenvolvimento)"""
        await asyncio.sleep(5)  # Simula tempo de scan
        # Em produção, isso seria um evento real do WhatsApp
        # Por enquanto, não conecta automaticamente
    
    async def connect_with_session(self, session_data: dict) -> bool:
        """Conecta usando sessão salva"""
        self.session_data = session_data
        self.is_connected = True
        self.phone_number = session_data.get("phone", "unknown")
        return True
    
    async def disconnect(self):
        """Desconecta do WhatsApp"""
        self.is_connected = False
        self.phone_number = None
        self.session_data = None
    
    async def send_message(self, to: str, content: str) -> dict:
        """
        Envia mensagem para um número.
        Em produção, chama a API real do WhatsApp.
        """
        if not self.is_connected:
            return {"success": False, "error": "WhatsApp não conectado"}
        
        message = {
            "id": f"msg_{datetime.now().timestamp()}",
            "to": to,
            "content": content,
            "timestamp": datetime.now().isoformat(),
            "status": "sent"
        }
        
        self.messages.append(message)
        
        # Em produção, aqui enviaria via whatsapp-web.js/Baileys
        
        return {"success": True, "message": message}
    
    async def get_messages(self, phone: Optional[str] = None) -> List[dict]:
        """Retorna mensagens"""
        if phone:
            return [m for m in self.messages if m.get("to") == phone or m.get("from") == phone]
        return self.messages
    
    def set_message_handler(self, callback: Callable):
        """Define callback para novas mensagens"""
        self.on_message_callback = callback
    
    async def simulate_incoming_message(self, from_phone: str, content: str):
        """Simula mensagem recebida (para testes)"""
        message = {
            "id": f"msg_{datetime.now().timestamp()}",
            "from": from_phone,
            "content": content,
            "timestamp": datetime.now().isoformat(),
            "status": "received"
        }
        
        self.messages.append(message)
        
        if self.on_message_callback:
            await self.on_message_callback(message)
        
        return message
    
    def get_status(self) -> dict:
        """Retorna status da conexão"""
        return {
            "connected": self.is_connected,
            "phone": self.phone_number,
            "messages_count": len(self.messages)
        }
    
    def save_session(self, filepath: str):
        """Salva sessão para reconexão"""
        if self.session_data:
            with open(filepath, 'w') as f:
                json.dump(self.session_data, f)
    
    def load_session(self, filepath: str) -> bool:
        """Carrega sessão salva"""
        if os.path.exists(filepath):
            with open(filepath, 'r') as f:
                self.session_data = json.load(f)
            return True
        return False


class WhatsAppManager:
    """Gerencia múltiplas conexões WhatsApp"""
    
    def __init__(self):
        self.connections: Dict[str, WhatsAppConnection] = {}
    
    def create_connection(self, instance_id: str) -> WhatsAppConnection:
        """Cria nova instância de conexão"""
        conn = WhatsAppConnection()
        self.connections[instance_id] = conn
        return conn
    
    def get_connection(self, instance_id: str) -> Optional[WhatsAppConnection]:
        """Retorna conexão existente"""
        return self.connections.get(instance_id)
    
    def remove_connection(self, instance_id: str):
        """Remove conexão"""
        if instance_id in self.connections:
            del self.connections[instance_id]
    
    def list_connections(self) -> List[dict]:
        """Lista todas as conexões"""
        return [
            {"id": k, **v.get_status()} 
            for k, v in self.connections.items()
        ]
