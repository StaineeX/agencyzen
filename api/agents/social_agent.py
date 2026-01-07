"""
Social Media Agent
Agente de criação de conteúdo e posts.
"""

from .base import Agent, AgentConfig
from typing import Optional, List, Dict


class SocialMediaAgent(Agent):
    """Agente especializado em Social Media"""
    
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.posts_created: List[dict] = []
        self.client_profiles: Dict[str, dict] = {}  # client_id -> profile
    
    def add_client_profile(self, client_id: str, profile: dict):
        """Adiciona perfil de cliente com identidade visual"""
        self.client_profiles[client_id] = {
            "name": profile.get("name", ""),
            "colors": profile.get("colors", []),
            "tone_of_voice": profile.get("tone_of_voice", ""),
            "hashtags": profile.get("hashtags", []),
            "examples": profile.get("examples", []),
            "logo": profile.get("logo", "")
        }
    
    async def create_post(self, topic: str, client_id: Optional[str] = None) -> dict:
        """Cria um post para redes sociais"""
        
        # Pega perfil do cliente se existir
        profile = self.client_profiles.get(client_id, {})
        
        # Monta prompt específico
        prompt = f"""Crie um post para Instagram sobre: {topic}

"""
        if profile:
            prompt += f"""
Cliente: {profile.get('name', 'Genérico')}
Tom de voz: {profile.get('tone_of_voice', 'Profissional e engajador')}
Hashtags sugeridas: {', '.join(profile.get('hashtags', []))}

Use o tom de voz do cliente e inclua as hashtags relevantes.
"""
        
        prompt += """
Retorne no formato:
LEGENDA: [legenda engajadora com emojis]
HASHTAGS: [hashtags relevantes]
SUGESTÃO DE IMAGEM: [descrição da imagem ideal]
"""
        
        # Processa com IA
        response = await self.process_message(prompt)
        
        post = {
            "topic": topic,
            "client_id": client_id,
            "content": response,
            "status": "pending_approval"
        }
        
        self.posts_created.append(post)
        
        return post
    
    async def generate_image_prompt(self, description: str, client_id: Optional[str] = None) -> str:
        """Gera prompt otimizado para geração de imagem"""
        
        profile = self.client_profiles.get(client_id, {})
        colors = profile.get("colors", [])
        
        prompt = f"""Crie um prompt para gerar uma imagem no estilo moderno para redes sociais.

Descrição: {description}
"""
        if colors:
            prompt += f"Cores da marca: {', '.join(colors)}\n"
        
        prompt += """
O prompt deve ser em inglês, detalhado e otimizado para IA de geração de imagens.
Retorne APENAS o prompt, sem explicações.
"""
        
        response = await self.process_message(prompt)
        return response
    
    def get_posts(self, client_id: Optional[str] = None) -> List[dict]:
        """Retorna posts criados"""
        if client_id:
            return [p for p in self.posts_created if p.get("client_id") == client_id]
        return self.posts_created
    
    def get_client_profile(self, client_id: str) -> Optional[dict]:
        """Retorna perfil de um cliente"""
        return self.client_profiles.get(client_id)
