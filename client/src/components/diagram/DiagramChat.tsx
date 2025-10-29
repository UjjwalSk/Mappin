import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  MessageSquare,
  Send,
  Loader2,
  X,
  Sparkles,
  Plus,
  Trash2,
  Edit3
} from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';
import type { Diagram } from '@shared/schema';
import { useToast } from '@/hooks/use-toast';

interface Message {
  id: string;
  role: 'user' | 'ai';
  content: string;
  timestamp: Date;
  changes?: Array<{
    type: string;
    description: string;
    nodeId?: string;
    edgeId?: string;
  }>;
}

interface DiagramChatProps {
  diagram: Diagram;
  onDiagramUpdate: (diagram: Diagram) => void;
  onClose: () => void;
}

export default function DiagramChat({ diagram, onDiagramUpdate, onClose }: DiagramChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '0',
      role: 'ai',
      content: "Hi! I'm your diagram assistant. I can help you edit this diagram. Try asking me to:\n\n• Add components\n• Remove nodes\n• Connect elements\n• Modify styles\n\nWhat would you like to change?",
      timestamp: new Date(),
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Auto-scroll to bottom when new messages arrive
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const conversationHistory = messages.map(msg => ({
        role: msg.role,
        content: msg.content,
      }));

      const response = await apiRequest('POST', '/api/diagram/chat', {
        currentDiagram: diagram,
        message: userMessage.content,
        conversationHistory,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to process request');
      }

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'ai',
        content: data.reply,
        timestamp: new Date(),
        changes: data.changes,
      };

      setMessages(prev => [...prev, aiMessage]);

      // Update diagram
      onDiagramUpdate(data.updatedDiagram);

      toast({
        title: 'Diagram updated',
        description: `${data.changes?.length || 0} changes made`,
      });
    } catch (error: any) {
      console.error('Chat error:', error);

      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'ai',
        content: `Sorry, I encountered an error: ${error.message}. Please try again.`,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, errorMessage]);

      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const quickActions = [
    { icon: Plus, label: 'Add cache', prompt: 'Add a Redis cache layer' },
    { icon: Trash2, label: 'Remove node', prompt: 'Remove the retry logic' },
    { icon: Edit3, label: 'Add error handling', prompt: 'Add error handling' },
  ];

  return (
    <div className="w-96 border-l border-border bg-card flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-primary" />
          <div>
            <h3 className="font-semibold">AI Assistant</h3>
            <p className="text-xs text-muted-foreground">Edit diagram with chat</p>
          </div>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="w-4 h-4" />
        </Button>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4" ref={scrollRef}>
        <div className="space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[85%] ${msg.role === 'user' ? 'ml-8' : 'mr-8'}`}>
                {/* Message bubble */}
                <div
                  className={`rounded-lg p-3 ${
                    msg.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                </div>

                {/* Changes list */}
                {msg.changes && msg.changes.length > 0 && (
                  <div className="mt-2 space-y-1">
                    {msg.changes.map((change, idx) => (
                      <div
                        key={idx}
                        className="text-xs text-muted-foreground flex items-center gap-1"
                      >
                        {change.type === 'added' && (
                          <Plus className="w-3 h-3 text-green-500" />
                        )}
                        {change.type === 'removed' && (
                          <Trash2 className="w-3 h-3 text-red-500" />
                        )}
                        {change.type === 'modified' && (
                          <Edit3 className="w-3 h-3 text-blue-500" />
                        )}
                        <span>{change.description}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Timestamp */}
                <p className="text-xs text-muted-foreground mt-1">
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          ))}

          {/* Loading indicator */}
          {isLoading && (
            <div className="flex justify-start mr-8">
              <div className="bg-muted rounded-lg p-3">
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-sm text-muted-foreground">Thinking...</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Quick actions */}
      {messages.length === 1 && !isLoading && (
        <div className="px-4 py-2 border-t border-border">
          <p className="text-xs text-muted-foreground mb-2">Quick actions:</p>
          <div className="flex flex-wrap gap-2">
            {quickActions.map((action, idx) => (
              <Button
                key={idx}
                size="sm"
                variant="outline"
                className="text-xs"
                onClick={() => setInput(action.prompt)}
              >
                <action.icon className="w-3 h-3 mr-1" />
                {action.label}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="p-4 border-t border-border">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
            placeholder="Ask me to edit the diagram..."
            disabled={isLoading}
            className="flex-1"
          />
          <Button
            onClick={sendMessage}
            disabled={isLoading || !input.trim()}
            size="icon"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>
        </div>

        <p className="text-xs text-muted-foreground mt-2">
          <Sparkles className="w-3 h-3 inline mr-1" />
          Powered by Gemini
        </p>
      </div>
    </div>
  );
}
