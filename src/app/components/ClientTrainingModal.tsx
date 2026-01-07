"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    X,
    Upload,
    Plus,
    Trash2,
    Palette,
    MessageCircle,
    Hash,
    Target,
    DollarSign,
    Save
} from "lucide-react";

interface ClientTraining {
    id: string;
    name: string;
    logo: string;
    colors: string[];
    toneOfVoice: string;
    examples: string[];
    hashtags: string[];
    targetAudience: string;
    budget?: number;
}

interface ClientTrainingModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (client: ClientTraining) => void;
    editClient?: ClientTraining | null;
    agentType: "social_media" | "traffic" | "whatsapp";
}

export default function ClientTrainingModal({
    isOpen,
    onClose,
    onSave,
    editClient,
    agentType
}: ClientTrainingModalProps) {
    const [name, setName] = useState("");
    const [logo, setLogo] = useState("🏢");
    const [colors, setColors] = useState<string[]>(["#8B5CF6", "#EC4899"]);
    const [toneOfVoice, setToneOfVoice] = useState("");
    const [examples, setExamples] = useState<string[]>([""]);
    const [hashtags, setHashtags] = useState<string[]>([""]);
    const [targetAudience, setTargetAudience] = useState("");
    const [budget, setBudget] = useState<number>(0);
    const [newColor, setNewColor] = useState("#8B5CF6");

    const logoOptions = ["🏢", "🚀", "💼", "🎨", "🛍️", "🍕", "👗", "🏋️", "📚", "🎮", "🏠", "💊"];

    useEffect(() => {
        if (editClient) {
            setName(editClient.name);
            setLogo(editClient.logo);
            setColors(editClient.colors);
            setToneOfVoice(editClient.toneOfVoice);
            setExamples(editClient.examples);
            setHashtags(editClient.hashtags);
            setTargetAudience(editClient.targetAudience);
            setBudget(editClient.budget || 0);
        } else {
            resetForm();
        }
    }, [editClient, isOpen]);

    const resetForm = () => {
        setName("");
        setLogo("🏢");
        setColors(["#8B5CF6", "#EC4899"]);
        setToneOfVoice("");
        setExamples([""]);
        setHashtags([""]);
        setTargetAudience("");
        setBudget(0);
    };

    const addColor = () => {
        if (colors.length < 5) {
            setColors([...colors, newColor]);
        }
    };

    const removeColor = (index: number) => {
        setColors(colors.filter((_, i) => i !== index));
    };

    const addExample = () => {
        setExamples([...examples, ""]);
    };

    const updateExample = (index: number, value: string) => {
        const newExamples = [...examples];
        newExamples[index] = value;
        setExamples(newExamples);
    };

    const removeExample = (index: number) => {
        setExamples(examples.filter((_, i) => i !== index));
    };

    const addHashtag = () => {
        setHashtags([...hashtags, ""]);
    };

    const updateHashtag = (index: number, value: string) => {
        const newHashtags = [...hashtags];
        newHashtags[index] = value.startsWith("#") ? value : `#${value}`;
        setHashtags(newHashtags);
    };

    const removeHashtag = (index: number) => {
        setHashtags(hashtags.filter((_, i) => i !== index));
    };

    const handleSubmit = () => {
        const client: ClientTraining = {
            id: editClient?.id || `client-${Date.now()}`,
            name,
            logo,
            colors,
            toneOfVoice,
            examples: examples.filter(e => e.trim()),
            hashtags: hashtags.filter(h => h.trim()),
            targetAudience,
            budget: budget || undefined
        };
        onSave(client);
        onClose();
        resetForm();
    };

    if (!isOpen) return null;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 modal-backdrop flex items-center justify-center z-50 p-4 overflow-auto"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="glass-card rounded-3xl p-8 w-full max-w-2xl max-h-[90vh] overflow-auto"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold gradient-text">
                        {editClient ? "Editar Treinamento" : "Novo Treinamento de Cliente"}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-xl hover:bg-white/10 transition-colors"
                    >
                        <X className="w-5 h-5 text-gray-400" />
                    </button>
                </div>

                {/* Logo Selection */}
                <div className="mb-6">
                    <label className="text-sm text-gray-400 mb-3 block">Logo / Ícone</label>
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-3xl">
                            {logo}
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {logoOptions.map((emoji) => (
                                <button
                                    key={emoji}
                                    onClick={() => setLogo(emoji)}
                                    className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl transition-all ${logo === emoji
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

                {/* Name */}
                <div className="mb-6">
                    <label className="text-sm text-gray-400 mb-2 block">Nome do Cliente</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Ex: Tech Solutions LTDA"
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none input-glow"
                    />
                </div>

                {/* Colors */}
                <div className="mb-6">
                    <label className="text-sm text-gray-400 mb-3 block flex items-center gap-2">
                        <Palette className="w-4 h-4" /> Cores da Identidade Visual
                    </label>
                    <div className="flex items-center gap-3 flex-wrap">
                        {colors.map((color, i) => (
                            <div key={i} className="relative group">
                                <div
                                    className="w-10 h-10 rounded-xl border-2 border-white/20 cursor-pointer"
                                    style={{ backgroundColor: color }}
                                />
                                <button
                                    onClick={() => removeColor(i)}
                                    className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-red-500 text-white hidden group-hover:flex items-center justify-center"
                                >
                                    <X className="w-3 h-3" />
                                </button>
                            </div>
                        ))}
                        {colors.length < 5 && (
                            <div className="flex items-center gap-2">
                                <input
                                    type="color"
                                    value={newColor}
                                    onChange={(e) => setNewColor(e.target.value)}
                                    className="w-10 h-10 rounded-xl cursor-pointer"
                                />
                                <button
                                    onClick={addColor}
                                    className="p-2 rounded-lg bg-white/5 hover:bg-white/10"
                                >
                                    <Plus className="w-4 h-4 text-gray-400" />
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Tone of Voice */}
                <div className="mb-6">
                    <label className="text-sm text-gray-400 mb-2 block flex items-center gap-2">
                        <MessageCircle className="w-4 h-4" /> Tom de Voz / Linguagem
                    </label>
                    <textarea
                        value={toneOfVoice}
                        onChange={(e) => setToneOfVoice(e.target.value)}
                        placeholder="Ex: Profissional mas descontraído, usa emojis com moderação, linguagem técnica acessível..."
                        rows={3}
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none input-glow resize-none"
                    />
                </div>

                {/* Examples - For Social Media and Traffic */}
                {(agentType === "social_media" || agentType === "traffic") && (
                    <div className="mb-6">
                        <label className="text-sm text-gray-400 mb-3 block">
                            {agentType === "social_media" ? "Exemplos de Posts Anteriores" : "Exemplos de Anúncios Anteriores"}
                        </label>
                        <div className="space-y-2">
                            {examples.map((example, i) => (
                                <div key={i} className="flex gap-2">
                                    <input
                                        type="text"
                                        value={example}
                                        onChange={(e) => updateExample(i, e.target.value)}
                                        placeholder={`Exemplo ${i + 1}...`}
                                        className="flex-1 px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none input-glow"
                                    />
                                    <button
                                        onClick={() => removeExample(i)}
                                        className="p-2 rounded-lg hover:bg-white/10"
                                    >
                                        <Trash2 className="w-4 h-4 text-red-400" />
                                    </button>
                                </div>
                            ))}
                            <button
                                onClick={addExample}
                                className="flex items-center gap-2 text-sm text-purple-400 hover:text-purple-300"
                            >
                                <Plus className="w-4 h-4" /> Adicionar Exemplo
                            </button>
                        </div>
                    </div>
                )}

                {/* Hashtags - For Social Media */}
                {agentType === "social_media" && (
                    <div className="mb-6">
                        <label className="text-sm text-gray-400 mb-3 block flex items-center gap-2">
                            <Hash className="w-4 h-4" /> Hashtags Padrão
                        </label>
                        <div className="flex flex-wrap gap-2">
                            {hashtags.map((tag, i) => (
                                <div key={i} className="flex items-center gap-1 px-3 py-1 rounded-full bg-white/5 border border-white/10">
                                    <input
                                        type="text"
                                        value={tag}
                                        onChange={(e) => updateHashtag(i, e.target.value)}
                                        placeholder="#hashtag"
                                        className="bg-transparent text-white text-sm w-24 focus:outline-none"
                                    />
                                    <button onClick={() => removeHashtag(i)}>
                                        <X className="w-3 h-3 text-gray-500 hover:text-red-400" />
                                    </button>
                                </div>
                            ))}
                            <button
                                onClick={addHashtag}
                                className="px-3 py-1 rounded-full bg-white/5 border border-dashed border-white/20 text-gray-500 text-sm hover:border-purple-500 hover:text-purple-400"
                            >
                                + Adicionar
                            </button>
                        </div>
                    </div>
                )}

                {/* Target Audience - For Traffic */}
                {agentType === "traffic" && (
                    <div className="mb-6">
                        <label className="text-sm text-gray-400 mb-2 block flex items-center gap-2">
                            <Target className="w-4 h-4" /> Público-Alvo
                        </label>
                        <textarea
                            value={targetAudience}
                            onChange={(e) => setTargetAudience(e.target.value)}
                            placeholder="Ex: Homens e mulheres, 25-45 anos, interessados em tecnologia, renda média-alta, moradores de grandes cidades..."
                            rows={3}
                            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none input-glow resize-none"
                        />
                    </div>
                )}

                {/* Budget - For Traffic */}
                {agentType === "traffic" && (
                    <div className="mb-8">
                        <label className="text-sm text-gray-400 mb-2 block flex items-center gap-2">
                            <DollarSign className="w-4 h-4" /> Orçamento Mensal (R$)
                        </label>
                        <input
                            type="number"
                            value={budget}
                            onChange={(e) => setBudget(Number(e.target.value))}
                            placeholder="Ex: 5000"
                            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none input-glow"
                        />
                    </div>
                )}

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
                        disabled={!name.trim()}
                        className="flex-1 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed btn-shine flex items-center justify-center gap-2"
                    >
                        <Save className="w-5 h-5" />
                        {editClient ? "Salvar" : "Criar Treinamento"}
                    </button>
                </div>
            </motion.div>
        </motion.div>
    );
}
