"use client";

import { useCallback, useState } from "react";
import ReactFlow, {
    Node,
    Edge,
    Controls,
    Background,
    BackgroundVariant,
    useNodesState,
    useEdgesState,
    addEdge,
    Connection,
    NodeTypes,
    Handle,
    Position,
} from "reactflow";
import "reactflow/dist/style.css";
import { motion } from "framer-motion";
import Link from "next/link";
import {
    Home,
    Bot,
    Users,
    MessageSquare,
    Share2,
    BarChart3,
    Settings,
    Sparkles,
    Save,
    Play,
    Plus,
    Trash2,
    Zap,
    GitBranch,
    Clock,
    Tag,
    Square,
    ArrowLeft
} from "lucide-react";

// ============== Custom Nodes ==============

interface CustomNodeData {
    label: string;
    description?: string;
    config?: Record<string, any>;
}

// Trigger Node
function TriggerNode({ data, selected }: { data: CustomNodeData; selected: boolean }) {
    return (
        <div className={`flow-node ${selected ? 'selected' : ''}`}>
            <div className="flow-node-header">
                <div className="flow-node-icon flow-node-trigger">
                    <Zap className="w-4 h-4" />
                </div>
                <span className="text-white font-medium">{data.label}</span>
            </div>
            {data.description && (
                <p className="text-xs text-neutral-400">{data.description}</p>
            )}
            <Handle type="source" position={Position.Right} className="flow-handle" />
        </div>
    );
}

// Message Node
function MessageNode({ data, selected }: { data: CustomNodeData; selected: boolean }) {
    return (
        <div className={`flow-node ${selected ? 'selected' : ''}`}>
            <Handle type="target" position={Position.Left} className="flow-handle" />
            <div className="flow-node-header">
                <div className="flow-node-icon flow-node-message">
                    <MessageSquare className="w-4 h-4" />
                </div>
                <span className="text-white font-medium">{data.label}</span>
            </div>
            {data.description && (
                <p className="text-xs text-neutral-400 line-clamp-2">{data.description}</p>
            )}
            <Handle type="source" position={Position.Right} className="flow-handle" />
        </div>
    );
}

// Condition Node
function ConditionNode({ data, selected }: { data: CustomNodeData; selected: boolean }) {
    return (
        <div className={`flow-node ${selected ? 'selected' : ''}`}>
            <Handle type="target" position={Position.Left} className="flow-handle" />
            <div className="flow-node-header">
                <div className="flow-node-icon flow-node-condition">
                    <GitBranch className="w-4 h-4" />
                </div>
                <span className="text-white font-medium">{data.label}</span>
            </div>
            {data.description && (
                <p className="text-xs text-neutral-400">{data.description}</p>
            )}
            <div className="mt-2 flex gap-2">
                <span className="text-xs px-2 py-0.5 rounded bg-green-500/20 text-green-400">Sim</span>
                <span className="text-xs px-2 py-0.5 rounded bg-red-500/20 text-red-400">Não</span>
            </div>
            <Handle type="source" position={Position.Right} id="true" style={{ top: '40%' }} className="flow-handle" />
            <Handle type="source" position={Position.Right} id="false" style={{ top: '70%' }} className="flow-handle" />
        </div>
    );
}

// Agent Node
function AgentNode({ data, selected }: { data: CustomNodeData; selected: boolean }) {
    return (
        <div className={`flow-node ${selected ? 'selected' : ''}`}>
            <Handle type="target" position={Position.Left} className="flow-handle" />
            <div className="flow-node-header">
                <div className="flow-node-icon flow-node-agent">
                    <Bot className="w-4 h-4" />
                </div>
                <span className="text-white font-medium">{data.label}</span>
            </div>
            {data.description && (
                <p className="text-xs text-neutral-400">{data.description}</p>
            )}
            <Handle type="source" position={Position.Right} className="flow-handle" />
        </div>
    );
}

// Delay Node
function DelayNode({ data, selected }: { data: CustomNodeData; selected: boolean }) {
    return (
        <div className={`flow-node ${selected ? 'selected' : ''}`}>
            <Handle type="target" position={Position.Left} className="flow-handle" />
            <div className="flow-node-header">
                <div className="flow-node-icon" style={{ background: 'rgba(100, 116, 139, 0.2)', color: '#64748b' }}>
                    <Clock className="w-4 h-4" />
                </div>
                <span className="text-white font-medium">{data.label}</span>
            </div>
            {data.description && (
                <p className="text-xs text-neutral-400">{data.description}</p>
            )}
            <Handle type="source" position={Position.Right} className="flow-handle" />
        </div>
    );
}

