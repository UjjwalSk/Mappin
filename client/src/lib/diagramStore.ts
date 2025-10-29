import { create } from 'zustand';
import { type Node, type Edge, applyNodeChanges, applyEdgeChanges, type NodeChange, type EdgeChange } from '@xyflow/react';
import type { Diagram, DiagramSnapshot } from '@shared/schema';

interface DiagramState {
  nodes: Node[];
  edges: Edge[];
  selectedNodes: string[];
  history: Diagram[];
  historyIndex: number;
  snapshots: DiagramSnapshot[];
  
  setNodes: (nodes: Node[]) => void;
  setEdges: (edges: Edge[]) => void;
  onNodesChange: (changes: NodeChange[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  
  addNode: (node: Node) => void;
  deleteNode: (id: string) => void;
  updateNodeData: (id: string, data: any) => void;
  
  addEdge: (edge: Edge) => void;
  deleteEdge: (id: string) => void;
  
  setSelectedNodes: (ids: string[]) => void;
  
  pushHistory: (diagram: Diagram) => void;
  undo: () => void;
  redo: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;
  
  saveSnapshot: (name: string) => void;
  loadSnapshot: (id: string) => void;
  deleteSnapshot: (id: string) => void;
  
  clear: () => void;
  loadDiagram: (diagram: Diagram) => void;
}

export const useDiagramStore = create<DiagramState>((set, get) => ({
  nodes: [],
  edges: [],
  selectedNodes: [],
  history: [],
  historyIndex: -1,
  snapshots: [],

  setNodes: (nodes) => set({ nodes }),
  setEdges: (edges) => set({ edges }),

  onNodesChange: (changes) => {
    set({
      nodes: applyNodeChanges(changes, get().nodes),
    });
  },

  onEdgesChange: (changes) => {
    set({
      edges: applyEdgeChanges(changes, get().edges),
    });
  },

  addNode: (node) => {
    set((state) => ({
      nodes: [...state.nodes, node],
    }));
  },

  deleteNode: (id) => {
    set((state) => ({
      nodes: state.nodes.filter((n) => n.id !== id),
      edges: state.edges.filter((e) => e.source !== id && e.target !== id),
    }));
  },

  updateNodeData: (id, data) => {
    set((state) => ({
      nodes: state.nodes.map((n) =>
        n.id === id ? { ...n, data: { ...n.data, ...data } } : n
      ),
    }));
  },

  addEdge: (edge) => {
    set((state) => ({
      edges: [...state.edges, edge],
    }));
  },

  deleteEdge: (id) => {
    set((state) => ({
      edges: state.edges.filter((e) => e.id !== id),
    }));
  },

  setSelectedNodes: (ids) => set({ selectedNodes: ids }),

  pushHistory: (diagram) => {
    set((state) => {
      const newHistory = state.history.slice(0, state.historyIndex + 1);
      newHistory.push(diagram);
      return {
        history: newHistory,
        historyIndex: newHistory.length - 1,
      };
    });
  },

  undo: () => {
    const { history, historyIndex } = get();
    if (historyIndex > 0) {
      const previousDiagram = history[historyIndex - 1];
      get().loadDiagram(previousDiagram);
      set({ historyIndex: historyIndex - 1 });
    }
  },

  redo: () => {
    const { history, historyIndex } = get();
    if (historyIndex < history.length - 1) {
      const nextDiagram = history[historyIndex + 1];
      get().loadDiagram(nextDiagram);
      set({ historyIndex: historyIndex + 1 });
    }
  },

  canUndo: () => get().historyIndex > 0,
  canRedo: () => get().historyIndex < get().history.length - 1,

  saveSnapshot: (name) => {
    const { nodes, edges } = get();
    const snapshot: DiagramSnapshot = {
      id: `snapshot-${Date.now()}`,
      name,
      diagram: {
        version: '1.0',
        nodes: nodes.map(n => ({
          id: n.id,
          type: (n.type as any) || 'rect',
          data: {
            label: (n.data as any).label || 'Node',
            icon: (n.data as any).icon,
            color: (n.data as any).color,
          },
          position: n.position,
        })),
        edges: edges.map(e => ({
          id: e.id,
          source: e.source,
          target: e.target,
          label: e.label as string,
        })),
        groups: [],
      },
      timestamp: Date.now(),
    };
    
    set((state) => ({
      snapshots: [...state.snapshots, snapshot],
    }));
    
    localStorage.setItem('diagram-snapshots', JSON.stringify(get().snapshots));
  },

  loadSnapshot: (id) => {
    const snapshot = get().snapshots.find((s) => s.id === id);
    if (snapshot) {
      get().loadDiagram(snapshot.diagram);
    }
  },

  deleteSnapshot: (id) => {
    set((state) => ({
      snapshots: state.snapshots.filter((s) => s.id !== id),
    }));
    localStorage.setItem('diagram-snapshots', JSON.stringify(get().snapshots));
  },

  clear: () => {
    set({
      nodes: [],
      edges: [],
      selectedNodes: [],
      history: [],
      historyIndex: -1,
    });
  },

  loadDiagram: (diagram) => {
    const nodes: Node[] = [];

    // Add group/container nodes first (if any)
    if (diagram.groups && diagram.groups.length > 0) {
      diagram.groups.forEach((group) => {
        nodes.push({
          id: group.id,
          type: 'group',
          position: group.position || { x: 0, y: 0 },
          data: {
            label: group.label,
            backgroundColor: group.style?.backgroundColor || 'rgba(139, 92, 246, 0.1)',
            borderColor: group.style?.borderColor || 'rgb(139, 92, 246)',
            width: 600,  // Larger initial size
            height: 400,
          },
          style: {
            zIndex: -1,
            width: 600,
            height: 400,
          },
        });
      });
    }

    // Add regular nodes
    diagram.nodes.forEach((n) => {
      nodes.push({
        id: n.id,
        type: n.type,
        position: n.position,
        data: {
          label: n.data.label,
          icon: n.data.icon,
          color: n.data.color,
        },
        parentId: n.groupId,
        extent: n.groupId ? 'parent' : undefined,
      });
    });

    const edges: Edge[] = diagram.edges.map((e) => ({
      id: e.id,
      source: e.source,
      target: e.target,
      label: e.label,
      type: 'smoothstep',
    }));

    set({ nodes, edges });
  },
}));

if (typeof window !== 'undefined') {
  const savedSnapshots = localStorage.getItem('diagram-snapshots');
  if (savedSnapshots) {
    try {
      const snapshots = JSON.parse(savedSnapshots);
      useDiagramStore.setState({ snapshots });
    } catch (e) {
      console.error('Failed to load snapshots', e);
    }
  }
}
