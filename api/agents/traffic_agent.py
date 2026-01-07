"""
Traffic Agent
Agente de gestão de tráfego pago.
"""

from .base import Agent, AgentConfig
from typing import Optional, List, Dict


class TrafficAgent(Agent):
    """Agente especializado em Tráfego Pago"""
    
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.campaigns: List[dict] = []
        self.client_configs: Dict[str, dict] = {}  # client_id -> config
    
    def add_client_config(self, client_id: str, config: dict):
        """Adiciona configuração de tráfego para cliente"""
        self.client_configs[client_id] = {
            "name": config.get("name", ""),
            "target_audience": config.get("target_audience", ""),
            "budget": config.get("budget", 0),
            "platforms": config.get("platforms", ["meta"]),
            "keywords": config.get("keywords", []),
            "interests": config.get("interests", [])
        }
    
    async def create_campaign(self, objective: str, client_id: Optional[str] = None) -> dict:
        """Cria sugestão de campanha"""
        
        config = self.client_configs.get(client_id, {})
        
        prompt = f"""Crie uma campanha de tráfego pago com o objetivo: {objective}

"""
        if config:
            prompt += f"""
Cliente: {config.get('name', '')}
Público-alvo: {config.get('target_audience', 'A definir')}
Orçamento: R$ {config.get('budget', 'A definir')}
Plataformas: {', '.join(config.get('platforms', ['Meta Ads']))}
"""
        
        prompt += """
Retorne no formato:
NOME DA CAMPANHA: [nome criativo]
OBJETIVO: [objetivo da campanha]
SEGMENTAÇÃO:
- Idade: [faixa etária]
- Interesses: [interesses relevantes]
- Localização: [sugestão de localização]
COPY DO ANÚNCIO: [texto do anúncio]
CTA: [call to action]
ORÇAMENTO SUGERIDO: [valor diário]
"""
        
        response = await self.process_message(prompt)
        
        campaign = {
            "objective": objective,
            "client_id": client_id,
            "content": response,
            "status": "pending_approval"
        }
        
        self.campaigns.append(campaign)
        
        return campaign
    
    async def analyze_metrics(self, metrics: dict) -> str:
        """Analisa métricas e sugere otimizações"""
        
        prompt = f"""Analise as seguintes métricas de campanha e sugira otimizações:

CPC: R$ {metrics.get('cpc', 0)}
CTR: {metrics.get('ctr', 0)}%
Impressões: {metrics.get('impressions', 0)}
Cliques: {metrics.get('clicks', 0)}
Conversões: {metrics.get('conversions', 0)}
Custo por Conversão: R$ {metrics.get('cost_per_conversion', 0)}

Forneça:
1. Diagnóstico do desempenho
2. Pontos de atenção
3. Sugestões de otimização
4. Ações recomendadas
"""
        
        return await self.process_message(prompt)
    
    def get_campaigns(self, client_id: Optional[str] = None) -> List[dict]:
        """Retorna campanhas criadas"""
        if client_id:
            return [c for c in self.campaigns if c.get("client_id") == client_id]
        return self.campaigns
    
    def get_client_config(self, client_id: str) -> Optional[dict]:
        """Retorna configuração de um cliente"""
        return self.client_configs.get(client_id)
