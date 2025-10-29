import { useCallback, useRef, useState, useEffect } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  addEdge,
  type Connection,
  type Node,
  type Edge,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useDiagramStore } from '@/lib/diagramStore';
import { useTheme } from '@/components/ThemeProvider';
import ResizableNode from '@/components/diagram/ResizableNode';
import GroupNode from '@/components/diagram/GroupNode';
import TextNode from '@/components/diagram/TextNode';
import CustomEdge from '@/components/diagram/CustomEdge';
import EnhancedNodePalette from '@/components/diagram/EnhancedNodePalette';
import CodeEditor from '@/components/diagram/CodeEditor';
import ExportModal from '@/components/diagram/ExportModal';
import ExamplesModal from '@/components/diagram/ExamplesModal';
import NodeStylePanel from '@/components/diagram/NodeStylePanel';
import EdgeStylePanel from '@/components/diagram/EdgeStylePanel';
import DiagramChat from '@/components/diagram/DiagramChat';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Sparkles, Download, Undo, Redo, Layout,
  Lightbulb, Loader2, ChevronLeft, ChevronRight,
  Settings, Moon, Sun, Palette, GitBranch, Network,
  Database, Users, Workflow, MessageSquare
} from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import type { GenerateDiagramRequest, GenerateDiagramResponse, Diagram, NodeType, IconType } from '@shared/schema';
import ELK from 'elkjs/lib/elk.bundled.js';

const nodeTypes = {
  rect: ResizableNode,
  rounded: ResizableNode,
  circle: ResizableNode,
  database: ResizableNode,
  queue: ResizableNode,
  cloud: ResizableNode,
  storage: ResizableNode,
  process: ResizableNode,
  decision: ResizableNode,
  group: GroupNode,
  text: TextNode,
};

const edgeTypes = {
  default: CustomEdge,
  smoothstep: CustomEdge,
  straight: CustomEdge,
  step: CustomEdge,
};

const elk = new ELK();

