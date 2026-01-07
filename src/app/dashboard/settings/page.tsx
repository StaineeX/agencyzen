"use client";

import { useState } from "react";
import Link from "next/link";
import {
    Home,
    Bot,
    Users,
    MessageSquare,
    GitBranch,
    Settings,
    Sparkles,
    Key,
    Save,
    Eye,
    EyeOff,
    Check,
    AlertCircle,
    Cpu,
    Image,
    MessageCircle,
    ExternalLink
} from "lucide-react";

// ============== Sidebar ==============

const sidebarItems = [
    { icon: Home, label: "Dashboard", href: "/dashboard" },
    { icon: Bot, label: "Agentes", href: "/dashboard/agents" },
    { icon: Users, label: "Clientes", href: "/dashboard/clients" },
    { icon: MessageSquare, label: "Conversas", href: "/dashboard/conversations" },
    { icon: GitBranch, label: "Jornadas", href: "/dashboard/flow-editor" },
    { icon: Settings, label: "Configurações", href: "/dashboard/settings", active: true },
];

// ============== Models Available ==============

const aiModels = [
    { id: "gpt-4-turbo", name: "GPT-4 Turbo", provider: "OpenAI", recommended: true },
    { id: "gpt-4", name: "GPT-4", provider: "OpenAI" },
    { id: "gpt-3.5-turbo", name: "GPT-3.5 Turbo", provider: "OpenAI" },
];

const imageModels = [
    { id: "flux-schnell", name: "Flux Schnell", price: "$0.003/img", speed: "Rápido" },
    { id: "flux-pro", name: "Flux Pro", price: "$0.05/img", speed: "Médio" },
    { id: "sdxl", name: "SDXL", price: "$0.01/img", speed: "Médio" },
];

// ============== Main Component ==============

