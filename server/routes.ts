import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { generateDiagram, diagramToMermaid, chatEditDiagram } from "./gemini";
import {
  generateDiagramRequestSchema,
  type GenerateDiagramResponse,
  type Diagram,
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  app.post("/api/generate", async (req, res) => {
    try {
      const validatedRequest = generateDiagramRequestSchema.parse(req.body);

      const startTime = Date.now();
      const diagramType = validatedRequest.preferences?.type || "architecture";
      const diagram = await generateDiagram(validatedRequest.prompt, diagramType);
      const latencyMs = Date.now() - startTime;
      
      const mermaid = diagramToMermaid(diagram);
      
      const response: GenerateDiagramResponse = {
        model: diagram,
        mermaid,
        stats: {
          latencyMs,
        },
      };
      
      res.json(response);
    } catch (error: any) {
      console.error("Generation error:", error);
      
      if (error.name === 'ZodError') {
        res.status(400).json({ 
          error: "Invalid request",
          details: error.errors 
        });
        return;
      }
      
      res.status(500).json({ 
        error: error.message || "Failed to generate diagram" 
      });
    }
  });

  app.post("/api/convert", async (req, res) => {
    try {
      const { from, to, code } = req.body;

      if (from === 'json' && to === 'mermaid') {
        const diagram = JSON.parse(code);
        const mermaid = diagramToMermaid(diagram);
        res.json({ result: mermaid });
      } else if (from === 'mermaid' && to === 'json') {
        res.status(501).json({ error: "Mermaid to JSON conversion not yet implemented" });
      } else {
        res.status(400).json({ error: "Invalid conversion requested" });
      }
    } catch (error: any) {
      res.status(500).json({ error: error.message || "Conversion failed" });
    }
  });

  app.post("/api/diagram/chat", async (req, res) => {
    try {
      const { currentDiagram, message, conversationHistory } = req.body;

      if (!currentDiagram || !message) {
        res.status(400).json({ error: "Missing required fields: currentDiagram, message" });
        return;
      }

      const startTime = Date.now();
      const result = await chatEditDiagram(
        currentDiagram as Diagram,
        message as string,
        conversationHistory || []
      );
      const latencyMs = Date.now() - startTime;

      res.json({
        ...result,
        stats: { latencyMs }
      });
    } catch (error: any) {
      console.error("Diagram chat error:", error);
      res.status(500).json({
        error: error.message || "Failed to process chat request"
      });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
