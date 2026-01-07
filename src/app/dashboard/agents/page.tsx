"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
    Home,
    Bot,
    Users,
    MessageSquare,
    GitBranch,
    Settings,
    Sparkles,
    Plus,
    Search,
    ChevronRight,
    Clock,
    MoreVertical,
    Edit,
    Trash2,
    Play,
    Pause,
    Crown,
    X
} from "lucide-react";

// ============== Types ==============

interface Agent {
    id: string;
    name: string;
    role: string;
    description: string;
    status: "active" | "idle" | "paused";
    tasks: number;
    color: string;
    icon: string;
    systemPrompt: string;
}

// ============== Default Agents ==============

const defaultAgents: Agent[] = [
    {
        id: "manager",
        name: "Gerente Geral",
        role: "Coordenador",
        description: "Coordena todos os agentes e aprova entregas",
        status: "active",
        tasks: 3,
        color: "from-amber-500 to-orange-600",
        icon: "👔",
        systemPrompt: "Você é o Gerente Geral da agência..."
    },
    {
        id: "whatsapp",
        name: "Zap Zen",
        role: "Atendimento WhatsApp",
        description: "Atendimento e qualificação de leads via WhatsApp",
        status: "active",
        tasks: 12,
        color: "from-green-500 to-emerald-600",
        icon: "💬",
        systemPrompt: "Você é o Zap Zen, especialista em atendimento..."
    },
    {
        id: "social",
        name: "Social Zen",
        role: "Social Media",
        description: "Criação de posts e conteúdo visual para redes sociais",
        status: "active",
        tasks: 5,
        color: "from-purple-500 to-pink-600",
        icon: "📱",
        systemPrompt: "Você é o Social Zen, especialista em social media..."
    },
    {
        id: "traffic",
        name: "Traffic Master",
        role: "Tráfego Pago",
        description: "Gestão de anúncios e otimização de campanhas",
        status: "idle",
        tasks: 2,
        color: "from-blue-500 to-cyan-600",
        icon: "📊",
        systemPrompt: "Você é o Traffic Master, especialista em tráfego pago..."
    },
];

// ============== Sidebar ==============

const sidebarItems = [
    { icon: Home, label: "Dashboard", href: "/dashboard" },
    { icon: Bot, label: "Agentes", href: "/dashboard/agents", active: true },
    { icon: Users, label: "Clientes", href: "/dashboard/clients" },
    { icon: MessageSquare, label: "Conversas", href: "/dashboard/conversations" },
    { icon: GitBranch, label: "Jornadas", href: "/dashboard/flow-editor" },
    { icon: Settings, label: "Configurações", href: "/dashboard/settings" },
];

// ============== Icon Options ==============

const iconOptions = ["👔", "💬", "📱", "📊", "🎨", "📧", "🎯", "💡", "🚀", "⚡", "🤖", "🧠"];

// ============== Agent Card ==============

