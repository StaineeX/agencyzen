"use client";

import { useState, useRef, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
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
    ArrowLeft,
    Send,
    Play,
    Pause,
    Save,
    Key,
    Eye,
    EyeOff,
    QrCode,
    Check,
    X,
    Clock,
    CheckCircle,
    XCircle,
    User,
    Palette,
    Target,
    FileText
} from "lucide-react";

// ============== Types ==============

interface Message {
    id: string;
    role: "user" | "assistant";
    content: string;
    timestamp: Date;
}

interface ClientTraining {
    id: string;
    name: string;
    logo?: string;
    colors: string[];
    toneOfVoice: string;
    examples: string[];
    hashtags: string[];
    targetAudience: string;
}

interface PendingApproval {
    id: string;
    type: "post" | "ad";
    title: string;
    content: string;
    agent: string;
    client: string;
    submittedAt: Date;
}

// ============== Agent Data ==============

const agentsData: Record<string, any> = {
    manager: {
        id: "manager",
        name: "Gerente Geral",
        role: "Coordenador",
        description: "Coordena todos os agentes e aprova entregas",
        icon: "👔",
        color: "from-amber-500 to-orange-600",
        systemPrompt: "Você é o Gerente Geral da agência. Coordena os outros agentes e aprova posts/anúncios.",
        quickActions: ["Aprovar posts", "Aprovar anúncios", "Supervisionar equipe", "Pensar como você"]
    },
    whatsapp: {
        id: "whatsapp",
        name: "Zap Zen",
        role: "Atendimento WhatsApp",
        description: "Atendimento e qualificação de leads via WhatsApp",
        icon: "💬",
        color: "from-green-500 to-emerald-600",
        systemPrompt: "Você é o Zap Zen, especialista em atendimento ao cliente via WhatsApp.",
        quickActions: ["Conectar WhatsApp", "Script de atendimento", "Qualificar leads", "Responder 24/7"]
    },
    social: {
        id: "social",
        name: "Social Zen",
        role: "Social Media",
        description: "Criação de posts e conteúdo visual para redes sociais",
        icon: "📱",
        color: "from-purple-500 to-pink-600",
        systemPrompt: "Você é o Social Zen, especialista em social media.",
        quickActions: ["Criar legendas", "Gerar imagens", "Identidade visual", "Por cliente"]
    },
    traffic: {
        id: "traffic",
        name: "Traffic Master",
        role: "Tráfego Pago",
        description: "Gestão de anúncios e otimização de campanhas",
        icon: "📊",
        color: "from-blue-500 to-cyan-600",
        systemPrompt: "Você é o Traffic Master, especialista em tráfego pago.",
        quickActions: ["Criar campanha", "Analisar métricas", "Otimizar anúncios", "Relatórios"]
    }
};

// ============== Mock Data ==============

const mockPendingApprovals: PendingApproval[] = [
    {
        id: "1",
        type: "post",
        title: "Post Instagram - Tech Solutions",
        content: "🚀 Transforme seu negócio com tecnologia! Descubra como a automação pode aumentar sua produtividade em 300%...",
        agent: "Social Zen",
        client: "Tech Solutions",
        submittedAt: new Date()
    },
    {
        id: "2",
        type: "ad",
        title: "Campanha Meta - Moda Feminina",
        content: "Campanha de conversão para coleção de verão. Orçamento: R$500/dia. Público: Mulheres 25-45...",
        agent: "Traffic Master",
        client: "Loja Fashion",
        submittedAt: new Date()
    }
];

const mockClients: ClientTraining[] = [
    { id: "1", name: "Tech Solutions", colors: ["#22c55e", "#3b82f6"], toneOfVoice: "Profissional e inovador", examples: [], hashtags: ["#tech", "#inovação"], targetAudience: "Empresários 30-50" },
    { id: "2", name: "Loja Fashion", colors: ["#ec4899", "#f43f5e"], toneOfVoice: "Jovem e descolado", examples: [], hashtags: ["#moda", "#fashion"], targetAudience: "Mulheres 20-35" }
];

// ============== Sidebar ==============

const sidebarItems = [
    { icon: Home, label: "Dashboard", href: "/dashboard" },
    { icon: Bot, label: "Agentes", href: "/dashboard/agents" },
    { icon: Users, label: "Clientes", href: "/dashboard/clients" },
    { icon: MessageSquare, label: "Conversas", href: "/dashboard/conversations" },
    { icon: GitBranch, label: "Jornadas", href: "/dashboard/flow-editor" },
    { icon: Settings, label: "Configurações", href: "/dashboard/settings" },
];

