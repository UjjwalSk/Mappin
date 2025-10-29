import { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Play, Copy, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { Diagram } from '@shared/schema';

interface CodeEditorProps {
  diagram: Diagram;
  onApply: (code: string, format: 'mermaid' | 'json') => void;
}

function diagramToMermaid(diagram: Diagram): string {
  const { nodes, edges, layoutHints } = diagram;
  const direction = layoutHints?.direction || 'LR';
  
  let mermaid = `graph ${direction}\n`;
  
  nodes.forEach((node) => {
    const shape = node.type === 'circle' ? '((' : node.type === 'database' ? '[(' : '[';
    const endShape = node.type === 'circle' ? '))' : node.type === 'database' ? ')]' : ']';
    mermaid += `  ${node.id}${shape}${node.data.label}${endShape}\n`;
  });
  
  edges.forEach((edge) => {
    const arrow = edge.style === 'dashed' ? '-.->' : '-->';
    const label = edge.label ? `|${edge.label}|` : '';
    mermaid += `  ${edge.source} ${arrow}${label} ${edge.target}\n`;
  });
  
  return mermaid;
}

export default function CodeEditor({ diagram, onApply }: CodeEditorProps) {
  const [activeTab, setActiveTab] = useState<'mermaid' | 'json'>('mermaid');
  const [mermaidCode, setMermaidCode] = useState(() => diagramToMermaid(diagram));
  const [jsonCode, setJsonCode] = useState(() => JSON.stringify(diagram, null, 2));
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  // Update code when diagram changes
  useEffect(() => {
    setMermaidCode(diagramToMermaid(diagram));
    setJsonCode(JSON.stringify(diagram, null, 2));
  }, [diagram]);

  const handleApply = () => {
    try {
      const code = activeTab === 'mermaid' ? mermaidCode : jsonCode;
      onApply(code, activeTab);
      toast({
        title: 'Code applied',
        description: `Diagram updated from ${activeTab.toUpperCase()}`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to apply code changes',
        variant: 'destructive',
      });
    }
  };

  const handleCopy = async () => {
    const code = activeTab === 'mermaid' ? mermaidCode : jsonCode;
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast({
      title: 'Copied to clipboard',
      description: `${activeTab.toUpperCase()} code copied`,
    });
  };

  return (
    <div className="w-96 border-l border-border bg-background h-full flex flex-col">
      <div className="p-4 border-b border-border flex items-center justify-between">
        <h3 className="text-base font-semibold text-foreground" data-testid="code-editor-title">
          Code Editor
        </h3>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={handleCopy}
            data-testid="button-copy-code"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          </Button>
          <Button
            size="sm"
            onClick={handleApply}
            data-testid="button-apply-code"
          >
            <Play className="w-4 h-4 mr-1" />
            Apply
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'mermaid' | 'json')} className="flex-1 flex flex-col">
        <TabsList className="w-full rounded-none border-b border-border h-12 bg-background justify-start px-3">
          <TabsTrigger value="mermaid" className="data-[state=active]:bg-accent/50" data-testid="tab-mermaid">
            Mermaid
          </TabsTrigger>
          <TabsTrigger value="json" className="data-[state=active]:bg-accent/50" data-testid="tab-json">
            JSON
          </TabsTrigger>
        </TabsList>

        <TabsContent value="mermaid" className="flex-1 m-0 p-0" data-testid="editor-mermaid">
          <Editor
            height="100%"
            language="text"
            value={mermaidCode}
            onChange={(value) => setMermaidCode(value || '')}
            theme="vs-dark"
            options={{
              minimap: { enabled: false },
              fontSize: 13,
              fontFamily: 'JetBrains Mono, monospace',
              lineHeight: 1.6,
              padding: { top: 16, bottom: 16 },
              scrollBeyondLastLine: false,
            }}
          />
        </TabsContent>

        <TabsContent value="json" className="flex-1 m-0 p-0" data-testid="editor-json">
          <Editor
            height="100%"
            language="json"
            value={jsonCode}
            onChange={(value) => setJsonCode(value || '')}
            theme="vs-dark"
            options={{
              minimap: { enabled: false },
              fontSize: 13,
              fontFamily: 'JetBrains Mono, monospace',
              lineHeight: 1.6,
              padding: { top: 16, bottom: 16 },
              scrollBeyondLastLine: false,
            }}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