// Tag Node
function TagNode({ data, selected }: { data: CustomNodeData; selected: boolean }) {
    return (
        <div className={`flow-node ${selected ? 'selected' : ''}`}>
            <Handle type="target" position={Position.Left} className="flow-handle" />
            <div className="flow-node-header">
                <div className="flow-node-icon flow-node-trigger">
                    <Tag className="w-4 h-4" />
                </div>
                <span className="text-white font-medium">{data.label}</span>
            </div>
            {data.description && (
                <p className="text-xs text-neutral-400">{data.description}</p>
            )}
            <Handle type="source" position={Position.Right} className="flow-handle" />
        </div>
    );
}

// End Node
function EndNode({ data, selected }: { data: CustomNodeData; selected: boolean }) {
    return (
        <div className={`flow-node ${selected ? 'selected' : ''}`}>
            <Handle type="target" position={Position.Left} className="flow-handle" />
            <div className="flow-node-header">
                <div className="flow-node-icon flow-node-end">
                    <Square className="w-4 h-4" />
                </div>
                <span className="text-white font-medium">{data.label}</span>
            </div>
        </div>
    );
}

const nodeTypes: NodeTypes = {
    trigger: TriggerNode,
    message: MessageNode,
    condition: ConditionNode,
    agent: AgentNode,
    delay: DelayNode,
    tag: TagNode,
    end: EndNode,
};

// ============== Initial Flow ==============

const initialNodes: Node[] = [
    {
        id: "1",
        type: "trigger",
        position: { x: 50, y: 200 },
        data: { label: "Evento", description: "Mensagem recebida" },
    },
    {
        id: "2",
        type: "message",
        position: { x: 300, y: 200 },
        data: { label: "Enviar Mensagem", description: "Olá! Como posso ajudar?" },
    },
    {
        id: "3",
        type: "condition",
        position: { x: 550, y: 150 },
        data: { label: "Condicional", description: "Contém 'preço'?" },
    },
    {
        id: "4",
        type: "agent",
        position: { x: 800, y: 100 },
        data: { label: "Chamar Agente", description: "Zap Zen" },
    },
    {
        id: "5",
        type: "tag",
        position: { x: 800, y: 250 },
        data: { label: "Adicionar Etiqueta", description: "Lead Qualificado" },
    },
    {
        id: "6",
        type: "end",
        position: { x: 1050, y: 175 },
        data: { label: "Fim da Jornada" },
    },
];

const initialEdges: Edge[] = [
    { id: "e1-2", source: "1", target: "2", animated: true, style: { stroke: '#22c55e' } },
    { id: "e2-3", source: "2", target: "3", animated: true, style: { stroke: '#22c55e' } },
    { id: "e3-4", source: "3", target: "4", sourceHandle: "true", animated: true, style: { stroke: '#22c55e' } },
    { id: "e3-5", source: "3", target: "5", sourceHandle: "false", animated: true, style: { stroke: '#f97316' } },
    { id: "e4-6", source: "4", target: "6", animated: true, style: { stroke: '#22c55e' } },
    { id: "e5-6", source: "5", target: "6", animated: true, style: { stroke: '#22c55e' } },
];

// ============== Sidebar ==============

const sidebarItems = [
    { icon: Home, label: "Dashboard", href: "/dashboard" },
    { icon: Bot, label: "Agentes", href: "/dashboard/agents" },
    { icon: Users, label: "Clientes", href: "/dashboard/clients" },
    { icon: MessageSquare, label: "Conversas", href: "/dashboard/conversations" },
    { icon: GitBranch, label: "Jornadas", href: "/dashboard/flow-editor", active: true },
    { icon: Settings, label: "Configurações", href: "/dashboard/settings" },
];

// ============== Node Palette ==============

const nodePalette = [
    { type: "trigger", label: "Evento", icon: Zap, color: "bg-green-500/20 text-green-400" },
    { type: "message", label: "Mensagem", icon: MessageSquare, color: "bg-blue-500/20 text-blue-400" },
    { type: "condition", label: "Condição", icon: GitBranch, color: "bg-orange-500/20 text-orange-400" },
    { type: "agent", label: "Agente", icon: Bot, color: "bg-purple-500/20 text-purple-400" },
    { type: "delay", label: "Aguardar", icon: Clock, color: "bg-slate-500/20 text-slate-400" },
    { type: "tag", label: "Etiqueta", icon: Tag, color: "bg-green-500/20 text-green-400" },
    { type: "end", label: "Fim", icon: Square, color: "bg-red-500/20 text-red-400" },
];