// ============== Main Component ==============

export default function AgentDetailPage() {
    const params = useParams();
    const router = useRouter();
    const agentId = params.id as string;
    const agent = agentsData[agentId];

    const [activeTab, setActiveTab] = useState("chat");
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputMessage, setInputMessage] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const [showApiKey, setShowApiKey] = useState(false);
    const [apiKey, setApiKey] = useState("");
    const [pendingApprovals, setPendingApprovals] = useState(mockPendingApprovals);
    const [clients] = useState(mockClients);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    if (!agent) {
        return (
            <div className="min-h-screen flex items-center justify-center evo-bg">
                <div className="text-center">
                    <Bot className="w-16 h-16 text-neutral-700 mx-auto mb-4" />
                    <p className="text-neutral-500">Agente não encontrado</p>
                    <Link href="/dashboard/agents" className="text-green-400 hover:text-green-300 mt-4 inline-block">
                        ← Voltar para agentes
                    </Link>
                </div>
            </div>
        );
    }

    const handleSendMessage = async () => {
        if (!inputMessage.trim()) return;

        const userMessage: Message = {
            id: `${Date.now()}`,
            role: "user",
            content: inputMessage,
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        setInputMessage("");
        setIsTyping(true);

        // Simula resposta do agente
        setTimeout(() => {
            const response: Message = {
                id: `${Date.now()}`,
                role: "assistant",
                content: `[${agent.name}] Entendi sua mensagem sobre "${inputMessage.slice(0, 50)}...". Vou processar isso para você. Configure a API Key da OpenAI nas configurações para respostas reais.`,
                timestamp: new Date()
            };
            setMessages(prev => [...prev, response]);
            setIsTyping(false);
        }, 1500);
    };

    const handleApprove = (id: string) => {
        setPendingApprovals(prev => prev.filter(p => p.id !== id));
    };

    const handleReject = (id: string) => {
        setPendingApprovals(prev => prev.filter(p => p.id !== id));
    };

    const tabs = [
        { id: "chat", label: "Chat", icon: MessageSquare },
        { id: "config", label: "Configuração", icon: Settings },
        { id: "clients", label: "Clientes", icon: Users },
        { id: "tasks", label: "Tarefas", icon: Clock },
        ...(agentId === "manager" ? [{ id: "approvals", label: "Aprovações", icon: CheckCircle }] : [])
    ];

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
                        <Link key={i} href={item.href} className="sidebar-item relative">
                            <item.icon className="w-5 h-5" />
                            <span className="font-medium">{item.label}</span>
                        </Link>
                    ))}
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col">
                {/* Header */}
                <header className="p-4 border-b border-neutral-800 flex items-center gap-4">
                    <Link href="/dashboard/agents" className="p-2 rounded-lg hover:bg-neutral-800">
                        <ArrowLeft className="w-5 h-5 text-neutral-400" />
                    </Link>
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${agent.color} flex items-center justify-center text-2xl`}>
                        {agent.icon}
                    </div>
                    <div className="flex-1">
                        <h1 className="text-xl font-bold text-white">{agent.name}</h1>
                        <p className="text-sm text-neutral-400">{agent.description}</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-500" />
                        <span className="text-sm text-neutral-400">Ativo</span>
                    </div>
                </header>

                {/* Tabs */}
                <div className="p-4 border-b border-neutral-800 flex gap-2">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${activeTab === tab.id
                                    ? "bg-green-500/20 text-green-400"
                                    : "text-neutral-400 hover:bg-neutral-800"
                                }`}
                        >
                            <tab.icon className="w-4 h-4" />
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Tab Content */}
                <div className="flex-1 overflow-auto">
                    {/* Chat Tab */}
                    {activeTab === "chat" && (
                        <div className="flex flex-col h-full">
                            {/* Quick Actions */}
                            {messages.length === 0 && (
                                <div className="flex-1 flex flex-col items-center justify-center p-8">
                                    <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${agent.color} flex items-center justify-center text-4xl mb-6`}>
                                        {agent.icon}
                                    </div>
                                    <h2 className="text-xl font-bold text-white mb-2">Olá! Eu sou {agent.name}</h2>
                                    <p className="text-neutral-400 text-center mb-8">{agent.description}. Como posso ajudar?</p>
                                    <div className="flex flex-wrap gap-2 justify-center">
                                        {agent.quickActions.map((action: string, i: number) => (
                                            <button
                                                key={i}
                                                onClick={() => setInputMessage(action)}
                                                className="px-4 py-2 rounded-full bg-neutral-800 text-neutral-300 hover:bg-neutral-700 transition-colors text-sm"
                                            >
                                                {action}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Messages */}
                            {messages.length > 0 && (
                                <div className="flex-1 overflow-auto p-4">
                                    {messages.map((msg) => (
                                        <div key={msg.id} className={`flex mb-4 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                                            <div className={`max-w-[70%] px-4 py-3 ${msg.role === "user"
                                                    ? "chat-message-user"
                                                    : "chat-message-bot"
                                                }`}>
                                                <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                                            </div>
                                        </div>
                                    ))}
                                    {isTyping && (
                                        <div className="flex justify-start mb-4">
                                            <div className="chat-message-bot px-4 py-3">
                                                <div className="flex gap-1">
                                                    <span className="w-2 h-2 bg-neutral-500 rounded-full animate-bounce" />
                                                    <span className="w-2 h-2 bg-neutral-500 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }} />
                                                    <span className="w-2 h-2 bg-neutral-500 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                    <div ref={messagesEndRef} />
                                </div>
                            )}

                            {/* Input */}
                            <div className="p-4 border-t border-neutral-800">
                                <div className="flex gap-3">
                                    <input
                                        type="text"
                                        placeholder={`Fale com ${agent.name}...`}
                                        value={inputMessage}
                                        onChange={(e) => setInputMessage(e.target.value)}
                                        onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                                        className="flex-1 input-dark input-glow"
                                    />
                                    <button
                                        onClick={handleSendMessage}
                                        className="p-3 rounded-xl bg-green-600 text-white hover:bg-green-700 transition-colors"
                                    >
                                        <Send className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Config Tab */}
                    {activeTab === "config" && (
                        <div className="p-6 max-w-2xl">
                            <h2 className="text-lg font-semibold text-white mb-6">Configuração do Agente</h2>

                            {/* System Prompt */}
                            <div className="glass-card rounded-xl p-5 mb-6">
                                <label className="font-medium text-white mb-3 block">Prompt do Sistema (Treinamento)</label>
                                <textarea
                                    defaultValue={agent.systemPrompt}
                                    rows={4}
                                    className="w-full input-dark resize-none"
                                    placeholder="Descreva como este agente deve se comportar..."
                                />
                                <p className="text-xs text-neutral-500 mt-2">Este prompt define a personalidade e comportamento do agente.</p>
                            </div>

                            {/* API Key */}
                            <div className="glass-card rounded-xl p-5 mb-6">
                                <div className="flex items-center gap-3 mb-3">
                                    <Key className="w-5 h-5 text-green-400" />
                                    <label className="font-medium text-white">OpenAI API Key</label>
                                </div>
                                <div className="relative">
                                    <input
                                        type={showApiKey ? "text" : "password"}
                                        value={apiKey}
                                        onChange={(e) => setApiKey(e.target.value)}
                                        placeholder="sk-..."
                                        className="w-full input-dark pr-12"
                                    />
                                    <button onClick={() => setShowApiKey(!showApiKey)} className="absolute right-3 top-1/2 -translate-y-1/2">
                                        {showApiKey ? <EyeOff className="w-4 h-4 text-neutral-500" /> : <Eye className="w-4 h-4 text-neutral-500" />}
                                    </button>
                                </div>
                            </div>

                            {/* WhatsApp QR Code (for whatsapp agent only) */}
                            {agentId === "whatsapp" && (
                                <div className="glass-card rounded-xl p-5 mb-6">
                                    <div className="flex items-center gap-3 mb-4">
                                        <QrCode className="w-5 h-5 text-green-400" />
                                        <label className="font-medium text-white">Conectar WhatsApp</label>
                                    </div>
                                    <div className="bg-white rounded-xl p-4 w-48 h-48 flex items-center justify-center mx-auto mb-4">
                                        <QrCode className="w-32 h-32 text-neutral-800" />
                                    </div>
                                    <p className="text-center text-sm text-neutral-400">Escaneie o código QR com seu WhatsApp</p>
                                </div>
                            )}

                            <button className="w-full py-3 rounded-xl bg-green-600 text-white font-medium hover:bg-green-700 transition-colors">
                                <Save className="w-4 h-4 inline mr-2" />
                                Salvar Configurações
                            </button>
                        </div>
                    )}

                    {/* Clients Tab */}
                    {activeTab === "clients" && (
                        <div className="p-6">
                            <h2 className="text-lg font-semibold text-white mb-6">Treinamento por Cliente</h2>
                            <div className="grid md:grid-cols-2 gap-4">
                                {clients.map((client) => (
                                    <div key={client.id} className="glass-card rounded-xl p-5">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white font-bold">
                                                {client.name[0]}
                                            </div>
                                            <h3 className="font-semibold text-white">{client.name}</h3>
                                        </div>

                                        <div className="space-y-3 text-sm">
                                            <div className="flex items-center gap-2">
                                                <Palette className="w-4 h-4 text-neutral-500" />
                                                <span className="text-neutral-400">Cores:</span>
                                                <div className="flex gap-1">
                                                    {client.colors.map((color, i) => (
                                                        <div key={i} className="w-5 h-5 rounded" style={{ background: color }} />
                                                    ))}
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <FileText className="w-4 h-4 text-neutral-500" />
                                                <span className="text-neutral-400">Tom:</span>
                                                <span className="text-white">{client.toneOfVoice}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Target className="w-4 h-4 text-neutral-500" />
                                                <span className="text-neutral-400">Público:</span>
                                                <span className="text-white">{client.targetAudience}</span>
                                            </div>
                                        </div>

                                        <button className="mt-4 text-sm text-green-400 hover:text-green-300">
                                            Editar treinamento →
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Tasks Tab */}
                    {activeTab === "tasks" && (
                        <div className="p-6">
                            <h2 className="text-lg font-semibold text-white mb-6">Histórico de Tarefas</h2>
                            <div className="glass-card rounded-xl p-5">
                                <div className="text-center py-8">
                                    <Clock className="w-12 h-12 text-neutral-700 mx-auto mb-4" />
                                    <p className="text-neutral-500">Nenhuma tarefa ainda</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Approvals Tab (Manager only) */}
                    {activeTab === "approvals" && agentId === "manager" && (
                        <div className="p-6">
                            <h2 className="text-lg font-semibold text-white mb-6">
                                Fila de Aprovações ({pendingApprovals.length})
                            </h2>

                            {pendingApprovals.length === 0 ? (
                                <div className="glass-card rounded-xl p-8 text-center">
                                    <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                                    <p className="text-white font-medium">Tudo aprovado!</p>
                                    <p className="text-neutral-500">Nenhum item pendente</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {pendingApprovals.map((item) => (
                                        <motion.div
                                            key={item.id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="glass-card rounded-xl p-5"
                                        >
                                            <div className="flex items-start justify-between mb-4">
                                                <div>
                                                    <span className={`text-xs px-2 py-0.5 rounded-full ${item.type === "post"
                                                            ? "bg-purple-500/20 text-purple-400"
                                                            : "bg-blue-500/20 text-blue-400"
                                                        }`}>
                                                        {item.type === "post" ? "Post" : "Anúncio"}
                                                    </span>
                                                    <h3 className="font-semibold text-white mt-2">{item.title}</h3>
                                                    <p className="text-sm text-neutral-400">
                                                        {item.agent} • {item.client}
                                                    </p>
                                                </div>
                                            </div>

                                            <p className="text-sm text-neutral-300 mb-4 line-clamp-2">{item.content}</p>

                                            <div className="flex gap-3">
                                                <button
                                                    onClick={() => handleApprove(item.id)}
                                                    className="flex-1 py-2 rounded-lg bg-green-600 text-white font-medium hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                                                >
                                                    <Check className="w-4 h-4" />
                                                    Aprovar
                                                </button>
                                                <button
                                                    onClick={() => handleReject(item.id)}
                                                    className="flex-1 py-2 rounded-lg bg-neutral-800 text-neutral-300 font-medium hover:bg-neutral-700 transition-colors flex items-center justify-center gap-2"
                                                >
                                                    <X className="w-4 h-4" />
                                                    Rejeitar
                                                </button>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
