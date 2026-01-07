"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
    MessageSquare,
    Share2,
    BarChart3,
    Sparkles,
    Home,
    Users,
    Settings,
    Bell,
    Search,
    Plus,
    ChevronRight,
    Zap,
    Bot,
    X,
    Mail,
    Phone,
    Building2,
    Calendar,
    MoreVertical,
    Edit3,
    Trash2,
    UserPlus,
    CheckCircle2,
    Clock
} from "lucide-react";

// Types
interface Client {
    id: string;
    name: string;
    company: string;
    email: string;
    phone: string;
    avatar: string;
    assignedAgents: string[];
    status: "active" | "inactive" | "pending";
    createdAt: Date;
    lastContact: Date;
}

interface Agent {
    id: string;
    name: string;
    photo: string;
    color: string;
}

// Initial Data
const initialClients: Client[] = [
    {
        id: "client-1",
        name: "João Silva",
        company: "Tech Solutions LTDA",
        email: "joao@techsolutions.com",
        phone: "+55 11 99999-1234",
        avatar: "👨‍💼",
        assignedAgents: ["whatsapp", "social"],
        status: "active",
        createdAt: new Date("2025-11-15"),
        lastContact: new Date("2026-01-06")
    },
    {
        id: "client-2",
        name: "Maria Santos",
        company: "Loja Criativa",
        email: "maria@lojacriativa.com.br",
        phone: "+55 21 98888-5678",
        avatar: "👩‍💻",
        assignedAgents: ["social", "traffic"],
        status: "active",
        createdAt: new Date("2025-12-01"),
        lastContact: new Date("2026-01-07")
    },
    {
        id: "client-3",
        name: "Carlos Oliveira",
        company: "Startup Inovadora",
        email: "carlos@startupino.io",
        phone: "+55 31 97777-9012",
        avatar: "🧑‍🚀",
        assignedAgents: ["traffic"],
        status: "pending",
        createdAt: new Date("2026-01-02"),
        lastContact: new Date("2026-01-05")
    },
    {
        id: "client-4",
        name: "Ana Ferreira",
        company: "Moda Zen",
        email: "ana@modazen.com.br",
        phone: "+55 41 96666-3456",
        avatar: "👩‍🎨",
        assignedAgents: ["whatsapp", "social", "traffic"],
        status: "active",
        createdAt: new Date("2025-10-20"),
        lastContact: new Date("2026-01-07")
    }
];

const availableAgents: Agent[] = [
    { id: "whatsapp", name: "Zap Zen", photo: "💬", color: "from-green-500 to-emerald-600" },
    { id: "social", name: "Social Zen", photo: "📱", color: "from-purple-500 to-pink-600" },
    { id: "traffic", name: "Traffic Master", photo: "📊", color: "from-blue-500 to-cyan-600" },
];

// Sidebar Navigation
const sidebarItems = [
    { icon: Home, label: "Dashboard", href: "/dashboard" },
    { icon: Bot, label: "Meus Agentes", href: "/dashboard/agents" },
    { icon: Users, label: "Clientes", href: "/dashboard/clients", active: true },
    { icon: MessageSquare, label: "WhatsApp", href: "/dashboard/whatsapp" },
    { icon: Share2, label: "Social Media", href: "/dashboard/social" },
    { icon: BarChart3, label: "Anúncios", href: "/dashboard/ads" },
    { icon: Settings, label: "Configurações", href: "/dashboard/settings" },
];