// ============== Main Component ==============

export default function FlowEditorPage() {
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
    const [flowName, setFlowName] = useState("fluxo_vendas");
    const [selectedNode, setSelectedNode] = useState<Node | null>(null);

    const onConnect = useCallback(
        (params: Connection) => {
            setEdges((eds) =>
                addEdge({ ...params, animated: true, style: { stroke: '#22c55e' } }, eds)
            );
        },
        [setEdges]
    );

    const onDragOver = useCallback((event: React.DragEvent) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = "move";
    }, []);

    const onDrop = useCallback(
        (event: React.DragEvent) => {
            event.preventDefault();

            const type = event.dataTransfer.getData("application/reactflow");
            if (!type) return;

            const position = {
                x: event.clientX - 300,
                y: event.clientY - 100,
            };

            const newNode: Node = {
                id: `${Date.now()}`,
                type,
                position,
                data: {
                    label: nodePalette.find(n => n.type === type)?.label || "Novo Nó",
                    description: "Clique para configurar"
                },
            };

            setNodes((nds) => nds.concat(newNode));
        },
        [setNodes]
    );

    const onDragStart = (event: React.DragEvent, nodeType: string) => {
        event.dataTransfer.setData("application/reactflow", nodeType);
        event.dataTransfer.effectAllowed = "move";
    };

    const deleteSelectedNodes = () => {
        setNodes((nds) => nds.filter((node) => !node.selected));
        setEdges((eds) => eds.filter((edge) => {
            const sourceExists = nodes.some((n) => n.id === edge.source && !n.selected);
            const targetExists = nodes.some((n) => n.id === edge.target && !n.selected);
            return sourceExists && targetExists;
        }));
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
            <main className="flex-1 flex flex-col">
                {/* Header */}
                <header className="p-4 border-b border-neutral-800 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/dashboard/agents" className="p-2 rounded-lg hover:bg-neutral-800 transition-colors">
                            <ArrowLeft className="w-5 h-5 text-neutral-400" />
                        </Link>
                        <div>
                            <h1 className="text-xl font-bold text-white">Editor de Jornada</h1>
                            <input
                                type="text"
                                value={flowName}
                                onChange={(e) => setFlowName(e.target.value)}
                                className="text-sm text-neutral-400 bg-transparent border-none focus:outline-none"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={deleteSelectedNodes}
                            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-neutral-800 text-neutral-400 hover:text-red-400 transition-colors"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-neutral-800 text-white hover:bg-neutral-700 transition-colors">
                            <Play className="w-4 h-4" />
                            Testar
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition-colors">
                            <Save className="w-4 h-4" />
                            Salvar
                        </button>
                    </div>
                </header>

                <div className="flex-1 flex">
                    {/* Node Palette */}
                    <div className="w-56 p-4 border-r border-neutral-800">
                        <h3 className="text-sm font-semibold text-neutral-400 mb-4">COMPONENTES</h3>
                        <div className="space-y-2">
                            {nodePalette.map((node) => (
                                <div
                                    key={node.type}
                                    draggable
                                    onDragStart={(e) => onDragStart(e, node.type)}
                                    className="flex items-center gap-3 p-3 rounded-lg bg-neutral-900 border border-neutral-800 cursor-grab hover:border-green-500/30 transition-colors"
                                >
                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${node.color}`}>
                                        <node.icon className="w-4 h-4" />
                                    </div>
                                    <span className="text-sm text-white">{node.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Flow Canvas */}
                    <div className="flex-1 flow-canvas">
                        <ReactFlow
                            nodes={nodes}
                            edges={edges}
                            onNodesChange={onNodesChange}
                            onEdgesChange={onEdgesChange}
                            onConnect={onConnect}
                            onDrop={onDrop}
                            onDragOver={onDragOver}
                            nodeTypes={nodeTypes}
                            fitView
                            className="bg-neutral-950"
                        >
                            <Background
                                variant={BackgroundVariant.Dots}
                                gap={20}
                                size={1}
                                color="rgba(34, 197, 94, 0.1)"
                            />
                            <Controls
                                className="bg-neutral-800 border-neutral-700 rounded-lg"
                                showInteractive={false}
                            />
                        </ReactFlow>
                    </div>
                </div>
            </main>
        </div>
    );
}
