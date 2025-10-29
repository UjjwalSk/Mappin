import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { examplePrompts } from '@shared/schema';
import { Server, Workflow, Database, GitBranch, Cloud, Box } from 'lucide-react';

interface ExamplesModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectExample: (prompt: string) => void;
}

const iconMap: Record<string, any> = {
  cloud: Cloud,
  service: Box,
  process: Workflow,
  database: Database,
  server: Server,
};

export default function ExamplesModal({ open, onOpenChange, onSelectExample }: ExamplesModalProps) {
  const handleSelect = (prompt: string) => {
    onSelectExample(prompt);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto" data-testid="modal-examples">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Example Prompts</DialogTitle>
          <DialogDescription>
            Choose an example to get started
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
          {examplePrompts.map((example) => {
            const Icon = iconMap[example.icon] || Box;
            return (
              <Button
                key={example.id}
                variant="outline"
                className="h-auto p-4 flex flex-col items-start gap-3 text-left hover-elevate active-elevate-2"
                onClick={() => handleSelect(example.prompt)}
                data-testid={`example-${example.id}`}
              >
                <div className="flex items-center gap-3 w-full">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm mb-1">{example.title}</h3>
                    <p className="text-xs text-muted-foreground capitalize">{example.category}</p>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground line-clamp-3 w-full text-wrap">
                  {example.prompt}
                </p>
              </Button>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
}
