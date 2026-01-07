"""
AgencyZen - Script de Execução
==============================
Rode este script para interagir com os 3 Agentes de IA.
"""

import os
from dotenv import load_dotenv

# Carrega variáveis de ambiente
load_dotenv()

# Verifica se as chaves estão configuradas
if not os.getenv("OPENAI_API_KEY"):
    print("❌ ERRO: Configure sua OPENAI_API_KEY no arquivo .env")
    print("   Copie o .env.example para .env e adicione suas chaves.")
    exit(1)

if not os.getenv("FAL_KEY"):
    print("⚠️  AVISO: FAL_KEY não configurada. Geração de imagens não funcionará.")

# Importa os agentes
from agents import AgencyZen


def print_header():
    """Mostra header bonito no terminal."""
    print("\n" + "="*60)
    print("     🍌 AgencyZen - Sistema Multi-Agente de IA 🍌")
    print("="*60)
    print("  Agentes:")
    print("    🟢 Zap Zen      - Atendimento WhatsApp")
    print("    🟣 Social Zen   - Criação de Posts + Nano Banana")
    print("    🔵 Ads Zen      - Análise de Métricas")
    print("="*60)


def get_simulated_metrics():
    """Retorna métricas simuladas para teste."""
    return {
        "cpc": 4.50,
        "ctr": 0.8,
        "impressions": 12500,
        "clicks": 100
    }


def main():
    """Loop principal de interação."""
    print_header()
    
    # Inicializa a agência
    agency = AgencyZen()
    
    print("\n💬 Digite mensagens como se fosse um cliente.")
    print("   Para sair, digite 'sair' ou 'exit'.\n")
    
    while True:
        # Recebe mensagem do "cliente"
        try:
            client_message = input("\n🙋 Cliente disse: ").strip()
        except KeyboardInterrupt:
            print("\n\n👋 Até logo!")
            break
        
        if not client_message:
            print("   (mensagem vazia, tente novamente)")
            continue
        
        if client_message.lower() in ["sair", "exit", "quit"]:
            print("\n👋 Até logo! Obrigado por usar o AgencyZen.")
            break
        
        print("\n" + "-"*50)
        print("🚀 Iniciando ciclo dos agentes...")
        print("-"*50)
        
        # Executa o ciclo completo
        results = agency.run_full_cycle(
            client_message=client_message,
            ad_metrics=get_simulated_metrics()
        )
        
        print("\n" + "-"*50)
        print("✅ Ciclo completo!")
        print("-"*50)


if __name__ == "__main__":
    main()