export default function DiagramEditor() {
  const { 
    nodes, 
    edges, 
    setNodes, 
    setEdges, 
    onNodesChange, 
    onEdgesChange,
    addNode,
    addEdge: addStoreEdge,
    undo,
    redo,
    canUndo,
    canRedo,
    loadDiagram,
  } = useDiagramStore();

  const [prompt, setPrompt] = useState('');
  const [diagramType, setDiagramType] = useState<'flowchart' | 'architecture' | 'erd' | 'sequence' | 'orgchart'>('architecture');
  const [showPalette, setShowPalette] = useState(true);
  const [showCodeEditor, setShowCodeEditor] = useState(true);
  const [showStylePanel, setShowStylePanel] = useState(false);
  const [showEdgeStylePanel, setShowEdgeStylePanel] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [showRightPanel, setShowRightPanel] = useState(true);
  const [selectedNodeIds, setSelectedNodeIds] = useState<string[]>([]);
  const [selectedEdgeIds, setSelectedEdgeIds] = useState<string[]>([]);
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [examplesModalOpen, setExamplesModalOpen] = useState(false);
  const [showInitialPrompt, setShowInitialPrompt] = useState(true);
  const [showBackground, setShowBackground] = useState(true);
  const [backgroundColor, setBackgroundColor] = useState('#0a0a0a');
  const [highlightedNodeIds, setHighlightedNodeIds] = useState<string[]>([]);
  const canvasRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const { theme, toggleTheme } = useTheme();

  const generateMutation = useMutation({
    mutationFn: async (request: GenerateDiagramRequest) => {
      const response = await apiRequest('POST', '/api/generate', request);
      return await response.json() as GenerateDiagramResponse;
    },
    onSuccess: async (data) => {
      loadDiagram(data.model);
      setShowInitialPrompt(false);
      setShouldAutoLayout(true);

      toast({
        title: 'Diagram generated',
        description: `Created ${data.model.nodes.length} nodes in ${data.stats.latencyMs}ms`,
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Generation failed',
        description: error.message || 'Failed to generate diagram',
        variant: 'destructive',
      });
    },
  });

  const handleGenerate = () => {
    if (prompt.trim().length < 10) {
      toast({
        title: 'Prompt too short',
        description: 'Please provide a more detailed description',
        variant: 'destructive',
      });
      return;
    }

    generateMutation.mutate({
      prompt: prompt.trim(),
      preferences: {
        type: diagramType,
        output: 'json',
      },
    });
  };

  const handleAddNodeFromPalette = useCallback((type: NodeType, icon: IconType, label: string, iconId?: string) => {
    const newNode: Node = {
      id: `node-${Date.now()}`,
      type,
      position: {
        x: Math.random() * 400 + 100,
        y: Math.random() * 300 + 100
      },
      data: {
        label,
        icon,
        iconId, // Store the icon library ID for later use
        width: type === 'circle' ? 120 : 180,
        height: type === 'database' ? 140 : (type === 'circle' ? 120 : 80),
      },
    };
    addNode(newNode);
  }, [addNode]);

  const handleConnect = useCallback((connection: Connection) => {
    const newEdge: Edge = {
      id: `edge-${Date.now()}`,
      source: connection.source!,
      target: connection.target!,
      type: 'smoothstep',
      animated: false,
      data: {
        lineType: 'smoothstep',
        strokeColor: '#b1b1b7',
        strokeWidth: 2,
        animated: false,
        dashType: 'solid',
        arrowType: 'none', // Default: no arrow head
        label: '',
        labelColor: 'hsl(var(--foreground))',
        labelBgColor: 'hsl(var(--card))',
        labelFontSize: 11,
        labelFontWeight: '600',
      },
    };
    setEdges(addEdge(newEdge, edges));
  }, [edges, setEdges]);

  const handleSelectionChange = useCallback((params: any) => {
    const selectedNodes = params.nodes.map((node: Node) => node.id);
    const selectedEdges = params.edges.map((edge: Edge) => edge.id);

    setSelectedNodeIds(selectedNodes);
    setSelectedEdgeIds(selectedEdges);

    // Show appropriate style panel
    if (selectedEdges.length > 0) {
      // Edges selected - show edge style panel
      setShowEdgeStylePanel(true);
      setShowStylePanel(false);
      setShowCodeEditor(false);
    } else if (selectedNodes.length > 0) {
      // Nodes selected - show node style panel
      setShowStylePanel(true);
      setShowEdgeStylePanel(false);
      setShowCodeEditor(false);
    } else {
      // Nothing selected - show code editor
      setShowStylePanel(false);
      setShowEdgeStylePanel(false);
      setShowCodeEditor(true);
    }
  }, []);

  const handleUpdateNodeStyle = useCallback((nodeId: string, styleData: any) => {
    setNodes(nodes.map(node =>
      node.id === nodeId
        ? { ...node, data: { ...node.data, ...styleData } }
        : node
    ));
  }, [nodes, setNodes]);

  const handleUpdateEdgeStyle = useCallback((edgeId: string, styleData: any) => {
    setEdges(edges.map(edge =>
      edge.id === edgeId
        ? { ...edge, data: { ...(edge.data || {}), ...styleData } }
        : edge
    ));
  }, [edges, setEdges]);

  const handleAutoLayout = async () => {
    if (nodes.length === 0) {
      console.warn('No nodes to layout');
      return;
    }

    try {
      // Separate group nodes from regular nodes
      const groupNodes = nodes.filter(n => n.type === 'group');
      const regularNodes = nodes.filter(n => n.type !== 'group');

      // Validate all nodes have valid IDs
      const invalidNodes = regularNodes.filter(n => !n.id || typeof n.id !== 'string');
      if (invalidNodes.length > 0) {
        throw new Error('Some nodes have invalid IDs');
      }

      // Validate edges reference existing nodes (only regular nodes)
      const nodeIds = new Set(regularNodes.map(n => n.id));
      const validEdges = edges.filter(e => {
        const valid = nodeIds.has(e.source) && nodeIds.has(e.target);
        if (!valid) {
          console.warn(`Invalid edge: ${e.source} -> ${e.target}`);
        }
        return valid;
      });

      // Only layout regular nodes, not groups
      const elkNodes = regularNodes.map(node => {
        // Get actual dimensions from node data or use defaults
        const nodeData = node.data as any;
        let width = nodeData?.width || 180;
        let height = nodeData?.height || 80;

        // Ensure minimum sizes based on type
        if (node.type === 'circle') {
          const size = Math.max(width, height, 100);
          width = height = size;
        } else if (node.type === 'decision') {
          width = Math.max(width, 140);
          height = Math.max(height, 140);
        } else if (node.type === 'database') {
          width = Math.max(width, 120);
          height = Math.max(height, 150);
        } else {
          // Regular nodes - ensure readable size
          width = Math.max(width, 180);
          height = Math.max(height, 80);
        }

        return {
          id: node.id,
          width,
          height,
        };
      });

      const elkEdges = validEdges.map(edge => ({
        id: edge.id,
        sources: [edge.source],
        targets: [edge.target],
      }));

      // Add hierarchical constraints for better organization
      const enhancedElkNodes = elkNodes.map(node => {
        const reactFlowNode = regularNodes.find(n => n.id === node.id);
        const label = (reactFlowNode?.data as any)?.label?.toLowerCase() || '';

        // Assign priorities based on common node names/patterns
        let priority = 0;
        if (label.includes('start')) priority = 100;
        else if (label.includes('end')) priority = -100;
        else if (reactFlowNode?.type === 'decision') priority = 50;

        return {
          ...node,
          layoutOptions: {
            'elk.priority': priority.toString(),
          },
        };
      });

      // Use a simpler algorithm - Mr. Tree for hierarchical flowcharts
      const graph = await elk.layout({
        id: 'root',
        children: enhancedElkNodes,
        edges: elkEdges,
        layoutOptions: {
          // Use Mr. Tree algorithm - designed for tree-like structures (perfect for flowcharts)
          'elk.algorithm': 'mrtree',
          'elk.direction': 'RIGHT',

          // Spacing
          'elk.spacing.nodeNode': '80',
          'elk.mrtree.searchDepth': '3',

          // Edge routing
          'elk.edgeRouting': 'POLYLINE',

          // Padding
          'elk.padding': '[top=30,left=30,bottom=30,right=30]',
        },
      });

      // Update positions for regular nodes
      let layoutedRegularNodes = regularNodes.map(node => {
        const elkNode = graph.children?.find(n => n.id === node.id);
        return {
          ...node,
          position: {
            x: elkNode?.x ?? node.position.x ?? 0,
            y: elkNode?.y ?? node.position.y ?? 0,
          },
        };
      });

      // Post-process: Organize decision branches vertically
      const decisionNodes = layoutedRegularNodes.filter(n => n.type === 'decision');
      decisionNodes.forEach(decisionNode => {
        // Find edges from this decision node
        const outgoingEdges = validEdges.filter(e => e.source === decisionNode.id);

        if (outgoingEdges.length >= 2) {
          // Get target nodes
          const targets = outgoingEdges.map(e => ({
            edge: e,
            node: layoutedRegularNodes.find(n => n.id === e.target)
          })).filter(t => t.node);

          if (targets.length >= 2) {
            // Sort by current Y position
            targets.sort((a, b) => (a.node!.position.y) - (b.node!.position.y));

            // Spread them vertically around the decision node
            const decisionY = decisionNode.position.y;
            const spreadDistance = 150;

            targets.forEach((target, idx) => {
              if (target.node) {
                const offset = (idx - (targets.length - 1) / 2) * spreadDistance;
                target.node.position.y = decisionY + offset;
              }
            });
          }
        }
      });

      layoutedRegularNodes = [...layoutedRegularNodes];

      // Calculate bounding boxes for groups based on their children
      const layoutedGroupNodes = groupNodes.map(groupNode => {
        const childNodes = layoutedRegularNodes.filter(n => (n as any).parentId === groupNode.id);

        if (childNodes.length === 0) {
          // No children, just place it somewhere
          return {
            ...groupNode,
            position: { x: 0, y: 0 },
          };
        }

        // Find bounding box of all child nodes
        const padding = 60;
        const minX = Math.min(...childNodes.map(n => n.position.x));
        const minY = Math.min(...childNodes.map(n => n.position.y));
        const maxX = Math.max(...childNodes.map(n => n.position.x + 180)); // approximate node width
        const maxY = Math.max(...childNodes.map(n => n.position.y + 100)); // approximate node height

        const width = maxX - minX + (padding * 2);
        const height = maxY - minY + (padding * 2) + 40; // Extra for header

        // Update child nodes to be relative to group
        childNodes.forEach(child => {
          child.position = {
            x: child.position.x - minX + padding,
            y: child.position.y - minY + padding + 40, // Account for header
          };
        });

        return {
          ...groupNode,
          position: {
            x: minX - padding,
            y: minY - padding - 40,
          },
          data: {
            ...groupNode.data,
            width,
            height,
          },
          style: {
            ...groupNode.style,
            width,
            height,
          },
        };
      });

      setNodes([...layoutedGroupNodes, ...layoutedRegularNodes]);
      toast({
        title: 'Layout applied',
        description: 'Diagram has been auto-arranged',
      });
    } catch (error: any) {
      console.error('Layout failed:', error);
      toast({
        title: 'Layout failed',
        description: error.message || 'Could not auto-arrange diagram',
        variant: 'destructive',
      });
    }
  };

  const parseMermaidToDiagram = (mermaidCode: string): Diagram => {
    const lines = mermaidCode.split('\n').map(l => l.trim()).filter(l => l && !l.startsWith('%'));

    const nodeMap = new Map<string, Diagram['nodes'][0]>();
    const edges: Diagram['edges'] = [];
    let direction = 'LR';

    // Parse direction from graph declaration
    const graphLine = lines.find(l => l.startsWith('graph'));
    if (graphLine) {
      const match = graphLine.match(/graph\s+(LR|TB|RL|BT)/);
      if (match) direction = match[1] as any;
    }

    // First pass: Parse explicit node definitions
    for (const line of lines) {
      if (line.startsWith('graph')) continue;

      // Parse node definitions: A[Label] or A((Label)) or A[(Label)]
      const nodeMatch = line.match(/(\w+)(\[\(|\(\(|\[)([^\]\)]+)(\]\)|\)\)|\])/);
      if (nodeMatch) {
        const [, id, startShape, label, endShape] = nodeMatch;

        let type: Diagram['nodes'][0]['type'] = 'rect';
        if (startShape === '((' && endShape === '))') type = 'circle';
        else if (startShape === '[(' && endShape === ')]') type = 'database';
        else if (startShape === '[') type = 'rounded';

        nodeMap.set(id, {
          id,
          type,
          data: { label: label.trim(), icon: 'none' },
          position: { x: 0, y: 0 },
        });
      }
    }

    // Second pass: Parse edges and auto-create missing nodes
    for (const line of lines) {
      if (line.startsWith('graph')) continue;

      // Parse edges: A --> B or A -->|label| B
      const edgeMatch = line.match(/(\w+)\s*(-->|---|-\.->)\s*(?:\|([^|]+)\|\s*)?(\w+)/);
      if (edgeMatch) {
        const [, source, arrowType, label, target] = edgeMatch;

        // Auto-create nodes if they don't exist
        if (!nodeMap.has(source)) {
          nodeMap.set(source, {
            id: source,
            type: 'rect',
            data: { label: source, icon: 'none' },
            position: { x: 0, y: 0 },
          });
        }

        if (!nodeMap.has(target)) {
          nodeMap.set(target, {
            id: target,
            type: 'rect',
            data: { label: target, icon: 'none' },
            position: { x: 0, y: 0 },
          });
        }

        edges.push({
          id: `e-${source}-${target}`,
          source,
          target,
          label: label?.trim(),
          style: arrowType === '-.->' ? 'dashed' : 'solid',
        });
      }
    }

    const nodes = Array.from(nodeMap.values());

    // Validate we have at least some nodes
    if (nodes.length === 0) {
      throw new Error('No nodes found in Mermaid code');
    }

    return {
      version: '1.0',
      nodes,
      edges,
      groups: [],
      layoutHints: { direction: direction as any, spacing: 48 },
    };
  };

  const handleApplyCode = (code: string, format: 'mermaid' | 'json') => {
    try {
      let diagram: Diagram;

      if (format === 'json') {
        diagram = JSON.parse(code) as Diagram;
      } else {
        diagram = parseMermaidToDiagram(code);
      }

      // Validate diagram has required structure
      if (!diagram.nodes || !Array.isArray(diagram.nodes) || diagram.nodes.length === 0) {
        throw new Error('Diagram must have at least one node');
      }

      if (!diagram.edges || !Array.isArray(diagram.edges)) {
        throw new Error('Diagram must have edges array');
      }

      // Validate all edges reference existing nodes
      const nodeIds = new Set(diagram.nodes.map(n => n.id));
      const invalidEdges = diagram.edges.filter(e => !nodeIds.has(e.source) || !nodeIds.has(e.target));

      if (invalidEdges.length > 0) {
        console.warn('Found invalid edges:', invalidEdges);
        // Remove invalid edges instead of failing
        diagram.edges = diagram.edges.filter(e => nodeIds.has(e.source) && nodeIds.has(e.target));
      }

      loadDiagram(diagram);
      setShouldAutoLayout(true);

      toast({
        title: 'Diagram updated',
        description: `Applied changes from ${format.toUpperCase()}`,
      });
    } catch (error: any) {
      console.error('Failed to apply code:', error);
      toast({
        title: 'Invalid code',
        description: error.message || `Could not parse ${format.toUpperCase()} code`,
        variant: 'destructive',
      });
    }
  };

  const currentDiagram: Diagram = {
    version: '1.0',
    nodes: nodes
      .filter(n => n.type !== 'group') // Exclude group nodes from regular nodes
      .map(n => ({
        id: n.id,
        type: (n.type as NodeType) || 'rect',
        data: {
          label: (n.data as any).label || 'Node',
          icon: (n.data as any).icon,
          color: (n.data as any).color,
        },
        position: n.position,
        groupId: (n as any).parentId, // Include parent group reference
      })),
    edges: edges.map(e => ({
      id: e.id,
      source: e.source,
      target: e.target,
      label: e.label as string,
    })),
    groups: nodes
      .filter(n => n.type === 'group') // Extract group nodes
      .map(g => ({
        id: g.id,
        label: (g.data as any).label || 'Group',
        nodeIds: nodes
          .filter(n => (n as any).parentId === g.id)
          .map(n => n.id), // Find all child nodes
        position: g.position,
        style: {
          backgroundColor: (g.data as any).backgroundColor,
          borderColor: (g.data as any).borderColor,
          borderWidth: (g.data as any).borderWidth,
        },
      })),
  };

  useEffect(() => {
    if (nodes.length > 0) {
      setShowInitialPrompt(false);
    }
  }, [nodes]);

  // Auto-layout when diagram is first loaded
  const [shouldAutoLayout, setShouldAutoLayout] = useState(false);

  useEffect(() => {
    if (shouldAutoLayout && nodes.length > 0) {
      const timer = setTimeout(() => {
        handleAutoLayout();
        setShouldAutoLayout(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [shouldAutoLayout, nodes.length]);

  return (
    <div className="flex flex-col h-screen bg-background">
      <header className="h-14 px-4 py-3 border-b border-border flex items-center justify-between bg-background">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className={`mix-blend-difference filter ${
                theme === "dark"
                  ? "drop-shadow-[0_0_5px_rgba(255,255,255,1)]"
                  : "drop-shadow-[0_0_5px_rgba(255,255,0)]"
              }`}>
              <img src="/favicon.png" alt="Logo" className="w-9 h-9 mix-blend-difference"/>
            </div>

            <h1 className="text-2xl font-semibold tracking-tight" data-testid="app-title">
              Mappin
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Theme toggle - always visible */}
          <Button
            variant="outline"
            size="sm"
            onClick={toggleTheme}
            data-testid="button-theme-toggle"
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4" />
            ) : (
              <Moon className="w-4 h-4" />
            )}
          </Button>

          {!showInitialPrompt && (
            <>
              {/* <Button
                variant="outline"
                size="sm"
                onClick={undo}
                disabled={!canUndo()}
                data-testid="button-undo"
              >
                <Undo className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={redo}
                disabled={!canRedo()}
                data-testid="button-redo"
              >
                <Redo className="w-4 h-4" />
              </Button> */}
              <Button
                variant="outline"
                size="sm"
                onClick={handleAutoLayout}
                data-testid="button-layout"
              >
                <Layout className="w-4 h-4 mr-1" />
                Re-layout
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setExportModalOpen(true)}
                data-testid="button-export-open"
              >
                <Download className="w-4 h-4 mr-1" />
                Export
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setShowChat(!showChat);
                  if (!showChat) {
                    setShowCodeEditor(false);
                    setShowStylePanel(false);
                    setShowEdgeStylePanel(false);
                  } else {
                    setShowCodeEditor(true);
                  }
                }}
                data-testid="button-chat"
              >
                <MessageSquare className="w-4 h-4 mr-1" />
                AI Chat
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" data-testid="button-settings">
                    <Settings className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>Canvas Settings</DropdownMenuLabel>
                  <DropdownMenuSeparator />

                  <div className="px-2 py-2 space-y-3">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="background-toggle" className="text-sm">
                        Show Background
                      </Label>
                      <Switch
                        id="background-toggle"
                        checked={showBackground}
                        onCheckedChange={setShowBackground}
                      />
                    </div>

                    {showBackground && (
                      <div className="flex items-center justify-between">
                        <Label htmlFor="bg-color" className="text-sm">
                          Background Color
                        </Label>
                        <input
                          type="color"
                          id="bg-color"
                          value={backgroundColor}
                          onChange={(e) => setBackgroundColor(e.target.value)}
                          className="w-10 h-8 rounded cursor-pointer"
                        />
                      </div>
                    )}
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          )}
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {showPalette && !showInitialPrompt && (
          <EnhancedNodePalette onAddNode={handleAddNodeFromPalette} />
        )}

        <div className="flex-1 relative">
          {/* Toggle button - always visible */}
          <div className='absolute z-10'>
            {!showInitialPrompt && (
              <Button
                variant="outline"
                size="icon"
                onClick={() => setShowPalette(!showPalette)}
                data-testid="button-toggle-palette"
                title={showPalette ? "Hide Components Panel" : "Show Components Panel"}
                className={`
                  absolute top-3 z-20 rounded-full transition-all duration-200 ease-in-out
                  ${showPalette 
                    ? "left-[-18px] bg-black text-white border border-sky-400 hover:bg-gray-900" 
                    : "left-[-10px] bg-white text-black border border-gray-300 hover:bg-gray-100"}
                `}
              >
                {showPalette ? (
                  <ChevronLeft className="w-4 h-4" />
                ) : (
                  <ChevronRight className="w-4 h-4" />
                )}
              </Button>
            )}
          </div>

          {showInitialPrompt ? (
            <div className="h-full flex items-center justify-center p-8">
              <div className="max-w-3xl w-full space-y-6">
                <div className="text-center space-y-3">
                  {
                    theme === 'dark' ? (
                      <Sparkles className="w-16 h-16 mx-auto text-white filter drop-shadow-[0_0_12px_rgba(255,255,255,0.55)]" />
                    ) : (
                      <Sparkles className="w-16 h-16 mx-auto text-black filter drop-shadow-[0_0_12px_rgba(140,140,160,0.9)]" />
                    )
                  }

                  <h2 className="text-3xl font-semibold tracking-tight" data-testid="empty-title">
                    Create Your Diagram
                  </h2>
                  <p className="text-muted-foreground">
                    Choose a diagram type and describe what you want to create
                  </p>
                </div>

                <div className="space-y-4">
                  {/* Diagram Type Selector */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Diagram Type</Label>
                    <div className="grid grid-cols-5 gap-2">
                      <button
                        onClick={() => setDiagramType('flowchart')}
                        className={`p-4 rounded-lg border-2 transition-all hover:border-primary ${
                          diagramType === 'flowchart' ? 'border-primary bg-primary/10' : 'border-border'
                        }`}
                      >
                        <GitBranch className="w-6 h-6 mx-auto mb-2" />
                        <div className="text-xs font-medium">Flowchart</div>
                      </button>
                      <button
                        onClick={() => setDiagramType('architecture')}
                        className={`p-4 rounded-lg border-2 transition-all hover:border-primary ${
                          diagramType === 'architecture' ? 'border-primary bg-primary/10' : 'border-border'
                        }`}
                      >
                        <Network className="w-6 h-6 mx-auto mb-2" />
                        <div className="text-xs font-medium">Architecture</div>
                      </button>
                      <button
                        onClick={() => setDiagramType('erd')}
                        className={`p-4 rounded-lg border-2 transition-all hover:border-primary ${
                          diagramType === 'erd' ? 'border-primary bg-primary/10' : 'border-border'
                        }`}
                      >
                        <Database className="w-6 h-6 mx-auto mb-2" />
                        <div className="text-xs font-medium">ER Diagram</div>
                      </button>
                      <button
                        onClick={() => setDiagramType('sequence')}
                        className={`p-4 rounded-lg border-2 transition-all hover:border-primary ${
                          diagramType === 'sequence' ? 'border-primary bg-primary/10' : 'border-border'
                        }`}
                      >
                        <Workflow className="w-6 h-6 mx-auto mb-2" />
                        <div className="text-xs font-medium">Sequence</div>
                      </button>
                      <button
                        onClick={() => setDiagramType('orgchart')}
                        className={`p-4 rounded-lg border-2 transition-all hover:border-primary ${
                          diagramType === 'orgchart' ? 'border-primary bg-primary/10' : 'border-border'
                        }`}
                      >
                        <Users className="w-6 h-6 mx-auto mb-2" />
                        <div className="text-xs font-medium">Org Chart</div>
                      </button>
                    </div>
                  </div>

                  <Textarea
                    placeholder={
                      diagramType === 'flowchart' ? "Example: User login process with validation, retry logic, and error handling" :
                      diagramType === 'architecture' ? "Example: Microservices system with API Gateway, Auth Service, Orders Service, and Postgres database" :
                      diagramType === 'erd' ? "Example: E-commerce database with Users, Orders, Products, and OrderItems tables" :
                      diagramType === 'sequence' ? "Example: User authentication flow between Client, API, Auth Service, and Database" :
                      "Example: Company org chart with CEO, departments (Engineering, Sales, Marketing), and team leads"
                    }
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    className="min-h-32 text-base resize-none"
                    data-testid="input-prompt"
                  />
                  
                  <div className="flex items-center gap-3">
                    <Button
                      size="lg"
                      onClick={handleGenerate}
                      disabled={generateMutation.isPending}
                      className="flex-1"
                      data-testid="button-generate"
                    >
                      {generateMutation.isPending ? (
                        <>
                          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-5 h-5 mr-2" />
                          Generate Diagram
                        </>
                      )}
                    </Button>
                    <Button
                      size="lg"
                      variant="outline"
                      onClick={() => setExamplesModalOpen(true)}
                      data-testid="button-examples"
                    >
                      <Lightbulb className="w-5 h-5 mr-2" />
                      Examples
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div
              ref={canvasRef}
              className="h-full"
              style={{
                backgroundColor: showBackground ? backgroundColor : 'transparent',
              }}
            >
              <ReactFlow
                nodes={nodes.map(node => ({
                  ...node,
                  data: {
                    ...node.data,
                    isHighlighted: highlightedNodeIds.includes(node.id)
                  }
                }))}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={handleConnect}
                onSelectionChange={handleSelectionChange}
                nodeTypes={nodeTypes}
                edgeTypes={edgeTypes}
                fitView
                elevateNodesOnSelect={false}
                data-testid="react-flow-canvas"
                style={{
                  backgroundColor: showBackground ? backgroundColor : 'transparent',
                }}
              >
                {showBackground && <Background />}
                <Controls className='text-[#333]'/>
                <MiniMap
                  className="!bg-card !border-border"
                  nodeColor={() => 'hsl(var(--primary))'}
                  zoomable pannable
                />
              </ReactFlow>
            </div>
          )}

          {/* Right panel toggle button */}
          {!showInitialPrompt && (
            <div className='absolute right-0 top-3 z-20'>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setShowRightPanel(!showRightPanel)}
                data-testid="button-toggle-right-panel"
                title={showRightPanel ? "Hide Right Panel" : "Show Right Panel"}
                className={`
                  rounded-full transition-all duration-200 ease-in-out scale-[0.96]
                  ${showRightPanel
                    ? "right-[-16px] bg-black text-white border-2 border-sky-400 hover:bg-gray-900"
                    : "right-[-9px] bg-white text-black border-2 border-gray-300 hover:bg-gray-100"}
                `}
              >
                {showRightPanel ? (
                  <ChevronRight className="w-3 h-3" />
                ) : (
                  <ChevronLeft className="w-3 h-3" />
                )}
              </Button>
            </div>
          )}
        </div>

        {showRightPanel && showCodeEditor && !showInitialPrompt && !showStylePanel && !showEdgeStylePanel && !showChat && (
          <CodeEditor diagram={currentDiagram} onApply={handleApplyCode} />
        )}

        {showRightPanel && showStylePanel && !showInitialPrompt && (
          <NodeStylePanel
            selectedNodeIds={selectedNodeIds}
            nodes={nodes}
            onUpdateNode={handleUpdateNodeStyle}
            onClose={() => {
              setShowStylePanel(false);
              setShowCodeEditor(true);
              setSelectedNodeIds([]);
            }}
          />
        )}

        {showRightPanel && showEdgeStylePanel && !showInitialPrompt && (
          <EdgeStylePanel
            selectedEdgeIds={selectedEdgeIds}
            edges={edges}
            onUpdateEdge={handleUpdateEdgeStyle}
            onClose={() => {
              setShowEdgeStylePanel(false);
              setShowCodeEditor(true);
              setSelectedEdgeIds([]);
            }}
          />
        )}

        {showRightPanel && showChat && !showInitialPrompt && (
          <DiagramChat
            diagram={currentDiagram}
            onDiagramUpdate={(updatedDiagram) => {
              // Get node IDs from updated diagram
              const updatedNodeIds = updatedDiagram.nodes.map(n => n.id);

              // Find new or modified nodes
              const currentNodeIds = new Set(nodes.map(n => n.id));
              const changedIds = updatedNodeIds.filter(id => {
                const existing = nodes.find(n => n.id === id);
                const updated = updatedDiagram.nodes.find(n => n.id === id);
                // New node or modified node
                return !existing || JSON.stringify(existing.data) !== JSON.stringify(updated?.data);
              });

              // Highlight changed nodes
              setHighlightedNodeIds(changedIds);

              // Load diagram
              loadDiagram(updatedDiagram);
              setShouldAutoLayout(true);

              toast({
                title: 'AI updated diagram',
                description: 'Changes applied successfully',
              });

              // Clear highlights after 3 seconds
              setTimeout(() => {
                setHighlightedNodeIds([]);
              }, 250000);
            }}
            onClose={() => {
              setShowChat(false);
              setShowCodeEditor(true);
            }}
          />
        )}
      </div>

      <ExportModal
        open={exportModalOpen}
        onOpenChange={setExportModalOpen}
        diagram={currentDiagram}
        canvasRef={canvasRef}
        backgroundColor={backgroundColor}
        showBackground={showBackground}
      />

      <ExamplesModal
        open={examplesModalOpen}
        onOpenChange={setExamplesModalOpen}
        onSelectExample={(p) => setPrompt(p)}
      />
    </div>
  );
}