// Client Card Component
function ClientCard({
    client,
    agents,
    onEdit,
    onDelete,
    onAssignAgents
}: {
    client: Client;
    agents: Agent[];
    onEdit: (client: Client) => void;
    onDelete: (id: string) => void;
    onAssignAgents: (client: Client) => void;
}) {
    const [showMenu, setShowMenu] = useState(false);

    const statusConfig = {
        active: { label: "Ativo", color: "bg-green-500", textColor: "text-green-400" },
        inactive: { label: "Inativo", color: "bg-gray-500", textColor: "text-gray-400" },
        pending: { label: "Pendente", color: "bg-yellow-500", textColor: "text-yellow-400" }
    };

    const assignedAgentObjects = agents.filter(a => client.assignedAgents.includes(a.id));

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card glass-card-hover rounded-2xl p-6 relative"
        >
            {/* Menu Button */}
            <div className="absolute top-4 right-4 z-10">
                <button
                    onClick={(e) => { e.stopPropagation(); setShowMenu(!showMenu); }}
                    className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                >
                    <MoreVertical className="w-4 h-4 text-gray-400" />
                </button>
                <AnimatePresence>
                    {showMenu && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="absolute right-0 mt-1 w-40 glass-card rounded-xl overflow-hidden z-20"
                        >
                            <button
                                onClick={(e) => { e.stopPropagation(); onEdit(client); setShowMenu(false); }}
                                className="w-full px-4 py-2 text-left text-sm text-white hover:bg-white/10 flex items-center gap-2"
                            >
                                <Edit3 className="w-3 h-3" /> Editar
                            </button>
                            <button
                                onClick={(e) => { e.stopPropagation(); onAssignAgents(client); setShowMenu(false); }}
                                className="w-full px-4 py-2 text-left text-sm text-white hover:bg-white/10 flex items-center gap-2"
                            >
                                <UserPlus className="w-3 h-3" /> Atribuir Agentes
                            </button>
                            <button
                                onClick={(e) => { e.stopPropagation(); onDelete(client.id); setShowMenu(false); }}
                                className="w-full px-4 py-2 text-left text-sm text-red-400 hover:bg-white/10 flex items-center gap-2"
                            >
                                <Trash2 className="w-3 h-3" /> Excluir
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Header */}
            <div className="flex items-start gap-4 mb-4">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-2xl">
                    {client.avatar}
                </div>
                <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-bold text-white truncate">{client.name}</h3>
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                        <Building2 className="w-3 h-3" />
                        <span className="truncate">{client.company}</span>
                    </div>
                </div>
            </div>

            {/* Contact Info */}
            <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-300">
                    <Mail className="w-4 h-4 text-gray-500" />
                    <span className="truncate">{client.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-300">
                    <Phone className="w-4 h-4 text-gray-500" />
                    <span>{client.phone}</span>
                </div>
            </div>

            {/* Status & Last Contact */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${statusConfig[client.status].color}`} />
                    <span className={`text-xs font-medium ${statusConfig[client.status].textColor}`}>
                        {statusConfig[client.status].label}
                    </span>
                </div>
                <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Clock className="w-3 h-3" />
                    <span>Último contato: {client.lastContact.toLocaleDateString("pt-BR")}</span>
                </div>
            </div>

            {/* Assigned Agents */}
            <div className="border-t border-white/10 pt-4">
                <p className="text-xs text-gray-500 mb-2">Agentes Atribuídos</p>
                <div className="flex items-center gap-2 flex-wrap">
                    {assignedAgentObjects.length > 0 ? (
                        assignedAgentObjects.map((agent) => (
                            <div
                                key={agent.id}
                                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-gradient-to-r ${agent.color} bg-opacity-20`}
                            >
                                <span className="text-sm">{agent.photo}</span>
                                <span className="text-xs text-white font-medium">{agent.name}</span>
                            </div>
                        ))
                    ) : (
                        <span className="text-xs text-gray-500 italic">Nenhum agente atribuído</span>
                    )}
                </div>
            </div>
        </motion.div>
    );
}

