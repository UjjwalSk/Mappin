import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Download, FileImage, FileCode, FileJson } from 'lucide-react';
import { toPng, toSvg } from 'html-to-image';
import type { Diagram } from '@shared/schema';

interface ExportModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  diagram: Diagram;
  canvasRef: React.RefObject<HTMLDivElement>;
  backgroundColor?: string;
  showBackground?: boolean;
}

export default function ExportModal({ open, onOpenChange, diagram, canvasRef, backgroundColor = '#000000', showBackground = true }: ExportModalProps) {
  const [format, setFormat] = useState<'svg' | 'png' | 'mermaid' | 'json'>('svg');
  const [exporting, setExporting] = useState(false);

  const handleExport = async () => {
    setExporting(true);

    try {
      if (format === 'svg' && canvasRef.current) {
        // Find the ReactFlow viewport element (excludes controls and minimap)
        const viewport = canvasRef.current.querySelector('.react-flow__viewport') as HTMLElement;
        if (!viewport) {
          console.error('Could not find ReactFlow viewport');
          return;
        }

        const dataUrl = await toSvg(viewport, {
          backgroundColor: showBackground ? backgroundColor : 'transparent',
          cacheBust: true,
        });
        const link = document.createElement('a');
        link.download = `diagram-${Date.now()}.svg`;
        link.href = dataUrl;
        link.click();
      } else if (format === 'png' && canvasRef.current) {
        // Find the ReactFlow viewport element (excludes controls and minimap)
        const viewport = canvasRef.current.querySelector('.react-flow__viewport') as HTMLElement;
        if (!viewport) {
          console.error('Could not find ReactFlow viewport');
          return;
        }

        const dataUrl = await toPng(viewport, {
          backgroundColor: showBackground ? backgroundColor : 'transparent',
          pixelRatio: 2,
          cacheBust: true,
        });
        const link = document.createElement('a');
        link.download = `diagram-${Date.now()}.png`;
        link.href = dataUrl;
        link.click();
      } else if (format === 'json') {
        const blob = new Blob([JSON.stringify(diagram, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.download = `diagram-${Date.now()}.json`;
        link.href = url;
        link.click();
        URL.revokeObjectURL(url);
      } else if (format === 'mermaid') {
        const mermaidCode = diagramToMermaid(diagram);
        const blob = new Blob([mermaidCode], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.download = `diagram-${Date.now()}.mmd`;
        link.href = url;
        link.click();
        URL.revokeObjectURL(url);
      }
      
      onOpenChange(false);
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setExporting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md" data-testid="modal-export">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Export Diagram</DialogTitle>
          <DialogDescription>
            Choose the format for exporting your diagram
          </DialogDescription>
        </DialogHeader>

        <RadioGroup value={format} onValueChange={(v) => setFormat(v as any)} className="space-y-3 py-4">
          <div className="flex items-center space-x-3 p-3 rounded-lg border border-border hover-elevate">
            <RadioGroupItem value="svg" id="svg" data-testid="radio-svg" />
            <Label htmlFor="svg" className="flex items-center gap-3 flex-1 cursor-pointer">
              <FileImage className="w-5 h-5 text-primary" />
              <div>
                <div className="font-medium text-sm">SVG (Vector)</div>
                <div className="text-xs text-muted-foreground">Crisp, scalable format</div>
              </div>
            </Label>
          </div>

          <div className="flex items-center space-x-3 p-3 rounded-lg border border-border hover-elevate">
            <RadioGroupItem value="png" id="png" data-testid="radio-png" />
            <Label htmlFor="png" className="flex items-center gap-3 flex-1 cursor-pointer">
              <FileImage className="w-5 h-5 text-primary" />
              <div>
                <div className="font-medium text-sm">PNG (Image)</div>
                <div className="text-xs text-muted-foreground">High resolution raster</div>
              </div>
            </Label>
          </div>

          <div className="flex items-center space-x-3 p-3 rounded-lg border border-border hover-elevate">
            <RadioGroupItem value="mermaid" id="mermaid" data-testid="radio-mermaid" />
            <Label htmlFor="mermaid" className="flex items-center gap-3 flex-1 cursor-pointer">
              <FileCode className="w-5 h-5 text-primary" />
              <div>
                <div className="font-medium text-sm">Mermaid Code</div>
                <div className="text-xs text-muted-foreground">Text-based diagram</div>
              </div>
            </Label>
          </div>

          <div className="flex items-center space-x-3 p-3 rounded-lg border border-border hover-elevate">
            <RadioGroupItem value="json" id="json" data-testid="radio-json" />
            <Label htmlFor="json" className="flex items-center gap-3 flex-1 cursor-pointer">
              <FileJson className="w-5 h-5 text-primary" />
              <div>
                <div className="font-medium text-sm">JSON Data</div>
                <div className="text-xs text-muted-foreground">Re-editable format</div>
              </div>
            </Label>
          </div>
        </RadioGroup>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} data-testid="button-cancel-export">
            Cancel
          </Button>
          <Button onClick={handleExport} disabled={exporting} data-testid="button-export">
            <Download className="w-4 h-4 mr-2" />
            {exporting ? 'Exporting...' : 'Export'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
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