function AgentCard({
    agent,
    onEdit,
    onDelete,
    isManager = false
}: {
    agent: Agent;
    onEdit: () => void;
    onDelete: () => void;
    isManager?: boolean;
}) {
    const [showMenu, setShowMenu] = useState(false);

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card rounded-2xl p-5 relative group"
        >
            {/* Menu */}
            <div className="absolute top-4 right-4">
                <button
                    onClick={() => setShowMenu(!showMenu)}
                    className="p-2 rounded-lg hover:bg-neutral-800 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                    <MoreVertical className="w-4 h-4 text-neutral-400" />
                </button>

                {showMenu && (
                    <div className="absolute top-10 right-0 w-40 glass-card rounded-xl py-2 z-10">
                        <button
                            onClick={() => { onEdit(); setShowMenu(false); }}
                            className="w-full px-4 py-2 text-left text-sm text-neutral-300 hover:bg-neutral-800 flex items-center gap-2"
                        >
                            <Edit className="w-4 h-4" /> Editar
                        </button>
                        {!isManager && (
                            <button
                                onClick={() => { onDelete(); setShowMenu(false); }}
                                className="w-full px-4 py-2 text-left text-sm text-red-400 hover:bg-neutral-800 flex items-center gap-2"
                            >
                                <Trash2 className="w-4 h-4" /> Excluir
                            </button>
                        )}
                    </div>
                )}
            </div>

            {/* Header */}
            <div className="flex items-center gap-4 mb-4">
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${agent.color} flex items-center justify-center text-3xl`}>
                    {agent.icon}
                </div>
                <div className="flex-1">
                    <div className="flex items-center gap-2">
                        {isManager && <Crown className="w-4 h-4 text-amber-400" />}
                        <h3 className="font-semibold text-white">{agent.name}</h3>
                    </div>
                    <p className="text-sm text-neutral-400">{agent.role}</p>
                </div>
            </div>

            {/* Status */}
            <div className="flex items-center gap-2 mb-4">
                <div className={`w-2 h-2 rounded-full ${agent.status === 'active' ? 'bg-green-500' :
                        agent.status === 'paused' ? 'bg-orange-500' : 'bg-neutral-500'
                    }`} />
                <span className="text-sm text-neutral-400">
                    {agent.status === 'active' ? 'Ativo' :
                        agent.status === 'paused' ? 'Pausado' : 'Ocioso'}
                </span>
            </div>

            {/* Description */}
            <p className="text-sm text-neutral-500 mb-4 line-clamp-2">{agent.description}</p>

            {/* Footer */}
            <div className="flex items-center justify-between pt-4 border-t border-neutral-800">
                <span className="text-sm text-neutral-500">
                    <Clock className="w-4 h-4 inline mr-1" />
                    {agent.tasks} tarefas
                </span>
                <Link
                    href={`/dashboard/agents/${agent.id}`}
                    className="flex items-center gap-1 text-sm text-green-400 hover:text-green-300 font-medium"
                >
                    Abrir <ChevronRight className="w-4 h-4" />
                </Link>
            </div>
        </motion.div>
    );
}

// ============== Create Agent Modal ==============

function CreateAgentModal({
    isOpen,
    onClose,
    onSave,
    editAgent
}: {
    isOpen: boolean;
    onClose: () => void;
    onSave: (agent: Partial<Agent>) => void;
    editAgent?: Agent | null;
}) {
    const [name, setName] = useState(editAgent?.name || "");
    const [role, setRole] = useState(editAgent?.role || "");
    const [description, setDescription] = useState(editAgent?.description || "");
    const [icon, setIcon] = useState(editAgent?.icon || "🤖");
    const [systemPrompt, setSystemPrompt] = useState(editAgent?.systemPrompt || "");

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 modal-backdrop flex items-center justify-center z-50 p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass-card rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-auto"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-white">
                        {editAgent ? "Editar Agente" : "Criar Novo Agente"}
                    </h2>
                    <button onClick={onClose} className="p-2 rounded-lg hover:bg-neutral-800">
                        <X className="w-5 h-5 text-neutral-400" />
                    </button>
                </div>

                {/* Icon Selection */}
                <div className="mb-6">
                    <label className="text-sm text-neutral-400 mb-3 block">Ícone</label>
                    <div className="flex flex-wrap gap-2">
                        {iconOptions.map((opt) => (
                            <button
                                key={opt}
                                onClick={() => setIcon(opt)}
                                className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl transition-all ${icon === opt
                                        ? 'bg-green-500/20 ring-2 ring-green-500'
                                        : 'bg-neutral-800 hover:bg-neutral-700'
                                    }`}
                            >
                                {opt}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Name */}
                <div className="mb-4">
                    <label className="text-sm text-neutral-400 mb-2 block">Nome do Agente</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Ex: Content Creator"
                        className="w-full input-dark input-glow"
                    />
                </div>

                {/* Role */}
                <div className="mb-4">
                    <label className="text-sm text-neutral-400 mb-2 block">Função</label>
                    <input
                        type="text"
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        placeholder="Ex: Criação de Conteúdo"
                        className="w-full input-dark input-glow"
                    />
                </div>

                {/* Description */}
                <div className="mb-4">
                    <label className="text-sm text-neutral-400 mb-2 block">Descrição</label>
                    <input
                        type="text"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="O que esse agente faz?"
                        className="w-full input-dark input-glow"
                    />
                </div>

                {/* System Prompt */}
                <div className="mb-6">
                    <label className="text-sm text-neutral-400 mb-2 block">
                        Prompt do Sistema (treinamento)
                    </label>
                    <textarea
                        value={systemPrompt}
                        onChange={(e) => setSystemPrompt(e.target.value)}
                        placeholder="Descreva como o agente deve se comportar, qual sua personalidade, regras, etc..."
                        rows={4}
                        className="w-full input-dark input-glow resize-none"
                    />
                    <p className="text-xs text-neutral-500 mt-1">
                        Este prompt define a personalidade e comportamento do agente.
                    </p>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 py-3 rounded-xl bg-neutral-800 text-neutral-300 font-medium hover:bg-neutral-700 transition-colors"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={() => {
                            onSave({ name, role, description, icon, systemPrompt });
                            onClose();
                        }}
                        disabled={!name.trim()}
                        className="flex-1 py-3 rounded-xl bg-green-600 text-white font-medium hover:bg-green-700 transition-colors disabled:opacity-50"
                    >
                        {editAgent ? "Salvar" : "Criar Agente"}
                    </button>
                </div>
            </motion.div>
        </div>
    );
}

