import { GoogleGenerativeAI } from "@google/generative-ai";
import type { Diagram, DiagramNode, DiagramEdge } from "@shared/schema";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

const SYSTEM_PROMPT = `You are Mappin, an expert at converting natural language descriptions into structured diagram JSON.

Convert the user's description into a diagram JSON using this EXACT schema:
{
  "version": "1.0",
  "nodes": [
    {
      "id": "unique_string",
      "type": "rect" | "rounded" | "circle" | "database" | "queue" | "cloud" | "storage" | "process" | "decision",
      "data": {
        "label": "Node Label",
        "icon": "api" | "compute" | "database" | "cache" | "queue" | "loadbalancer" | "user" | "browser" | "mobile" | "cloud" | "storage" | "service" | "none",
        "color": "#hexcolor" // Optional: for custom node colors
      },
      "position": { "x": 0, "y": 0 },
      "groupId": "group_id" // Optional: if node belongs to a group
    }
  ],
  "edges": [
    {
      "id": "unique_string",
      "source": "source_node_id",
      "target": "target_node_id",
      "label": "Connection Label"
    }
  ],
  "groups": [
    {
      "id": "unique_string",
      "label": "Group Label",
      "nodeIds": ["node_id_1", "node_id_2"],
      "style": {
        "backgroundColor": "rgba(139, 92, 246, 0.1)", // Light purple, green, blue, orange, etc.
        "borderColor": "rgb(139, 92, 246)" // Matching border color
      }
    }
  ],
  "layoutHints": {
    "direction": "LR" | "TB" | "RL" | "BT",
    "spacing": 48
  }
}

CRITICAL RULES:
1. Output ONLY valid minified JSON. No markdown, no commentary, no extra text.
2. Every node must have a unique id (use short alphanumeric like "n1", "n2", etc.)
3. Every edge must reference existing node ids in source and target
4. Don't invent components not mentioned in the description
5. Use appropriate node types and icons based on context
6. Set position to {x:0, y:0} for all nodes (layout engine will arrange them)
7. Use LR (left-to-right) direction for most diagrams, TB (top-to-bottom) for hierarchies
8. DO NOT create groups - users will add containers manually if needed
9. Focus on creating clean, well-connected node diagrams

EXAMPLES:

Input: "User logs in via API, API checks Database"
Output: {"version":"1.0","nodes":[{"id":"n1","type":"circle","data":{"label":"User","icon":"user"},"position":{"x":0,"y":0}},{"id":"n2","type":"rounded","data":{"label":"API","icon":"api"},"position":{"x":0,"y":0}},{"id":"n3","type":"database","data":{"label":"Database","icon":"database"},"position":{"x":0,"y":0}}],"edges":[{"id":"e1","source":"n1","target":"n2","label":"Login"},{"id":"e2","source":"n2","target":"n3","label":"Check"}],"groups":[],"layoutHints":{"direction":"LR","spacing":48}}

Input: "Browser → Load Balancer → 3 App Servers → Redis Cache and PostgreSQL"
Output: {"version":"1.0","nodes":[{"id":"n1","type":"rect","data":{"label":"Browser","icon":"browser"},"position":{"x":0,"y":0}},{"id":"n2","type":"rect","data":{"label":"Load Balancer","icon":"loadbalancer"},"position":{"x":0,"y":0}},{"id":"n3","type":"rect","data":{"label":"App Server 1","icon":"compute"},"position":{"x":0,"y":0}},{"id":"n4","type":"rect","data":{"label":"App Server 2","icon":"compute"},"position":{"x":0,"y":0}},{"id":"n5","type":"rect","data":{"label":"App Server 3","icon":"compute"},"position":{"x":0,"y":0}},{"id":"n6","type":"rect","data":{"label":"Redis","icon":"cache"},"position":{"x":0,"y":0}},{"id":"n7","type":"database","data":{"label":"PostgreSQL","icon":"database"},"position":{"x":0,"y":0}}],"edges":[{"id":"e1","source":"n1","target":"n2","label":"HTTPS"},{"id":"e2","source":"n2","target":"n3"},{"id":"e3","source":"n2","target":"n4"},{"id":"e4","source":"n2","target":"n5"},{"id":"e5","source":"n3","target":"n6"},{"id":"e6","source":"n4","target":"n6"},{"id":"e7","source":"n5","target":"n6"},{"id":"e8","source":"n3","target":"n7"},{"id":"e9","source":"n4","target":"n7"},{"id":"e10","source":"n5","target":"n7"}],"groups":[],"layoutHints":{"direction":"LR","spacing":60}}`;

type DiagramType = "flowchart" | "architecture" | "erd" | "sequence" | "orgchart";

