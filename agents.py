"""
AgencyZen - Sistema Multi-Agente Clean Code
============================================
3 Agentes de IA trabalhando juntos com Python puro.
Usa gpt-4o-mini (barato!) e fal.ai para imagens.
"""

import os
from openai import OpenAI
import fal_client

# === CONFIGURAÇÕES ===
# Caminho do seu modelo LoRA do Nano Banana na fal.ai
LORA_PATH = "caminho/do/seu/modelo/nano-banana"  # <- ALTERE AQUI!

# Cliente OpenAI
client = OpenAI()


class AgentWhatsApp:
    """
    Agente de Atendimento WhatsApp
    Recebe mensagem do cliente e responde como um vendedor atencioso.
    """
    
    def __init__(self):
        self.name = "Zap Zen"
        self.persona = """Você é o Zap Zen, um assistente de vendas simpático e atencioso 
da agência Zenith Marketing. Você:
- Responde de forma amigável e natural (como no WhatsApp real)
- É prestativo e busca entender as necessidades do cliente
- Quando o cliente demonstra interesse, sugere agendar uma reunião
- Usa emojis com moderação para parecer mais humano
- Mantém respostas curtas e objetivas (máximo 3 parágrafos)
- Se o cliente pedir algo criativo (post, campanha), anote o tema para passar adiante"""

    def process_message(self, client_message: str) -> dict:
        """
        Processa mensagem do cliente e retorna resposta + tema extraído.
        """
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": self.persona},
                {"role": "user", "content": client_message}
            ],
            temperature=0.7,
            max_tokens=300
        )
        
        reply = response.choices[0].message.content
        
        # Extrair tema se o cliente pediu algo criativo
        theme = self._extract_theme(client_message)
        
        return {
            "reply": reply,
            "theme": theme
        }
    
    def _extract_theme(self, message: str) -> str | None:
        """Extrai tema criativo da mensagem se houver."""
        keywords = ["post", "campanha", "conteúdo", "imagem", "criativo", "propaganda"]
        message_lower = message.lower()
        
        if any(kw in message_lower for kw in keywords):
            # Usa LLM para extrair o tema
            response = client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[
                    {"role": "system", "content": "Extraia o tema/assunto principal desta solicitação em 3-5 palavras. Se não houver tema claro, responda 'NENHUM'."},
                    {"role": "user", "content": message}
                ],
                temperature=0,
                max_tokens=20
            )
            theme = response.choices[0].message.content.strip()
            return None if theme == "NENHUM" else theme
        return None


class AgentSocialMedia:
    """
    Agente de Social Media
    Cria legendas engajadoras e gera imagens do Nano Banana.
    """
    
    def __init__(self):
        self.name = "Social Zen"
        self.instagram_persona = """Você é um social media expert que cria legendas 
para Instagram. Suas legendas são:
- Engajadoras e chamam para ação
- Usam emojis estrategicamente
- Incluem 3-5 hashtags relevantes no final
- Têm no máximo 200 caracteres
- São otimizadas para o algoritmo do Instagram"""

    def create_post(self, theme: str) -> dict:
        """
        Cria um post completo: legenda + imagem do Nano Banana.
        """
        # Gera legenda
        caption = self._generate_caption(theme)
        
        # Gera prompt para imagem
        image_prompt = self._generate_image_prompt(theme)
        
        # Gera imagem com Nano Banana
        image_url = self._generate_image_nano_banana(image_prompt)
        
        return {
            "caption": caption,
            "image_prompt": image_prompt,
            "image_url": image_url
        }
    
    def _generate_caption(self, theme: str) -> str:
        """Gera legenda engajadora para Instagram."""
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": self.instagram_persona},
                {"role": "user", "content": f"Crie uma legenda sobre: {theme}"}
            ],
            temperature=0.8,
            max_tokens=150
        )
        return response.choices[0].message.content
    
    def _generate_image_prompt(self, theme: str) -> str:
        """Gera prompt otimizado para imagem do Nano Banana."""
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "Você cria prompts para geração de imagens. O personagem é o 'Nano Banana' - uma banana animada e simpática. Crie prompts descritivos em inglês, focando em: cenário, ação, estilo visual. Máximo 50 palavras."},
                {"role": "user", "content": f"Crie um prompt de imagem com o Nano Banana sobre: {theme}"}
            ],
            temperature=0.7,
            max_tokens=100
        )
        return response.choices[0].message.content
    
    def _generate_image_nano_banana(self, prompt: str) -> str:
        """
        Gera imagem usando a API da fal.ai com modelo LoRA do Nano Banana.
        """
        try:
            # Faz a requisição para fal.ai com o modelo LoRA
            result = fal_client.subscribe(
                "fal-ai/flux-lora",
                arguments={
                    "prompt": prompt,
                    "loras": [
                        {
                            "path": LORA_PATH,
                            "scale": 1.0
                        }
                    ],
                    "image_size": "square",
                    "num_images": 1
                }
            )
            
            # Retorna URL da imagem gerada
            if result and "images" in result and len(result["images"]) > 0:
                return result["images"][0]["url"]
            return "[Erro: Nenhuma imagem retornada]"
            
        except Exception as e:
            return f"[Erro ao gerar imagem: {str(e)}]"


