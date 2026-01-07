"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
    MessageSquare,
    Share2,
    BarChart3,
    Sparkles,
    ArrowRight,
    Zap,
    Bot,
    Target
} from "lucide-react";

export default function Home() {
    return (
        <main className="min-h-screen">
            {/* Header */}
            <header className="fixed top-0 left-0 right-0 z-50 glass">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                            <Sparkles className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-xl font-bold gradient-text">AgencyZen</span>
                    </div>
                    <nav className="hidden md:flex items-center gap-8">
                        <Link href="#features" className="text-gray-400 hover:text-white transition-colors">
                            Recursos
                        </Link>
                        <Link href="#agents" className="text-gray-400 hover:text-white transition-colors">
                            Agentes
                        </Link>
                        <Link href="#pricing" className="text-gray-400 hover:text-white transition-colors">
                            Preços
                        </Link>
                    </nav>
                    <Link
                        href="/dashboard"
                        className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 text-white font-medium hover:opacity-90 transition-opacity flex items-center gap-2"
                    >
                        Acessar Dashboard
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </header>

            {/* Hero Section */}
            <section className="pt-32 pb-20 px-6">
                <div className="max-w-7xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-center"
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8">
                            <Zap className="w-4 h-4 text-yellow-400" />
                            <span className="text-sm text-gray-300">Powered by GPT-4o & Flux.1</span>
                        </div>

                        <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
                            <span className="gradient-text">3 Agentes de IA</span>
                            <br />
                            trabalhando para você
                        </h1>

                        <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-10">
                            Automatize seu marketing com agentes inteligentes.
                            WhatsApp, Redes Sociais e Anúncios gerenciados por IA.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link
                                href="/dashboard"
                                className="px-8 py-4 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold text-lg hover:opacity-90 transition-opacity flex items-center gap-2 glow-purple"
                            >
                                Começar Agora
                                <ArrowRight className="w-5 h-5" />
                            </Link>
                            <Link
                                href="#demo"
                                className="px-8 py-4 rounded-xl glass text-white font-semibold text-lg hover:bg-white/10 transition-colors"
                            >
                                Ver Demonstração
                            </Link>
                        </div>
                    </motion.div>

                    {/* Stats */}
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                        className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6"
                    >
                        {[
                            { label: "Agentes Ativos", value: "3", icon: Bot },
                            { label: "Tarefas/Dia", value: "∞", icon: Zap },
                            { label: "Economia de Tempo", value: "90%", icon: Target },
                            { label: "ROI Médio", value: "3.5x", icon: BarChart3 },
                        ].map((stat, i) => (
                            <div key={i} className="glass-card rounded-2xl p-6 text-center hover-lift">
                                <stat.icon className="w-8 h-8 mx-auto mb-3 text-purple-400" />
                                <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                                <div className="text-sm text-gray-400">{stat.label}</div>
                            </div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Agents Section */}
            <section id="agents" className="py-20 px-6">
                <div className="max-w-7xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-4xl font-bold mb-4">
                            <span className="gradient-text">3 Agentes Independentes</span>
                        </h2>
                        <p className="text-gray-400 text-lg">
                            Cada agente trabalha de forma autônoma. Você só dá o prompt.
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Agent 1: WhatsApp */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="glass-card rounded-3xl p-8 hover-lift"
                        >
                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center mb-6 glow-green">
                                <MessageSquare className="w-8 h-8 text-white" />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-3">Agente WhatsApp</h3>
                            <p className="text-gray-400 mb-6">
                                Comunica com clientes, coleta briefings, envia conteúdo para aprovação e processa feedback automaticamente.
                            </p>
                            <ul className="space-y-3">
                                {[
                                    "Atendimento 24/7",
                                    "Coleta briefings",
                                    "Envia para aprovação",
                                    "Processa feedback"
                                ].map((item, i) => (
                                    <li key={i} className="flex items-center gap-2 text-sm text-gray-300">
                                        <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </motion.div>

                        {/* Agent 2: Social Media */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            className="glass-card rounded-3xl p-8 hover-lift"
                        >
                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center mb-6 glow-purple">
                                <Share2 className="w-8 h-8 text-white" />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-3">Agente Social Media</h3>
                            <p className="text-gray-400 mb-6">
                                Cria legendas, criativos, seguindo a identidade visual e tom de voz do cliente. Programa e publica.
                            </p>
                            <ul className="space-y-3">
                                {[
                                    "Legendas com IA",
                                    "Criativos Flux.1",
                                    "Identidade visual",
                                    "Agendamento automático"
                                ].map((item, i) => (
                                    <li key={i} className="flex items-center gap-2 text-sm text-gray-300">
                                        <div className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </motion.div>

                        {/* Agent 3: Ads */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.3 }}
                            className="glass-card rounded-3xl p-8 hover-lift"
                        >
                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center mb-6 glow-blue">
                                <BarChart3 className="w-8 h-8 text-white" />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-3">Agente de Anúncios</h3>
                            <p className="text-gray-400 mb-6">
                                Cria e otimiza campanhas no Meta Ads e Google Ads. Análise de nicho, palavras-chave e otimização 24h.
                            </p>
                            <ul className="space-y-3">
                                {[
                                    "Meta + Google Ads",
                                    "Análise de nicho",
                                    "Negativação auto",
                                    "Otimização 24/7"
                                ].map((item, i) => (
                                    <li key={i} className="flex items-center gap-2 text-sm text-gray-300">
                                        <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 px-6">
                <div className="max-w-4xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="glass-card rounded-3xl p-12 text-center"
                    >
                        <h2 className="text-4xl font-bold text-white mb-4">
                            Pronto para automatizar?
                        </h2>
                        <p className="text-gray-400 text-lg mb-8">
                            Comece a usar os 3 agentes agora. Sem código, sem configuração complexa.
                        </p>
                        <Link
                            href="/dashboard"
                            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold text-lg hover:opacity-90 transition-opacity glow-purple"
                        >
                            Acessar Dashboard
                            <ArrowRight className="w-5 h-5" />
                        </Link>
                    </motion.div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-10 px-6 border-t border-white/10">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                            <Sparkles className="w-4 h-4 text-white" />
                        </div>
                        <span className="font-semibold text-white">AgencyZen</span>
                    </div>
                    <p className="text-gray-500 text-sm">
                        © 2026 AgencyZen. Todos os direitos reservados.
                    </p>
                </div>
            </footer>
        </main>
    );
}