function getSystemPromptForType(type: DiagramType): string {
  const basePrompt = SYSTEM_PROMPT;

  const typeSpecificGuidance = {
    flowchart: `
FLOWCHART SPECIFIC RULES:
- Use 'decision' type for conditional nodes (diamond shapes)
- Use 'circle' for start/end nodes
- Use 'rect' or 'process' for process steps
- Add Yes/No labels to edges from decision nodes
- Create linear, top-to-bottom or left-to-right flow
- Include clear start and end points`,

    architecture: `
ARCHITECTURE DIAGRAM SPECIFIC RULES:
- Use 'database' type for databases
- Use 'cloud' for cloud services
- Use 'queue' for message queues
- Use 'storage' for storage services
- Group related components logically
- Show data flow direction in edge labels
- Use appropriate icons (api, compute, cache, loadbalancer, etc.)`,

    erd: `
ENTITY RELATIONSHIP DIAGRAM SPECIFIC RULES:
- Use 'database' type for all entities/tables
- Node labels should be table names (e.g., "Users", "Orders", "Products")
- Edge labels should show relationships (e.g., "has many", "belongs to", "1:N", "N:M")
- Include key fields in labels if mentioned
- Use TB (top-to-bottom) direction for layoutHints
- Keep structure hierarchical and organized`,

    sequence: `
SEQUENCE DIAGRAM SPECIFIC RULES:
- Use 'rect' type for actors/systems
- Arrange nodes in horizontal lanes (use LR direction)
- Edge labels must show the sequence (e.g., "1. Request", "2. Query", "3. Response")
- Show message flow between actors
- Include return/response messages
- Maintain time order from top to bottom`,

    orgchart: `
ORG CHART SPECIFIC RULES:
- Use 'rounded' or 'rect' for people/positions
- Use 'user' icon for individuals
- Show hierarchical reporting structure
- CEO/head at the top
- Use TB (top-to-bottom) direction
- Edge labels can show roles or relationships
- Group departments if mentioned`
  };

  return basePrompt + "\n\n" + typeSpecificGuidance[type];
}

export async function generateDiagram(prompt: string, diagramType: DiagramType = "architecture"): Promise<Diagram> {
  const startTime = Date.now();

  try {
    const systemPrompt = getSystemPromptForType(diagramType);

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      systemInstruction: systemPrompt,
      generationConfig: {
        responseMimeType: "application/json",
        temperature: 0.7,
      },
    });

    const result = await model.generateContent(prompt);
    const response = result.response;
    const rawJson = response.text();
    
    if (!rawJson) {
      throw new Error("Empty response from Gemini");
    }

    const diagram = JSON.parse(rawJson) as Diagram;
    
    const validated = validateAndRepair(diagram);
    
    console.log(`Diagram generated in ${Date.now() - startTime}ms: ${validated.nodes.length} nodes, ${validated.edges.length} edges`);
    
    return validated;
  } catch (error: any) {
    console.error("Diagram generation error:", error);
    
    if (error.message?.includes("JSON")) {
      throw new Error("Failed to parse diagram JSON from AI response");
    }
    
    throw new Error(`Failed to generate diagram: ${error.message}`);
  }
}

function validateAndRepair(diagram: any): Diagram {
  const nodes: DiagramNode[] = [];
  const edges: DiagramEdge[] = [];
  const nodeIds = new Set<string>();
  
  if (!diagram.nodes || !Array.isArray(diagram.nodes)) {
    throw new Error("Invalid diagram: missing or invalid nodes array");
  }
  
  for (const node of diagram.nodes) {
    if (!node.id || typeof node.id !== 'string') {
      continue;
    }
    
    if (nodeIds.has(node.id)) {
      node.id = `${node.id}_${Date.now()}`;
    }
    
    nodeIds.add(node.id);
    
    nodes.push({
      id: node.id,
      type: node.type || 'rect',
      data: {
        label: node.data?.label || 'Untitled',
        icon: node.data?.icon || 'none',
      },
      position: node.position || { x: 0, y: 0 },
    });
  }
  
  if (diagram.edges && Array.isArray(diagram.edges)) {
    for (const edge of diagram.edges) {
      if (!edge.id || !edge.source || !edge.target) {
        continue;
      }
      
      if (!nodeIds.has(edge.source) || !nodeIds.has(edge.target)) {
        continue;
      }
      
      edges.push({
        id: edge.id,
        source: edge.source,
        target: edge.target,
        label: edge.label,
        style: edge.style,
      });
    }
  }
  
  return {
    version: '1.0',
    nodes,
    edges,
    groups: diagram.groups || [],
    layoutHints: diagram.layoutHints || { direction: 'LR', spacing: 48 },
  };
}