class AgentAds:
    """
    Agente de Gestão de Anúncios
    Analisa métricas e toma decisões de otimização.
    """
    
    def __init__(self):
        self.name = "Ads Zen"
        self.analyst_persona = """Você é um gestor de tráfego expert. Analise as métricas 
e dê uma recomendação CLARA e DIRETA:
- ESCALAR: se os números estão bons (CTR > 1%, CPC < R$3)
- PAUSAR: se o desempenho está ruim (CTR < 0.5%, CPC > R$5)
- OTIMIZAR: se há potencial mas precisa ajustes
Sua resposta deve ter no máximo 2 linhas explicando o motivo."""

    def analyze_performance(self, metrics: dict) -> dict:
        """
        Analisa métricas e retorna decisão + justificativa.
        
        Args:
            metrics: {'cpc': float, 'ctr': float, 'impressions': int, 'clicks': int}
        """
        # Formata métricas para o LLM
        metrics_text = f"""
Métricas do Anúncio:
- CPC (Custo por Clique): R$ {metrics.get('cpc', 0):.2f}
- CTR (Taxa de Clique): {metrics.get('ctr', 0):.2f}%
- Impressões: {metrics.get('impressions', 0):,}
- Cliques: {metrics.get('clicks', 0):,}
"""
        
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": self.analyst_persona},
                {"role": "user", "content": f"Analise estas métricas e decida:\n{metrics_text}"}
            ],
            temperature=0.3,
            max_tokens=100
        )
        
        analysis = response.choices[0].message.content
        
        # Extrai a decisão
        decision = "OTIMIZAR"  # default
        if "ESCALAR" in analysis.upper():
            decision = "ESCALAR"
        elif "PAUSAR" in analysis.upper():
            decision = "PAUSAR"
        
        return {
            "decision": decision,
            "analysis": analysis,
            "metrics": metrics
        }


# === CLASSE ORQUESTRADORA ===
class AgencyZen:
    """
    Orquestra os 3 agentes trabalhando juntos.
    """
    
    def __init__(self):
        self.whatsapp = AgentWhatsApp()
        self.social = AgentSocialMedia()
        self.ads = AgentAds()
    
    def run_full_cycle(self, client_message: str, ad_metrics: dict = None) -> dict:
        """
        Executa o ciclo completo:
        1. WhatsApp responde ao cliente
        2. Se há tema, Social cria o post
        3. Se há métricas, Ads analisa
        """
        results = {
            "whatsapp": None,
            "social": None,
            "ads": None
        }
        
        # Step 1: Agente WhatsApp
        print(f"\n🟢 [{self.whatsapp.name}] Processando mensagem...")
        whatsapp_result = self.whatsapp.process_message(client_message)
        results["whatsapp"] = whatsapp_result
        print(f"   Resposta: {whatsapp_result['reply']}")
        
        # Step 2: Agente Social (se há tema)
        if whatsapp_result.get("theme"):
            print(f"\n🟣 [{self.social.name}] Criando post sobre: {whatsapp_result['theme']}")
            social_result = self.social.create_post(whatsapp_result["theme"])
            results["social"] = social_result
            print(f"   Legenda: {social_result['caption']}")
            print(f"   Imagem: {social_result['image_url']}")
        
        # Step 3: Agente Ads (se há métricas)
        if ad_metrics:
            print(f"\n🔵 [{self.ads.name}] Analisando métricas...")
            ads_result = self.ads.analyze_performance(ad_metrics)
            results["ads"] = ads_result
            print(f"   Decisão: {ads_result['decision']}")
            print(f"   Análise: {ads_result['analysis']}")
        
        return results