// ============== Main Component ==============

export default function AgentsPage() {
    const [agents, setAgents] = useState<Agent[]>(defaultAgents);
    const [searchTerm, setSearchTerm] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editAgent, setEditAgent] = useState<Agent | null>(null);

    const filteredAgents = agents.filter(a =>
        a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.role.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSaveAgent = (agentData: Partial<Agent>) => {
        if (editAgent) {
            // Update existing
            setAgents(prev => prev.map(a =>
                a.id === editAgent.id ? { ...a, ...agentData } : a
            ));
        } else {
            // Create new
            const newAgent: Agent = {
                id: `agent_${Date.now()}`,
                name: agentData.name || "",
                role: agentData.role || "",
                description: agentData.description || "",
                status: "idle",
                tasks: 0,
                color: "from-green-500 to-emerald-600",
                icon: agentData.icon || "🤖",
                systemPrompt: agentData.systemPrompt || ""
            };
            setAgents(prev => [...prev, newAgent]);
        }
        setEditAgent(null);
    };

    const handleDeleteAgent = (id: string) => {
        setAgents(prev => prev.filter(a => a.id !== id));
    };

    return (
        <div className="min-h-screen flex evo-bg">
            {/* Sidebar */}
            <aside className="w-64 glass border-r border-neutral-800 p-4 flex flex-col">
                <div className="flex items-center gap-3 px-2 mb-8">
                    <div className="w-10 h-10 rounded-xl bg-green-600 flex items-center justify-center">
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
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-6 overflow-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-white">Meus Agentes</h1>
                        <p className="text-neutral-400">{agents.length} agentes configurados</p>
                    </div>
                    <button
                        onClick={() => { setEditAgent(null); setIsModalOpen(true); }}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-green-600 text-white hover:bg-green-700 transition-colors"
                    >
                        <Plus className="w-4 h-4" />
                        Novo Agente
                    </button>
                </div>

                {/* Search */}
                <div className="relative mb-6">
                    <Search className="w-5 h-5 text-neutral-500 absolute left-4 top-1/2 -translate-y-1/2" />
                    <input
                        type="text"
                        placeholder="Buscar agentes..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full max-w-md pl-12 pr-4 py-3 rounded-xl bg-neutral-900 border border-neutral-800 text-white placeholder-neutral-500 focus:outline-none focus:border-green-500"
                    />
                </div>

                {/* Agents Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredAgents.map((agent) => (
                        <AgentCard
                            key={agent.id}
                            agent={agent}
                            isManager={agent.id === "manager"}
                            onEdit={() => { setEditAgent(agent); setIsModalOpen(true); }}
                            onDelete={() => handleDeleteAgent(agent.id)}
                        />
                    ))}
                </div>

                {filteredAgents.length === 0 && (
                    <div className="text-center py-16">
                        <Bot className="w-16 h-16 text-neutral-700 mx-auto mb-4" />
                        <p className="text-neutral-500">Nenhum agente encontrado</p>
                    </div>
                )}
            </main>

            {/* Modal */}
            <CreateAgentModal
                isOpen={isModalOpen}
                onClose={() => { setIsModalOpen(false); setEditAgent(null); }}
                onSave={handleSaveAgent}
                editAgent={editAgent}
            />
        </div>
    );
}
