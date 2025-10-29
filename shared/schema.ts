import { z } from "zod";

// Node types for different diagram shapes
export const nodeTypeSchema = z.enum([
  "rect",
  "rounded",
  "circle",
  "database",
  "queue",
  "cloud",
  "storage",
  "process",
  "decision",
  "group",
  "text", // Text-only annotation node
]);

export type NodeType = z.infer<typeof nodeTypeSchema>;

// Icon types for nodes - expanded for enterprise features
export const iconTypeSchema = z.enum([
  "none",
  "api",
  "compute",
  "database",
  "cache",
  "queue",
  "loadbalancer",
  "user",
  "browser",
  "mobile",
  "cloud",
  "storage",
  "service",
  "server",
  "container",
  "function",
  "network",
  "security",
  "analytics",
  "messaging",
  "monitoring",
  "file",
  "folder",
  "package",
]);

export type IconType = z.infer<typeof iconTypeSchema>;

// Edge/connector styles (legacy)
export const edgeStyleSchema = z.enum(["solid", "dashed", "dotted"]);
export type EdgeStyle = z.infer<typeof edgeStyleSchema>;

// Edge line types
export const edgeLineTypeSchema = z.enum(["straight", "smoothstep", "bezier", "step"]);
export type EdgeLineType = z.infer<typeof edgeLineTypeSchema>;

// Edge arrow types
export const edgeArrowTypeSchema = z.enum(["arrow", "arrowclosed", "diamond", "circle", "none"]);
export type EdgeArrowType = z.infer<typeof edgeArrowTypeSchema>;

// Edge dash types
export const edgeDashTypeSchema = z.enum(["solid", "dashed", "dotted", "dashdot"]);
export type EdgeDashType = z.infer<typeof edgeDashTypeSchema>;

// Diagram node schema
export const diagramNodeSchema = z.object({
  id: z.string(),
  type: nodeTypeSchema,
  data: z.object({
    label: z.string(),
    icon: iconTypeSchema.optional(),
    color: z.string().optional(),
  }),
  position: z.object({
    x: z.number(),
    y: z.number(),
  }),
  groupId: z.string().optional(),
});

export type DiagramNode = z.infer<typeof diagramNodeSchema>;

// Edge data schema for styling
export const edgeDataSchema = z.object({
  lineType: edgeLineTypeSchema.optional(),
  strokeColor: z.string().optional(),
  strokeWidth: z.number().optional(),
  animated: z.boolean().optional(),
  dashType: edgeDashTypeSchema.optional(),
  label: z.string().optional(),
  labelColor: z.string().optional(),
  labelBgColor: z.string().optional(),
  labelFontSize: z.number().optional(),
  labelFontWeight: z.string().optional(),
  arrowType: edgeArrowTypeSchema.optional(),
}).optional();

export type EdgeData = z.infer<typeof edgeDataSchema>;

// Diagram edge schema
export const diagramEdgeSchema = z.object({
  id: z.string(),
  source: z.string(),
  target: z.string(),
  label: z.string().optional(),
  style: edgeStyleSchema.optional(), // Legacy
  data: edgeDataSchema, // New styling data
});

export type DiagramEdge = z.infer<typeof diagramEdgeSchema>;

// Diagram group/container schema
export const diagramGroupSchema = z.object({
  id: z.string(),
  label: z.string(),
  nodeIds: z.array(z.string()),
  position: z.object({
    x: z.number(),
    y: z.number(),
  }).optional(),
  style: z.object({
    backgroundColor: z.string().optional(),
    borderColor: z.string().optional(),
    borderWidth: z.number().optional(),
    borderStyle: z.enum(['solid', 'dashed', 'dotted']).optional(),
  }).optional(),
});

export type DiagramGroup = z.infer<typeof diagramGroupSchema>;

// Layout hints
export const layoutHintsSchema = z.object({
  direction: z.enum(["LR", "TB", "RL", "BT"]).default("LR"),
  spacing: z.number().optional().default(48),
});

export type LayoutHints = z.infer<typeof layoutHintsSchema>;

// Complete diagram model
export const diagramSchema = z.object({
  version: z.string().default("1.0"),
  nodes: z.array(diagramNodeSchema),
  edges: z.array(diagramEdgeSchema),
  groups: z.array(diagramGroupSchema).optional().default([]),
  layoutHints: layoutHintsSchema.optional(),
});

export type Diagram = z.infer<typeof diagramSchema>;

// Insert schemas for API requests
export const generateDiagramRequestSchema = z.object({
  prompt: z.string().min(10, "Prompt must be at least 10 characters"),
  preferences: z.object({
    type: z.enum(["flowchart", "architecture", "erd", "sequence", "orgchart"]).default("architecture"),
    output: z.enum(["json", "mermaid"]).default("json"),
  }).optional(),
});

export type GenerateDiagramRequest = z.infer<typeof generateDiagramRequestSchema>;

export const generateDiagramResponseSchema = z.object({
  model: diagramSchema,
  mermaid: z.string().optional(),
  stats: z.object({
    tokens: z.number().optional(),
    latencyMs: z.number(),
  }),
});

export type GenerateDiagramResponse = z.infer<typeof generateDiagramResponseSchema>;

// Convert request schema
export const convertRequestSchema = z.object({
  from: z.enum(["mermaid", "json"]),
  to: z.enum(["mermaid", "json"]),
  code: z.string(),
});

export type ConvertRequest = z.infer<typeof convertRequestSchema>;

// Export request schema
export const exportRequestSchema = z.object({
  format: z.enum(["svg", "png", "mermaid", "json"]),
  diagram: diagramSchema,
  scale: z.number().optional().default(2),
});

export type ExportRequest = z.infer<typeof exportRequestSchema>;

// Diagram snapshot for local storage
export const diagramSnapshotSchema = z.object({
  id: z.string(),
  name: z.string(),
  diagram: diagramSchema,
  timestamp: z.number(),
});

export type DiagramSnapshot = z.infer<typeof diagramSnapshotSchema>;

// Example prompts
export interface ExamplePrompt {
  id: string;
  title: string;
  category: "architecture" | "flowchart" | "erd" | "sequence";
  prompt: string;
  icon: string;
}

export const examplePrompts: ExamplePrompt[] = [
  {
    id: "ex1",
    title: "Microservices Architecture",
    category: "architecture",
    prompt: "Web app with Browser → API Gateway → 2 services (Auth, Orders) → Postgres; Queue between Orders and Worker; expose Admin UI",
    icon: "cloud",
  },
  {
    id: "ex2",
    title: "E-commerce System",
    category: "architecture",
    prompt: "E-commerce with User → Load Balancer → API (3 instances) → Cache (Redis) → Database (MySQL); Payment Service → Stripe; Inventory Service → Warehouse DB",
    icon: "service",
  },
  {
    id: "ex3",
    title: "User Login Flow",
    category: "flowchart",
    prompt: "User login flowchart: Start → Enter credentials → Validate → Check if valid → If yes: Load dashboard → End; If no: Show error → Retry (max 3 times) → Lock account → End",
    icon: "process",
  },
  {
    id: "ex4",
    title: "Data Pipeline",
    category: "architecture",
    prompt: "Data pipeline: Data Sources → Kafka → Stream Processor → Data Lake (S3) → ETL Jobs → Data Warehouse (Snowflake) → BI Tools (Tableau)",
    icon: "database",
  },
];
