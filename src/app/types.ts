// AgencyZen - Shared Types
// =========================

export interface Client {
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

export interface Agent {
    id: string;
    name: string;
    role: "manager" | "social_media" | "traffic" | "creative" | "whatsapp" | "content_creator" | "client_relations";
    photo: string;
    status: "active" | "idle" | "processing";
    description: string;
    tasks: number;
    color: string;
    gradient: string;
    assignedClients: string[];
    managedBy?: string; // ID of manager agent
    performance: AgentPerformance;
}

export interface AgentPerformance {
    tasksCompleted: number;
    avgResponseTime: number; // in minutes
    successRate: number; // percentage
    clientSatisfaction: number; // 1-5 rating
}

export interface AgentTask {
    id: string;
    agentId: string;
    clientId?: string;
    title: string;
    description: string;
    status: "pending" | "in_progress" | "completed" | "failed";
    priority: "low" | "medium" | "high" | "urgent";
    createdAt: Date;
    completedAt?: Date;
    delegatedBy?: string; // Manager who delegated the task
}

export interface Message {
    id: string;
    from: string;
    to: string;
    content: string;
    timestamp: Date;
    type: "text" | "task" | "notification";
}

export interface ActivityLog {
    id: string;
    agentId: string;
    clientId?: string;
    action: string;
    details: string;
    timestamp: Date;
    status: "success" | "pending" | "error";
}

// Role display information
export const roleLabels: Record<Agent["role"], string> = {
    manager: "Gerente Geral",
    social_media: "Social Media",
    traffic: "Gestor de Tráfego",
    creative: "Desenvolvedor Criativo",
    whatsapp: "Atendimento WhatsApp",
    content_creator: "Criador de Conteúdo",
    client_relations: "Relacionamento com Cliente"
};

export const roleColors: Record<Agent["role"], { color: string; gradient: string }> = {
    manager: {
        color: "from-amber-500 to-orange-600",
        gradient: "from-amber-500/20 via-orange-500/10 to-transparent"
    },
    social_media: {
        color: "from-purple-500 to-pink-600",
        gradient: "from-purple-500/20 via-pink-500/10 to-transparent"
    },
    traffic: {
        color: "from-blue-500 to-cyan-600",
        gradient: "from-blue-500/20 via-cyan-500/10 to-transparent"
    },
    creative: {
        color: "from-orange-500 to-red-600",
        gradient: "from-orange-500/20 via-red-500/10 to-transparent"
    },
    whatsapp: {
        color: "from-green-500 to-emerald-600",
        gradient: "from-green-500/20 via-emerald-500/10 to-transparent"
    },
    content_creator: {
        color: "from-violet-500 to-purple-600",
        gradient: "from-violet-500/20 via-purple-500/10 to-transparent"
    },
    client_relations: {
        color: "from-teal-500 to-cyan-600",
        gradient: "from-teal-500/20 via-cyan-500/10 to-transparent"
    }
};