// Create/Edit Client Modal
function ClientModal({
    isOpen,
    onClose,
    onSave,
    editClient
}: {
    isOpen: boolean;
    onClose: () => void;
    onSave: (client: Partial<Client>) => void;
    editClient?: Client | null;
}) {
    const [name, setName] = useState("");
    const [company, setCompany] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [avatar, setAvatar] = useState("👤");
    const [status, setStatus] = useState<Client["status"]>("pending");

    const avatarOptions = ["👤", "👨‍💼", "👩‍💻", "🧑‍🚀", "👩‍🎨", "👨‍🔬", "👩‍🏫", "🧑‍💻", "👨‍🎨", "👩‍💼"];

    useState(() => {
        if (editClient) {
            setName(editClient.name);
            setCompany(editClient.company);
            setEmail(editClient.email);
            setPhone(editClient.phone);
            setAvatar(editClient.avatar);
            setStatus(editClient.status);
        } else {
            setName("");
            setCompany("");
            setEmail("");
            setPhone("");
            setAvatar("👤");
            setStatus("pending");
        }
    });

    const handleSubmit = () => {
        onSave({
            id: editClient?.id || `client-${Date.now()}`,
            name,
            company,
            email,
            phone,
            avatar,
            status,
            assignedAgents: editClient?.assignedAgents || [],
            createdAt: editClient?.createdAt || new Date(),
            lastContact: new Date()
        });
        onClose();
    };

    if (!isOpen) return null;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 modal-backdrop flex items-center justify-center z-50 p-4"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="glass-card rounded-3xl p-8 w-full max-w-lg"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold gradient-text">
                        {editClient ? "Editar Cliente" : "Novo Cliente"}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-xl hover:bg-white/10 transition-colors"
                    >
                        <X className="w-5 h-5 text-gray-400" />
                    </button>
                </div>

                {/* Avatar Selection */}
                <div className="mb-6">
                    <label className="text-sm text-gray-400 mb-3 block">Avatar</label>
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-3xl">
                            {avatar}
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {avatarOptions.map((emoji) => (
                                <button
                                    key={emoji}
                                    onClick={() => setAvatar(emoji)}
                                    className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl transition-all ${avatar === emoji
                                        ? 'bg-purple-500/30 ring-2 ring-purple-500'
                                        : 'bg-white/5 hover:bg-white/10'
                                        }`}
                                >
                                    {emoji}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Name & Company */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                        <label className="text-sm text-gray-400 mb-2 block">Nome</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Nome do cliente"
                            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none input-glow"
                        />
                    </div>
                    <div>
                        <label className="text-sm text-gray-400 mb-2 block">Empresa</label>
                        <input
                            type="text"
                            value={company}
                            onChange={(e) => setCompany(e.target.value)}
                            placeholder="Nome da empresa"
                            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none input-glow"
                        />
                    </div>
                </div>

                {/* Email & Phone */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                        <label className="text-sm text-gray-400 mb-2 block">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="email@empresa.com"
                            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none input-glow"
                        />
                    </div>
                    <div>
                        <label className="text-sm text-gray-400 mb-2 block">Telefone</label>
                        <input
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="+55 11 99999-9999"
                            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none input-glow"
                        />
                    </div>
                </div>

                {/* Status */}
                <div className="mb-8">
                    <label className="text-sm text-gray-400 mb-3 block">Status</label>
                    <div className="flex gap-3">
                        {[
                            { value: "active", label: "Ativo", color: "from-green-500 to-emerald-600" },
                            { value: "pending", label: "Pendente", color: "from-yellow-500 to-orange-600" },
                            { value: "inactive", label: "Inativo", color: "from-gray-500 to-gray-600" }
                        ].map((option) => (
                            <button
                                key={option.value}
                                onClick={() => setStatus(option.value as Client["status"])}
                                className={`flex-1 py-3 rounded-xl font-medium transition-all ${status === option.value
                                    ? `bg-gradient-to-r ${option.color} text-white`
                                    : 'bg-white/5 text-gray-400 hover:bg-white/10'
                                    }`}
                            >
                                {option.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 py-3 rounded-xl bg-white/5 text-gray-300 font-semibold hover:bg-white/10 transition-colors"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={!name.trim() || !email.trim()}
                        className="flex-1 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed btn-shine"
                    >
                        {editClient ? "Salvar" : "Criar Cliente"}
                    </button>
                </div>
            </motion.div>
        </motion.div>
    );
}

// Agent Assignment Modal
function AssignAgentsModal({
    isOpen,
    onClose,
    client,
    agents,
    onSave
}: {
    isOpen: boolean;
    onClose: () => void;
    client: Client | null;
    agents: Agent[];
    onSave: (clientId: string, agentIds: string[]) => void;
}) {
    const [selectedAgents, setSelectedAgents] = useState<string[]>([]);

    useState(() => {
        if (client) {
            setSelectedAgents(client.assignedAgents);
        }
    });

    const toggleAgent = (agentId: string) => {
        setSelectedAgents(prev =>
            prev.includes(agentId)
                ? prev.filter(id => id !== agentId)
                : [...prev, agentId]
        );
    };

    const handleSave = () => {
        if (client) {
            onSave(client.id, selectedAgents);
        }
        onClose();
    };

    if (!isOpen || !client) return null;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 modal-backdrop flex items-center justify-center z-50 p-4"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="glass-card rounded-3xl p-8 w-full max-w-md"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-xl font-bold text-white">Atribuir Agentes</h2>
                        <p className="text-sm text-gray-400">{client.name}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-xl hover:bg-white/10 transition-colors"
                    >
                        <X className="w-5 h-5 text-gray-400" />
                    </button>
                </div>

                {/* Agent List */}
                <div className="space-y-3 mb-6">
                    {agents.map((agent) => (
                        <button
                            key={agent.id}
                            onClick={() => toggleAgent(agent.id)}
                            className={`w-full p-4 rounded-xl flex items-center gap-4 transition-all ${selectedAgents.includes(agent.id)
                                ? 'bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/30'
                                : 'bg-white/5 border border-transparent hover:bg-white/10'
                                }`}
                        >
                            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${agent.color} flex items-center justify-center text-xl`}>
                                {agent.photo}
                            </div>
                            <span className="flex-1 text-left text-white font-medium">{agent.name}</span>
                            {selectedAgents.includes(agent.id) && (
                                <CheckCircle2 className="w-5 h-5 text-purple-400" />
                            )}
                        </button>
                    ))}
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 py-3 rounded-xl bg-white/5 text-gray-300 font-semibold hover:bg-white/10 transition-colors"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleSave}
                        className="flex-1 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold hover:opacity-90 transition-opacity btn-shine"
                    >
                        Salvar
                    </button>
                </div>
            </motion.div>
        </motion.div>
    );
}