export default function SettingsPage() {
    const [openaiKey, setOpenaiKey] = useState("");
    const [replicateKey, setReplicateKey] = useState("");
    const [model, setModel] = useState("gpt-4-turbo");
    const [imageModel, setImageModel] = useState("flux-schnell");
    const [showOpenai, setShowOpenai] = useState(false);
    const [showReplicate, setShowReplicate] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);

    const handleSave = async () => {
        setIsSaving(true);

        // Salva no localStorage
        localStorage.setItem("agencyzen_config", JSON.stringify({
            openai_key: openaiKey,
            replicate_key: replicateKey,
            model,
            image_model: imageModel
        }));

        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
        setIsSaving(false);
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
                        <h1 className="text-2xl font-bold text-white">Configurações</h1>
                        <p className="text-neutral-400">Gerencie suas API Keys e integrações</p>
                    </div>
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-green-600 text-white hover:bg-green-700 transition-colors disabled:opacity-50"
                    >
                        {saveSuccess ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                        {saveSuccess ? "Salvo!" : "Salvar"}
                    </button>
                </div>

                <div className="max-w-2xl">
                    {/* OpenAI */}
                    <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                        <Cpu className="w-5 h-5 text-green-400" />
                        Inteligência Artificial
                    </h2>

                    <div className="glass-card rounded-xl p-5 mb-4">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center">
                                <Key className="w-5 h-5 text-green-400" />
                            </div>
                            <div>
                                <label className="font-medium text-white">OpenAI API Key</label>
                                {openaiKey.length > 10 && (
                                    <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-green-500/20 text-green-400">
                                        Configurado
                                    </span>
                                )}
                            </div>
                        </div>

                        <div className="relative">
                            <input
                                type={showOpenai ? "text" : "password"}
                                value={openaiKey}
                                onChange={(e) => setOpenaiKey(e.target.value)}
                                placeholder="sk-..."
                                className="w-full input-dark input-glow pr-12"
                            />
                            <button
                                onClick={() => setShowOpenai(!showOpenai)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 p-1"
                            >
                                {showOpenai ? <EyeOff className="w-4 h-4 text-neutral-500" /> : <Eye className="w-4 h-4 text-neutral-500" />}
                            </button>
                        </div>
                        <p className="text-xs text-neutral-500 mt-2">
                            Necessária para os agentes.
                            <a href="https://platform.openai.com/api-keys" target="_blank" className="text-green-400 ml-1">
                                Obter chave →
                            </a>
                        </p>
                    </div>

                    {/* AI Model */}
                    <div className="glass-card rounded-xl p-5 mb-8">
                        <label className="font-medium text-white mb-4 block">Modelo de IA</label>
                        <div className="space-y-2">
                            {aiModels.map((m) => (
                                <label
                                    key={m.id}
                                    className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer ${model === m.id ? "bg-green-500/20 ring-1 ring-green-500" : "bg-neutral-900 hover:bg-neutral-800"
                                        }`}
                                >
                                    <input type="radio" name="ai_model" value={m.id} checked={model === m.id} onChange={(e) => setModel(e.target.value)} className="sr-only" />
                                    <div className={`w-4 h-4 rounded-full border-2 ${model === m.id ? "border-green-500" : "border-neutral-600"}`}>
                                        {model === m.id && <div className="w-2 h-2 rounded-full bg-green-500 m-0.5" />}
                                    </div>
                                    <span className="text-white">{m.name}</span>
                                    <span className="text-neutral-500 text-sm">{m.provider}</span>
                                    {m.recommended && <span className="ml-auto text-xs px-2 py-0.5 rounded-full bg-green-500/20 text-green-400">Recomendado</span>}
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Replicate */}
                    <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                        <Image className="w-5 h-5 text-purple-400" />
                        Geração de Imagens
                    </h2>

                    <div className="glass-card rounded-xl p-5 mb-4">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
                                <Key className="w-5 h-5 text-purple-400" />
                            </div>
                            <div>
                                <label className="font-medium text-white">Replicate API Key</label>
                                {replicateKey.length > 5 && (
                                    <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-400">
                                        Configurado
                                    </span>
                                )}
                            </div>
                        </div>

                        <div className="relative">
                            <input
                                type={showReplicate ? "text" : "password"}
                                value={replicateKey}
                                onChange={(e) => setReplicateKey(e.target.value)}
                                placeholder="r8_..."
                                className="w-full input-dark input-glow pr-12"
                            />
                            <button onClick={() => setShowReplicate(!showReplicate)} className="absolute right-3 top-1/2 -translate-y-1/2 p-1">
                                {showReplicate ? <EyeOff className="w-4 h-4 text-neutral-500" /> : <Eye className="w-4 h-4 text-neutral-500" />}
                            </button>
                        </div>
                        <p className="text-xs text-neutral-500 mt-2">
                            Muito barato (~$0.003/imagem).
                            <a href="https://replicate.com/account/api-tokens" target="_blank" className="text-purple-400 ml-1">
                                Obter chave →
                            </a>
                        </p>
                    </div>

                    {/* Image Model */}
                    <div className="glass-card rounded-xl p-5 mb-8">
                        <label className="font-medium text-white mb-4 block">Modelo de Imagem</label>
                        <div className="space-y-2">
                            {imageModels.map((m) => (
                                <label
                                    key={m.id}
                                    className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer ${imageModel === m.id ? "bg-purple-500/20 ring-1 ring-purple-500" : "bg-neutral-900 hover:bg-neutral-800"
                                        }`}
                                >
                                    <input type="radio" name="image_model" value={m.id} checked={imageModel === m.id} onChange={(e) => setImageModel(e.target.value)} className="sr-only" />
                                    <div className={`w-4 h-4 rounded-full border-2 ${imageModel === m.id ? "border-purple-500" : "border-neutral-600"}`}>
                                        {imageModel === m.id && <div className="w-2 h-2 rounded-full bg-purple-500 m-0.5" />}
                                    </div>
                                    <span className="text-white flex-1">{m.name}</span>
                                    <span className="text-neutral-400 text-sm">{m.speed}</span>
                                    <span className="text-green-400 text-sm font-mono">{m.price}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* WhatsApp */}
                    <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                        <MessageCircle className="w-5 h-5 text-green-400" />
                        WhatsApp
                    </h2>

                    <div className="glass-card rounded-xl p-5">
                        <div className="flex items-center gap-3 mb-4">
                            <AlertCircle className="w-5 h-5 text-blue-400" />
                            <p className="text-neutral-300">
                                O WhatsApp é conectado via QR Code, sem API externa.
                            </p>
                        </div>
                        <Link href="/dashboard/agents/whatsapp" className="text-green-400 hover:text-green-300">
                            Conectar WhatsApp →
                        </Link>
                    </div>
                </div>
            </main>
        </div>
    );
}
