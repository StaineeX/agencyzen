"use client";

import { useState, useRef, useEffect } from "react";
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
    Search,
    Filter,
    Send,
    Paperclip,
    Smile,
    Phone,
    Video,
    MoreVertical,
    Check,
    CheckCheck,
    Clock,
    Star,
    Tag,
    Archive
} from "lucide-react";

// ============== Types ==============

interface Conversation {
    id: string;
    contact: {
        name: string;
        phone: string;
        avatar?: string;
    };
    lastMessage: string;
    timestamp: Date;
    unread: number;
    status: "online" | "offline" | "typing";
    tags: string[];
    agent?: string;
}

interface Message {
    id: string;
    content: string;
    timestamp: Date;
    sender: "user" | "bot" | "agent";
    status: "sent" | "delivered" | "read";
}

// ============== Mock Data ==============

const mockConversations: Conversation[] = [
    {
        id: "1",
        contact: { name: "Isabella Rainer", phone: "+55 11 99999-0001" },
        lastMessage: "Olá, gostaria de saber mais sobre os serviços",
        timestamp: new Date(),
        unread: 2,
        status: "online",
        tags: ["Lead", "Interessado"],
        agent: "Zap Zen"
    },
    {
        id: "2",
        contact: { name: "João Silva", phone: "+55 11 99999-0002" },
        lastMessage: "Perfeito, vou aguardar o orçamento",
        timestamp: new Date(Date.now() - 1000 * 60 * 30),
        unread: 0,
        status: "offline",
        tags: ["Cliente"],
    },
    {
        id: "3",
        contact: { name: "Carla Almeida", phone: "+55 11 99999-0003" },
        lastMessage: "Qual o prazo de entrega?",
        timestamp: new Date(Date.now() - 1000 * 60 * 60),
        unread: 1,
        status: "typing",
        tags: ["Negociação"],
        agent: "Zap Zen"
    },
    {
        id: "4",
        contact: { name: "Tech Solutions", phone: "+55 11 99999-0004" },
        lastMessage: "O projeto está em andamento",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
        unread: 0,
        status: "offline",
        tags: ["Cliente VIP"],
    },
    {
        id: "5",
        contact: { name: "Maria Santos", phone: "+55 11 99999-0005" },
        lastMessage: "Obrigado pelo atendimento!",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
        unread: 0,
        status: "offline",
        tags: ["Concluído"],
    },
];

const mockMessages: Message[] = [
    {
        id: "1",
        content: "Olá! Gostaria de saber mais sobre os serviços de marketing da agência",
        timestamp: new Date(Date.now() - 1000 * 60 * 10),
        sender: "user",
        status: "read"
    },
    {
        id: "2",
        content: "Olá Isabella! 👋 Seja bem-vinda! Ficamos felizes com seu interesse.\n\nNós oferecemos serviços completos de marketing digital, incluindo:\n\n• Gestão de Redes Sociais\n• Tráfego Pago (Meta & Google Ads)\n• Criação de Conteúdo\n• Branding e Identidade Visual\n\nPosso saber mais sobre o seu negócio?",
        timestamp: new Date(Date.now() - 1000 * 60 * 9),
        sender: "bot",
        status: "read"
    },
    {
        id: "3",
        content: "Tenho uma loja de roupas femininas e preciso aumentar as vendas online",
        timestamp: new Date(Date.now() - 1000 * 60 * 5),
        sender: "user",
        status: "read"
    },
    {
        id: "4",
        content: "Excelente! 🛍️ Moda feminina é um nicho com muito potencial online.\n\nPara lojas como a sua, recomendamos um combo de:\n\n1. **Instagram + Facebook** - Vitrine visual dos produtos\n2. **Tráfego Pago** - Anúncios segmentados para seu público\n3. **WhatsApp** - Atendimento e fechamento de vendas\n\nQual seu orçamento mensal aproximado para marketing?",
        timestamp: new Date(Date.now() - 1000 * 60 * 4),
        sender: "bot",
        status: "delivered"
    },
];

// ============== Sidebar ==============

const sidebarItems = [
    { icon: Home, label: "Dashboard", href: "/dashboard" },
    { icon: Bot, label: "Agentes", href: "/dashboard/agents" },
    { icon: Users, label: "Clientes", href: "/dashboard/clients" },
    { icon: MessageSquare, label: "Conversas", href: "/dashboard/conversations", active: true },
    { icon: GitBranch, label: "Jornadas", href: "/dashboard/flow-editor" },
    { icon: Settings, label: "Configurações", href: "/dashboard/settings" },
];

// ============== Components ==============