// Stats Card
function StatsCard({ icon: Icon, label, value, color }: { icon: React.ElementType; label: string; value: string; color: string }) {
    return (
        <div className="glass-card rounded-xl p-4">
            <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${color} flex items-center justify-center`}>
                    <Icon className="w-5 h-5 text-white" />
                </div>
                <div>
                    <p className="text-2xl font-bold text-white">{value}</p>
                    <p className="text-xs text-gray-400">{label}</p>
                </div>
            </div>
        </div>
    );
}

// Main Page Component
export default function ClientsPage() {
    const [clients, setClients] = useState<Client[]>(initialClients);
    const [editClient, setEditClient] = useState<Client | null>(null);
    const [assignClient, setAssignClient] = useState<Client | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    // Filter clients
    const filteredClients = clients.filter(client =>
        client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        client.company.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Stats
    const activeClients = clients.filter(c => c.status === "active").length;
    const pendingClients = clients.filter(c => c.status === "pending").length;

    const handleSaveClient = (clientData: Partial<Client>) => {
        if (editClient) {
            setClients(prev => prev.map(c => c.id === clientData.id ? { ...c, ...clientData } as Client : c));
        } else {
            setClients(prev => [...prev, clientData as Client]);
        }
        setEditClient(null);
    };

    const handleDeleteClient = (id: string) => {
        setClients(prev => prev.filter(c => c.id !== id));
    };

    const handleAssignAgents = (clientId: string, agentIds: string[]) => {
        setClients(prev => prev.map(c =>
            c.id === clientId ? { ...c, assignedAgents: agentIds } : c
        ));
    };

    return (
        <div className="min-h-screen flex premium-bg grid-pattern">
            {/* Sidebar */}
            <aside className="w-72 glass border-r border-white/10 p-4 flex flex-col">
                <div className="flex items-center gap-3 px-2 mb-8">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center neon-purple">
                        <Sparkles className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <span className="text-xl font-bold gradient-text block">AgencyZen</span>
                        <span className="text-xs text-gray-500">Multi-Agent AI</span>
                    </div>
                </div>

                <nav className="space-y-1 flex-1">
                    {sidebarItems.map((item, i) => (
                        <Link
                            key={i}
                            href={item.href}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${item.active
                                ? "bg-gradient-to-r from-purple-600/20 to-pink-600/20 text-white border border-purple-500/30"
                                : "text-gray-400 hover:text-white hover:bg-white/5"
                                }`}
                        >
                            <item.icon className="w-5 h-5" />
                            <span className="font-medium">{item.label}</span>
                        </Link>
                    ))}
                </nav>

                {/* Pro Plan Card */}
                <div className="glass-card rounded-xl p-4 mt-4 neon-purple">
                    <div className="flex items-center gap-2 mb-2">
                        <Zap className="w-4 h-4 text-yellow-400" />
                        <span className="text-xs font-semibold text-white">Pro Plan</span>
                    </div>
                    <p className="text-xs text-gray-400 mb-3">{clients.length} clientes ativos</p>
                    <div className="w-full h-1.5 rounded-full bg-white/10">
                        <div
                            className="h-full rounded-full bg-gradient-to-r from-purple-500 to-pink-500"
                            style={{ width: `${Math.min(clients.length * 10, 100)}%` }}
                        />
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-6 overflow-auto">
                {/* Header */}
                <header className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-1">Clientes</h1>
                        <p className="text-gray-400">Gerencie seus clientes e atribuições de agentes</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Buscar clientes..."
                                className="w-64 pl-11 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none input-glow"
                            />
                        </div>
                        <button className="relative p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
                            <Bell className="w-5 h-5 text-gray-400" />
                            <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-pink-500 pulse-dot" />
                        </button>
                        <button
                            onClick={() => { setEditClient(null); setIsModalOpen(true); }}
                            className="px-5 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold flex items-center gap-2 hover:opacity-90 transition-opacity btn-shine"
                        >
                            <Plus className="w-5 h-5" />
                            Novo Cliente
                        </button>
                    </div>
                </header>

                {/* Stats */}
                <section className="grid grid-cols-4 gap-4 mb-8">
                    <StatsCard icon={Users} label="Total de Clientes" value={clients.length.toString()} color="from-purple-500 to-pink-600" />
                    <StatsCard icon={CheckCircle2} label="Clientes Ativos" value={activeClients.toString()} color="from-green-500 to-emerald-600" />
                    <StatsCard icon={Clock} label="Pendentes" value={pendingClients.toString()} color="from-yellow-500 to-orange-600" />
                    <StatsCard icon={Bot} label="Agentes Atribuídos" value={availableAgents.length.toString()} color="from-blue-500 to-cyan-600" />
                </section>

                {/* Clients Grid */}
                <section>
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold text-white">Todos os Clientes</h2>
                        <span className="text-sm text-gray-400">{filteredClients.length} clientes</span>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredClients.map((client) => (
                            <ClientCard
                                key={client.id}
                                client={client}
                                agents={availableAgents}
                                onEdit={(c) => { setEditClient(c); setIsModalOpen(true); }}
                                onDelete={handleDeleteClient}
                                onAssignAgents={(c) => { setAssignClient(c); setIsAssignModalOpen(true); }}
                            />
                        ))}
                    </div>
                </section>
            </main>

            {/* Modals */}
            <AnimatePresence>
                {isModalOpen && (
                    <ClientModal
                        isOpen={isModalOpen}
                        onClose={() => { setIsModalOpen(false); setEditClient(null); }}
                        onSave={handleSaveClient}
                        editClient={editClient}
                    />
                )}
            </AnimatePresence>

            <AnimatePresence>
                {isAssignModalOpen && (
                    <AssignAgentsModal
                        isOpen={isAssignModalOpen}
                        onClose={() => { setIsAssignModalOpen(false); setAssignClient(null); }}
                        client={assignClient}
                        agents={availableAgents}
                        onSave={handleAssignAgents}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}