export async function chatEditDiagram(
  currentDiagram: Diagram,
  userMessage: string,
  conversationHistory: Array<{ role: 'user' | 'ai', content: string }> = []
): Promise<{
  reply: string;
  updatedDiagram: Diagram;
  changes: Array<{ type: string; description: string; nodeId?: string; edgeId?: string }>;
}> {
  const CHAT_PROMPT = `You are an intelligent diagram editor assistant. You help users modify diagrams through natural conversation.

CURRENT DIAGRAM STATE:
${JSON.stringify(currentDiagram, null, 2)}

CAPABILITIES:
1. ADD nodes: Create new nodes with appropriate type, icon, and connections
2. REMOVE nodes: Delete nodes and cleanup their edges
3. MODIFY nodes: Change labels, types, icons, colors, or properties
4. CONNECT: Add edges between existing nodes
5. DISCONNECT: Remove specific edges
6. REORGANIZE: Suggest layout changes

CONVERSATION CONTEXT:
${conversationHistory.map(msg => `${msg.role.toUpperCase()}: ${msg.content}`).join('\n')}

USER REQUEST: "${userMessage}"

INSTRUCTIONS:
- Understand the user's intent from their natural language
- Make appropriate changes to the diagram
- Preserve diagram consistency (no orphaned edges, valid node references)
- Use appropriate node types and icons based on context
- If ambiguous, make reasonable assumptions or ask clarifying questions
- Be concise and friendly in responses
- Don't miss anything like marking any nodes "untitled", or missing connections

OUTPUT FORMAT:
Respond ONLY in the following JSON format (no markdown, no extra text) (VALID JSON ONLY):
{
  "reply": "Brief explanation of what you did",
  "diagram": { /* complete updated diagram JSON */ },
  "changes": [
    { "type": "added|removed|modified", "description": "what changed", "nodeId": "optional", "edgeId": "optional" }
  ],
  "needsClarification": false,
  "question": "optional clarifying question"
}

EXAMPLES:

User: "Add Redis cache between API and Database"
Response: {
  "reply": "Added Redis cache node and connected it between your API and Database",
  "diagram": { /* updated with Redis node */ },
  "changes": [
    { "type": "added", "description": "Redis cache node", "nodeId": "redis1" },
    { "type": "added", "description": "API to Redis connection", "edgeId": "e_api_redis" },
    { "type": "added", "description": "Redis to Database connection", "edgeId": "e_redis_db" }
  ]
}

User: "Remove the retry logic"
Response: {
  "reply": "Removed the retry node and its loop connection",
  "diagram": { /* updated without retry */ },
  "changes": [
    { "type": "removed", "description": "Retry node", "nodeId": "retry_node" },
    { "type": "removed", "description": "Loop back edge", "edgeId": "e_retry_loop" }
  ]
}

Now respond to the user's request.`;

  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      generationConfig: {
        responseMimeType: "application/json",
        temperature: 0.8,
      },
    });

    const result = await model.generateContent(CHAT_PROMPT);
    const response = result.response;
    const rawJson = response.text();

    if (!rawJson) {
      throw new Error("Empty response from AI");
    }

    const parsed = JSON.parse(rawJson);

    // Validate and repair the diagram
    const validatedDiagram = validateAndRepair(parsed.diagram);

    return {
      reply: parsed.reply || "I've updated the diagram",
      updatedDiagram: validatedDiagram,
      changes: parsed.changes || [],
    };
  } catch (error: any) {
    console.error("Diagram chat error:", error);
    throw new Error(`Failed to process diagram edit: ${error.message}`);
  }
}

export function diagramToMermaid(diagram: Diagram): string {
  const { nodes, edges, groups, layoutHints } = diagram;
  const direction = layoutHints?.direction || 'LR';

  let mermaid = `graph ${direction}\n`;

  // If there are groups, use subgraphs
  if (groups && groups.length > 0) {
    groups.forEach((group, index) => {
      mermaid += `  subgraph ${group.id}["${group.label}"]\n`;

      // Add nodes that belong to this group
      const groupNodes = nodes.filter(n => n.groupId === group.id);
      groupNodes.forEach((node) => {
        let shape = '[';
        let endShape = ']';

        if (node.type === 'circle') {
          shape = '((';
          endShape = '))';
        } else if (node.type === 'database') {
          shape = '[(';
          endShape = ')]';
        } else if (node.type === 'rounded') {
          shape = '(';
          endShape = ')';
        }

        mermaid += `    ${node.id}${shape}${node.data.label}${endShape}\n`;
      });

      mermaid += `  end\n`;
    });

    // Add nodes that don't belong to any group
    const ungroupedNodes = nodes.filter(n => !n.groupId);
    ungroupedNodes.forEach((node) => {
      let shape = '[';
      let endShape = ']';

      if (node.type === 'circle') {
        shape = '((';
        endShape = '))';
      } else if (node.type === 'database') {
        shape = '[(';
        endShape = ')]';
      } else if (node.type === 'rounded') {
        shape = '(';
        endShape = ')';
      }

      mermaid += `  ${node.id}${shape}${node.data.label}${endShape}\n`;
    });
  } else {
    // No groups - render nodes normally
    nodes.forEach((node) => {
      let shape = '[';
      let endShape = ']';

      if (node.type === 'circle') {
        shape = '((';
        endShape = '))';
      } else if (node.type === 'database') {
        shape = '[(';
        endShape = ')]';
      } else if (node.type === 'rounded') {
        shape = '(';
        endShape = ')';
      }

      mermaid += `  ${node.id}${shape}${node.data.label}${endShape}\n`;
    });
  }

  // Add edges
  edges.forEach((edge) => {
    const arrow = edge.style === 'dashed' ? '-.->' : '-->';
    const label = edge.label ? `|${edge.label}|` : '';
    mermaid += `  ${edge.source} ${arrow}${label} ${edge.target}\n`;
  });

  return mermaid;
}