function ConversationItem({
    conversation,
    selected,
    onClick
}: {
    conversation: Conversation;
    selected: boolean;
    onClick: () => void;
}) {
    const getInitials = (name: string) => {
        return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
    };

    const formatTime = (date: Date) => {
        const now = new Date();
        const diff = now.getTime() - date.getTime();

        if (diff < 1000 * 60 * 60) {
            return `${Math.floor(diff / (1000 * 60))}min`;
        } else if (diff < 1000 * 60 * 60 * 24) {
            return `${Math.floor(diff / (1000 * 60 * 60))}h`;
        }
        return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
    };

    return (
        <div
            onClick={onClick}
            className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all ${selected
                    ? 'bg-green-500/10 border border-green-500/30'
                    : 'hover:bg-neutral-800/50 border border-transparent'
                }`}
        >
            {/* Avatar */}
            <div className="relative">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-green-700 flex items-center justify-center text-white font-semibold">
                    {getInitials(conversation.contact.name)}
                </div>
                {conversation.status === "online" && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-neutral-900" />
                )}
                {conversation.status === "typing" && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-orange-500 rounded-full border-2 border-neutral-900 animate-pulse" />
                )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-white truncate">{conversation.contact.name}</span>
                    <span className="text-xs text-neutral-500">{formatTime(conversation.timestamp)}</span>
                </div>
                <div className="flex items-center justify-between">
                    <p className="text-sm text-neutral-400 truncate">{conversation.lastMessage}</p>
                    {conversation.unread > 0 && (
                        <span className="ml-2 w-5 h-5 rounded-full bg-green-500 text-white text-xs flex items-center justify-center">
                            {conversation.unread}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}

function ChatMessage({ message }: { message: Message }) {
    const isUser = message.sender === "user";

    return (
        <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
            <div className={`max-w-[70%] ${isUser ? 'chat-message-user' : 'chat-message-bot'} px-4 py-3`}>
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                <div className={`flex items-center gap-1 mt-1 ${isUser ? 'justify-end' : 'justify-start'}`}>
                    <span className="text-xs opacity-60">
                        {message.timestamp.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    {isUser && (
                        message.status === "read"
                            ? <CheckCheck className="w-3 h-3 text-blue-400" />
                            : <Check className="w-3 h-3 opacity-60" />
                    )}
                </div>
            </div>
        </div>
    );
}

// ============== Main Component ==============

export default function ConversationsPage() {
    const [conversations] = useState<Conversation[]>(mockConversations);
    const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(mockConversations[0]);
    const [messages, setMessages] = useState<Message[]>(mockMessages);
    const [inputMessage, setInputMessage] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSendMessage = () => {
        if (!inputMessage.trim()) return;

        const newMessage: Message = {
            id: `${Date.now()}`,
            content: inputMessage,
            timestamp: new Date(),
            sender: "agent",
            status: "sent"
        };

        setMessages([...messages, newMessage]);
        setInputMessage("");
    };

    const filteredConversations = conversations.filter(c =>
        c.contact.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

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

            {/* Conversations List */}
            <div className="w-80 border-r border-neutral-800 flex flex-col">
                {/* Header */}
                <div className="p-4 border-b border-neutral-800">
                    <h2 className="text-lg font-bold text-white mb-4">Conversas</h2>
                    <div className="relative">
                        <Search className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                            type="text"
                            placeholder="Buscar conversas..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 rounded-lg bg-neutral-900 border border-neutral-800 text-white placeholder-neutral-500 focus:outline-none focus:border-green-500"
                        />
                    </div>
                    <div className="flex items-center gap-2 mt-3">
                        <span className="text-sm text-neutral-400">{conversations.length} conversas</span>
                        <button className="ml-auto p-1.5 rounded-lg hover:bg-neutral-800">
                            <Filter className="w-4 h-4 text-neutral-400" />
                        </button>
                    </div>
                </div>

                {/* List */}
                <div className="flex-1 overflow-auto p-2 space-y-1">
                    {filteredConversations.map((conv) => (
                        <ConversationItem
                            key={conv.id}
                            conversation={conv}
                            selected={selectedConversation?.id === conv.id}
                            onClick={() => setSelectedConversation(conv)}
                        />
                    ))}
                </div>
            </div>

            {/* Chat Area */}
            {selectedConversation ? (
                <div className="flex-1 flex flex-col">
                    {/* Chat Header */}
                    <div className="p-4 border-b border-neutral-800 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-green-700 flex items-center justify-center text-white font-semibold">
                                {selectedConversation.contact.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                            </div>
                            <div>
                                <h3 className="font-semibold text-white">{selectedConversation.contact.name}</h3>
                                <p className="text-sm text-neutral-400">
                                    {selectedConversation.status === "online" ? "Online" :
                                        selectedConversation.status === "typing" ? "Digitando..." :
                                            selectedConversation.contact.phone}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            {selectedConversation.tags.map((tag, i) => (
                                <span key={i} className="px-2 py-1 rounded-full text-xs bg-green-500/20 text-green-400">
                                    {tag}
                                </span>
                            ))}
                            <button className="p-2 rounded-lg hover:bg-neutral-800">
                                <Phone className="w-5 h-5 text-neutral-400" />
                            </button>
                            <button className="p-2 rounded-lg hover:bg-neutral-800">
                                <MoreVertical className="w-5 h-5 text-neutral-400" />
                            </button>
                        </div>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-auto p-4">
                        {messages.map((msg) => (
                            <ChatMessage key={msg.id} message={msg} />
                        ))}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <div className="p-4 border-t border-neutral-800">
                        <div className="flex items-center gap-3">
                            <button className="p-2 rounded-lg hover:bg-neutral-800">
                                <Paperclip className="w-5 h-5 text-neutral-400" />
                            </button>
                            <input
                                type="text"
                                placeholder="Digite sua mensagem..."
                                value={inputMessage}
                                onChange={(e) => setInputMessage(e.target.value)}
                                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                                className="flex-1 px-4 py-3 rounded-xl bg-neutral-900 border border-neutral-800 text-white placeholder-neutral-500 focus:outline-none focus:border-green-500"
                            />
                            <button className="p-2 rounded-lg hover:bg-neutral-800">
                                <Smile className="w-5 h-5 text-neutral-400" />
                            </button>
                            <button
                                onClick={handleSendMessage}
                                className="p-3 rounded-xl bg-green-600 text-white hover:bg-green-700 transition-colors"
                            >
                                <Send className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                        <MessageSquare className="w-16 h-16 text-neutral-700 mx-auto mb-4" />
                        <p className="text-neutral-500">Selecione uma conversa</p>
                    </div>
                </div>
            )}
        </div>
    );
}
