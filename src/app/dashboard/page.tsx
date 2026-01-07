"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
    Home,
    Bot,
    Users,
    MessageSquare,
    GitBranch,
    Settings,
    Sparkles,
    TrendingUp,
    UserCheck,
    Zap,
    Clock,
    ChevronRight,
    Plus,
    Activity,
    BarChart3
} from "lucide-react";

// ============== Sidebar ==============

const sidebarItems = [
    { icon: Home, label: "Dashboard", href: "/dashboard", active: true },
    { icon: Bot, label: "Agentes", href: "/dashboard/agents" },
    { icon: Users, label: "Clientes", href: "/dashboard/clients" },
    { icon: MessageSquare, label: "Conversas", href: "/dashboard/conversations" },
    { icon: GitBranch, label: "Jornadas", href: "/dashboard/flow-editor" },
    { icon: Settings, label: "Configurações", href: "/dashboard/settings" },
];

// ============== Stats Data ==============

const statsData = [
    {
        label: "Mensagens Hoje",
        value: "247",
        change: "+12%",
        icon: MessageSquare,
        color: "bg-green-500/20 text-green-400"
    },
    {
        label: "Leads Qualificados",
        value: "38",
        change: "+8%",
        icon: UserCheck,
        color: "bg-blue-500/20 text-blue-400"
    },
    {
        label: "Agentes Ativos",
        value: "4",
        change: "100%",
        icon: Bot,
        color: "bg-purple-500/20 text-purple-400"
    },
    {
        label: "Taxa de Resposta",
        value: "98%",
        change: "+2%",
        icon: Zap,
        color: "bg-orange-500/20 text-orange-400"
    },
];

// ============== Agents Data ==============

const agentsData = [
    {
        id: "manager",
        name: "Gerente Geral",
        role: "Coordenador",
        status: "active",
        tasks: 3,
        color: "from-amber-500 to-orange-600",
        icon: "👔"
    },
    {
        id: "whatsapp",
        name: "Zap Zen",
        role: "Atendimento",
        status: "active",
        tasks: 12,
        color: "from-green-500 to-emerald-600",
        icon: "💬"
    },
    {
        id: "social",
        name: "Social Zen",
        role: "Social Media",
        status: "active",
        tasks: 5,
        color: "from-purple-500 to-pink-600",
        icon: "📱"
    },
    {
        id: "traffic",
        name: "Traffic Master",
        role: "Tráfego Pago",
        status: "idle",
        tasks: 2,
        color: "from-blue-500 to-cyan-600",
        icon: "📊"
    },
];

// ============== Recent Activity ==============

const recentActivity = [
    {
        agent: "Zap Zen",
        action: "Respondeu lead: Isabella Rainer",
        time: "2 min atrás",
        type: "message"
    },
    {
        agent: "Social Zen",
        action: "Criou post para Tech Solutions",
        time: "15 min atrás",
        type: "post"
    },
    {
        agent: "Gerente Geral",
        action: "Aprovou campanha de Janeiro",
        time: "1 hora atrás",
        type: "approval"
    },
    {
        agent: "Traffic Master",
        action: "Otimizou campanha Meta Ads",
        time: "3 horas atrás",
        type: "optimization"
    },
];

// ============== Main Component ==============

