"""
Image Generator
Geração de imagens usando Replicate (Flux, SDXL, etc.)
Muito barato: ~$0.003 por imagem
"""

import os
from typing import Optional
import httpx
import asyncio


class ImageGenerator:
    """
    Gerador de imagens usando Replicate API.
    
    Modelos disponíveis:
    - flux-schnell: Rápido e barato ($0.003/imagem)
    - flux-pro: Melhor qualidade ($0.05/imagem)
    - sdxl: Stable Diffusion XL ($0.01/imagem)
    """
    
    # Modelos disponíveis no Replicate
    MODELS = {
        "flux-schnell": "black-forest-labs/flux-schnell",
        "flux-pro": "black-forest-labs/flux-pro",
        "sdxl": "stability-ai/sdxl:39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b",
        "kandinsky": "ai-forever/kandinsky-2.2:ea1addaab376f4dc227f5368bbd8ac01a63b8cc3df21b41daa35e63f5d4e3f1"
    }
    
    def __init__(self, api_token: Optional[str] = None):
        self.api_token = api_token or os.getenv("REPLICATE_API_TOKEN")
        self.base_url = "https://api.replicate.com/v1"
        
    async def generate(
        self,
        prompt: str,
        model: str = "flux-schnell",
        style: Optional[str] = None,
        width: int = 1024,
        height: int = 1024,
        num_outputs: int = 1
    ) -> dict:
        """
        Gera imagem a partir de prompt.
        
        Args:
            prompt: Descrição da imagem
            model: Modelo a usar (flux-schnell, flux-pro, sdxl)
            style: Estilo adicional
            width: Largura
            height: Altura
            num_outputs: Número de imagens
            
        Returns:
            Dict com URL da imagem gerada
        """
        if not self.api_token:
            return {
                "success": False,
                "error": "API token não configurado. Configure REPLICATE_API_TOKEN."
            }
        
        # Ajusta prompt com estilo
        full_prompt = prompt
        if style:
            style_prompts = {
                "realistic": "photorealistic, high quality, detailed, 8k",
                "cartoon": "cartoon style, colorful, animated",
                "minimalist": "minimalist design, clean, simple",
                "artistic": "artistic, creative, abstract",
                "professional": "professional, corporate, clean design"
            }
            full_prompt = f"{prompt}, {style_prompts.get(style, style)}"
        
        model_version = self.MODELS.get(model, self.MODELS["flux-schnell"])
        
        headers = {
            "Authorization": f"Token {self.api_token}",
            "Content-Type": "application/json"
        }
        
        # Input varia por modelo
        if "flux" in model:
            input_data = {
                "prompt": full_prompt,
                "num_outputs": num_outputs,
                "aspect_ratio": "1:1" if width == height else "16:9"
            }
        else:
            input_data = {
                "prompt": full_prompt,
                "width": width,
                "height": height,
                "num_outputs": num_outputs
            }
        
        payload = {
            "version": model_version.split(":")[-1] if ":" in model_version else None,
            "input": input_data
        }
        
        # Se o modelo não tem versão específica, usa o endpoint de modelo
        if ":" not in model_version:
            endpoint = f"{self.base_url}/models/{model_version}/predictions"
            del payload["version"]
        else:
            endpoint = f"{self.base_url}/predictions"
        
        try:
            async with httpx.AsyncClient() as client:
                # Cria predição
                response = await client.post(
                    endpoint,
                    headers=headers,
                    json=payload,
                    timeout=30.0
                )
                
                if response.status_code != 201:
                    return {
                        "success": False,
                        "error": f"Erro ao criar predição: {response.text}"
                    }
                
                prediction = response.json()
                prediction_id = prediction["id"]
                
                # Aguarda resultado (polling)
                for _ in range(60):  # Max 60 segundos
                    await asyncio.sleep(1)
                    
                    status_response = await client.get(
                        f"{self.base_url}/predictions/{prediction_id}",
                        headers=headers
                    )
                    
                    status = status_response.json()
                    
                    if status["status"] == "succeeded":
                        output = status["output"]
                        return {
                            "success": True,
                            "images": output if isinstance(output, list) else [output],
                            "model": model,
                            "prompt": full_prompt
                        }
                    
                    elif status["status"] == "failed":
                        return {
                            "success": False,
                            "error": status.get("error", "Geração falhou")
                        }
                
                return {
                    "success": False,
                    "error": "Timeout aguardando geração"
                }
                
        except Exception as e:
            return {
                "success": False,
                "error": str(e)
            }
    
    async def generate_for_social(
        self,
        description: str,
        brand_colors: list = None,
        style: str = "professional"
    ) -> dict:
        """
        Gera imagem otimizada para redes sociais.
        """
        prompt = f"Social media post image: {description}"
        
        if brand_colors:
            color_str = ", ".join(brand_colors)
            prompt += f", using colors: {color_str}"
        
        prompt += ", modern design, eye-catching, suitable for Instagram/Facebook"
        
        return await self.generate(
            prompt=prompt,
            style=style,
            width=1080,
            height=1080
        )
    
    async def generate_for_ads(
        self,
        product: str,
        target_audience: str,
        platform: str = "meta"
    ) -> dict:
        """
        Gera imagem otimizada para anúncios.
        """
        prompt = f"Advertisement image for {product}, targeting {target_audience}"
        
        if platform == "meta":
            prompt += ", Facebook/Instagram ad style"
        elif platform == "google":
            prompt += ", Google Display Network style"
        
        prompt += ", professional, high conversion, clear message"
        
        return await self.generate(
            prompt=prompt,
            style="professional",
            width=1200,
            height=628  # Formato recomendado para ads
        )
    
    def get_available_models(self) -> list:
        """Retorna modelos disponíveis"""
        return [
            {
                "id": "flux-schnell",
                "name": "Flux Schnell",
                "price": "$0.003/imagem",
                "speed": "Rápido",
                "quality": "Boa"
            },
            {
                "id": "flux-pro",
                "name": "Flux Pro",
                "price": "$0.05/imagem",
                "speed": "Médio",
                "quality": "Excelente"
            },
            {
                "id": "sdxl",
                "name": "Stable Diffusion XL",
                "price": "$0.01/imagem",
                "speed": "Médio",
                "quality": "Muito boa"
            }
        ]