export default function DashboardPage() {
    const [currentTime, setCurrentTime] = useState<string>("");

    useEffect(() => {
        const updateTime = () => {
            setCurrentTime(new Date().toLocaleTimeString('pt-BR', {
                hour: '2-digit',
                minute: '2-digit'
            }));
        };
        updateTime();
        const interval = setInterval(updateTime, 1000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="min-h-screen flex evo-bg">
            {/* Sidebar */}
            <aside className="w-64 glass border-r border-neutral-800 p-4 flex flex-col">
                <div className="flex items-center gap-3 px-2 mb-8">
                    <div className="w-10 h-10 rounded-xl bg-green-600 flex items-center justify-center neon-green-subtle">
                        <Sparkles className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <span className="text-lg font-bold text-white block">AgencyZen</span>
                        <span className="text-xs text-neutral-500">v3.0</span>
                    </div>
                </div>

                <nav className="space-y-1 flex-1">
                    {sidebarItems.map((item, i) => (
                        <Link
                            key={i}
                            href={item.href}
                            className={`sidebar-item relative ${item.active ? 'active' : ''}`}
                        >
                            <item.icon className="w-5 h-5" />
                            <span className="font-medium">{item.label}</span>
                        </Link>
                    ))}
                </nav>

                {/* Status */}
                <div className="glass-card rounded-xl p-4 mt-4">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="status-online" />
                        <span className="text-sm text-white">Sistema Online</span>
                    </div>
                    <p className="text-xs text-neutral-500">Última sync: {currentTime}</p>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-6 overflow-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
                        <p className="text-neutral-400">Bem-vindo de volta! Aqui está o resumo de hoje.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Link
                            href="/dashboard/agents"
                            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-green-600 text-white hover:bg-green-700 transition-colors"
                        >
                            <Plus className="w-4 h-4" />
                            Novo Agente
                        </Link>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    {statsData.map((stat, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="glass-card rounded-2xl p-5"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${stat.color}`}>
                                    <stat.icon className="w-5 h-5" />
                                </div>
                                <span className="text-green-400 text-sm font-medium">{stat.change}</span>
                            </div>
                            <p className="text-3xl font-bold text-white mb-1">{stat.value}</p>
                            <p className="text-sm text-neutral-400">{stat.label}</p>
                        </motion.div>
                    ))}
                </div>

                <div className="grid lg:grid-cols-3 gap-6">
                    {/* Agents */}
                    <div className="lg:col-span-2">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-semibold text-white">Agentes</h2>
                            <Link href="/dashboard/agents" className="text-sm text-green-400 hover:text-green-300 flex items-center gap-1">
                                Ver todos <ChevronRight className="w-4 h-4" />
                            </Link>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                            {agentsData.map((agent, i) => (
                                <motion.div
                                    key={agent.id}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: i * 0.1 }}
                                    className="glass-card rounded-2xl p-5 hover:border-green-500/30 transition-colors cursor-pointer"
                                >
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${agent.color} flex items-center justify-center text-2xl`}>
                                            {agent.icon}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2">
                                                <h3 className="font-semibold text-white">{agent.name}</h3>
                                                <div className={`w-2 h-2 rounded-full ${agent.status === 'active' ? 'bg-green-500' : 'bg-neutral-500'}`} />
                                            </div>
                                            <p className="text-sm text-neutral-400">{agent.role}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-neutral-500">
                                            <Clock className="w-4 h-4 inline mr-1" />
                                            {agent.tasks} tarefas
                                        </span>
                                        <Link
                                            href={`/dashboard/agents/${agent.id}`}
                                            className="text-sm text-green-400 hover:text-green-300"
                                        >
                                            Abrir →
                                        </Link>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Recent Activity */}
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-semibold text-white">Atividade Recente</h2>
                            <Activity className="w-5 h-5 text-neutral-500" />
                        </div>

                        <div className="glass-card rounded-2xl p-4">
                            <div className="space-y-4">
                                {recentActivity.map((activity, i) => (
                                    <div key={i} className="flex items-start gap-3 pb-4 border-b border-neutral-800 last:border-0 last:pb-0">
                                        <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center">
                                            <Bot className="w-4 h-4 text-green-400" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm text-white">
                                                <span className="font-medium">{activity.agent}</span>
                                                {" "}
                                                <span className="text-neutral-400">{activity.action}</span>
                                            </p>
                                            <span className="text-xs text-neutral-500">{activity.time}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="mt-8">
                    <h2 className="text-lg font-semibold text-white mb-4">Ações Rápidas</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <Link
                            href="/dashboard/flow-editor"
                            className="glass-card rounded-xl p-4 hover:border-green-500/30 transition-colors group"
                        >
                            <GitBranch className="w-6 h-6 text-green-400 mb-3 group-hover:scale-110 transition-transform" />
                            <h3 className="font-medium text-white">Criar Jornada</h3>
                            <p className="text-sm text-neutral-500">Editor visual de fluxos</p>
                        </Link>

                        <Link
                            href="/dashboard/conversations"
                            className="glass-card rounded-xl p-4 hover:border-green-500/30 transition-colors group"
                        >
                            <MessageSquare className="w-6 h-6 text-blue-400 mb-3 group-hover:scale-110 transition-transform" />
                            <h3 className="font-medium text-white">Ver Conversas</h3>
                            <p className="text-sm text-neutral-500">12 não lidas</p>
                        </Link>

                        <Link
                            href="/dashboard/clients"
                            className="glass-card rounded-xl p-4 hover:border-green-500/30 transition-colors group"
                        >
                            <Users className="w-6 h-6 text-purple-400 mb-3 group-hover:scale-110 transition-transform" />
                            <h3 className="font-medium text-white">Gerenciar Clientes</h3>
                            <p className="text-sm text-neutral-500">8 clientes ativos</p>
                        </Link>

                        <Link
                            href="/dashboard/settings"
                            className="glass-card rounded-xl p-4 hover:border-green-500/30 transition-colors group"
                        >
                            <Settings className="w-6 h-6 text-neutral-400 mb-3 group-hover:scale-110 transition-transform" />
                            <h3 className="font-medium text-white">Configurações</h3>
                            <p className="text-sm text-neutral-500">API Keys, Integrações</p>
                        </Link>
                    </div>
                </div>
            </main>
        </div>
    );
}
