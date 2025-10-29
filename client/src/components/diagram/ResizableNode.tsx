import { memo, useState, useEffect, useCallback } from 'react';
import { Handle, Position, NodeResizer, type NodeProps, useReactFlow } from '@xyflow/react';
import { getIconById, type IconDefinition } from '@/lib/iconLibraries';
import {
  Server, Database, Cloud, Box, HardDrive, Workflow,
  GitBranch, User, Globe, Smartphone, Zap, Network,
  Code, Shield, Lock, Key, Mail, Bell, MessageSquare,
  FileText, Folder, Package, Container, Cpu, Activity,
  type LucideIcon
} from 'lucide-react';
import type { IconType } from '@shared/schema';

const defaultIconMap: Record<string, LucideIcon> = {
  none: Code,
  api: Code,
  compute: Server,
  database: Database,
  cache: Zap,
  queue: GitBranch,
  loadbalancer: Network,
  user: User,
  browser: Globe,
  mobile: Smartphone,
  cloud: Cloud,
  storage: HardDrive,
  service: Box,
  server: Server,
  container: Container,
  function: Zap,
  network: Network,
  security: Shield,
  analytics: Package,
  messaging: MessageSquare,
  monitoring: Activity,
  file: FileText,
  folder: Folder,
  package: Package,
};

function ResizableNode({ data, type, selected, id }: NodeProps) {
  const { setNodes } = useReactFlow();
  const [iconDef, setIconDef] = useState<IconDefinition | null>(null);

  // Try to load icon from library using iconId
  useEffect(() => {
    if ((data as any).iconId) {
      const def = getIconById((data as any).iconId);
      if (def) {
        setIconDef(def);
      }
    }
  }, [(data as any).iconId]);

  // Handle resize event
  const handleResize = useCallback((_event: any, params: { width: number; height: number }) => {
    setNodes((nodes) =>
      nodes.map((node) => {
        if (node.id === id) {
          return {
            ...node,
            data: {
              ...node.data,
              width: params.width,
              height: params.height,
            },
          };
        }
        return node;
      })
    );
  }, [id, setNodes]);

  const Icon = iconDef?.icon || (data.icon && data.icon !== 'none' ? defaultIconMap[data.icon as string] : null);
  const label = (data as any).label || 'Node';
  const testId = typeof label === 'string' ? label.toLowerCase().replace(/\s+/g, '-') : 'node';

  const nodeColor = (data as any).color || 'hsl(var(--card))';
  const borderColor = selected ? 'hsl(var(--primary))' : (iconDef?.color ? iconDef.color : 'hsl(var(--border))');
  const fontSize = (data as any).fontSize || 14;
  const fontWeight = (data as any).fontWeight || '500';
  const textColor = (data as any).textColor || 'hsl(var(--card-foreground))';
  const borderWidth = (data as any).borderWidth || 2;
  const showShadow = (data as any).showShadow || false;
  const isHighlighted = (data as any).isHighlighted || false;

  const width = (data as any).width || 180;
  const height = (data as any).height || 80;

  // Decision/Diamond shape - use SVG for proper diamond without rotation
  if (type === 'decision') {
    return (
      <div className="relative" style={{ width, height }} data-testid={`node-${testId}`}>
        <NodeResizer
          isVisible={selected}
          minWidth={100}
          minHeight={100}
          color="hsl(var(--primary))"
          handleStyle={{
            width: 8,
            height: 8,
            borderRadius: '50%',
          }}
          onResize={handleResize}
        />
        <svg width="100%" height="100%" className={`absolute inset-0 ${isHighlighted ? 'ai-highlight' : ''}`}>
          <polygon
            points={`${width/2},10 ${width-10},${height/2} ${width/2},${height-10} 10,${height/2}`}
            fill={nodeColor}
            stroke={borderColor}
            strokeWidth={borderWidth}
            style={{ filter: showShadow ? 'drop-shadow(0 4px 6px rgba(0,0,0,0.3))' : 'none' }}
            className={isHighlighted ? 'ai-highlight' : ''}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="flex flex-col items-center gap-1 px-4">
            {Icon && <Icon className="w-4 h-4 text-primary" style={{ color: iconDef?.color }} />}
            <div
              className="text-center max-w-[80%] break-words"
              style={{ fontSize: `${fontSize}px`, fontWeight, color: textColor }}
            >
              {label}
            </div>
          </div>
        </div>
        <Handle type="target" position={Position.Top} className="w-3 h-3 rounded-full bg-primary border-2 border-background" />
        <Handle type="target" position={Position.Left} className="w-3 h-3 rounded-full bg-primary border-2 border-background" />
        <Handle type="source" position={Position.Bottom} className="w-3 h-3 rounded-full bg-primary border-2 border-background" />
        <Handle type="source" position={Position.Right} className="w-3 h-3 rounded-full bg-primary border-2 border-background" />
      </div>
    );
  }

  // Circle shape
  if (type === 'circle') {
    const circleSize = Math.min(width, height);
    return (
      <div className="relative" style={{ width: circleSize, height: circleSize }} data-testid={`node-${testId}`}>
        <NodeResizer
          isVisible={selected}
          minWidth={80}
          minHeight={80}
          color="hsl(var(--primary))"
          handleStyle={{
            width: 8,
            height: 8,
            borderRadius: '50%',
          }}
          keepAspectRatio
          onResize={handleResize}
        />
        <div
          className={`rounded-full w-full h-full transition-all duration-150 flex items-center justify-center ${isHighlighted ? 'ai-highlight' : ''}`}
          style={{
            backgroundColor: nodeColor,
            borderColor: borderColor,
            borderWidth: `${borderWidth}px`,
            borderStyle: 'solid',
            boxShadow: showShadow ? '0 10px 15px -3px rgb(0 0 0 / 0.3)' : (selected ? '0 10px 15px -3px rgb(0 0 0 / 0.3)' : 'none')
          }}
        >
          <div className="flex flex-col items-center gap-1">
            {Icon && <Icon className="w-5 h-5 text-primary" style={{ color: iconDef?.color }} />}
            <div
              className="text-center px-2"
              style={{ fontSize: `${fontSize}px`, fontWeight, color: textColor }}
            >
              {label}
            </div>
          </div>
        </div>
        <Handle type="target" position={Position.Top} className="w-3 h-3 rounded-full bg-primary border-2 border-background" />
        <Handle type="target" position={Position.Left} className="w-3 h-3 rounded-full bg-primary border-2 border-background" />
        <Handle type="source" position={Position.Bottom} className="w-3 h-3 rounded-full bg-primary border-2 border-background" />
        <Handle type="source" position={Position.Right} className="w-3 h-3 rounded-full bg-primary border-2 border-background" />
      </div>
    );
  }

  // Database cylinder shape
  if (type === 'database') {
    return (
      <div className="relative" style={{ width, height }} data-testid={`node-${testId}`}>
        <NodeResizer
          isVisible={selected}
          minWidth={100}
          minHeight={120}
          color="hsl(var(--primary))"
          handleStyle={{
            width: 8,
            height: 8,
            borderRadius: '50%',
          }}
          onResize={handleResize}
        />
        <svg width="100%" height="100%" className={`absolute inset-0 ${isHighlighted ? 'ai-highlight' : ''}`} style={{ filter: showShadow ? 'drop-shadow(0 4px 6px rgba(0,0,0,0.3))' : 'none' }}>
          <ellipse cx={width/2} cy="20" rx={width/2-5} ry="15" fill={nodeColor} stroke={borderColor} strokeWidth={borderWidth} />
          <rect x="5" y="20" width={width-10} height={height-40} fill={nodeColor} stroke="none" />
          <line x1="5" y1="20" x2="5" y2={height-20} stroke={borderColor} strokeWidth={borderWidth} />
          <line x1={width-5} y1="20" x2={width-5} y2={height-20} stroke={borderColor} strokeWidth={borderWidth} />
          <ellipse cx={width/2} cy={height-20} rx={width/2-5} ry="15" fill={nodeColor} stroke={borderColor} strokeWidth={borderWidth} />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center pt-4 pointer-events-none">
          <div className="flex flex-col items-center gap-1">
            {Icon && <Icon className="w-5 h-5 text-primary" style={{ color: iconDef?.color }} />}
            <div
              className="text-center px-2"
              style={{ fontSize: `${fontSize}px`, fontWeight, color: textColor }}
            >
              {label}
            </div>
          </div>
        </div>
        <Handle type="target" position={Position.Top} className="w-3 h-3 rounded-full bg-primary border-2 border-background" />
        <Handle type="target" position={Position.Left} className="w-3 h-3 rounded-full bg-primary border-2 border-background" />
        <Handle type="source" position={Position.Bottom} className="w-3 h-3 rounded-full bg-primary border-2 border-background" />
        <Handle type="source" position={Position.Right} className="w-3 h-3 rounded-full bg-primary border-2 border-background" />
      </div>
    );
  }

  // Default rectangular shapes
  const baseClasses = "transition-all duration-150 flex items-center justify-center";
  const roundedClass = type === 'rounded' ? 'rounded-xl' : 'rounded-lg';

  return (
    <div className="relative" style={{ width, height }} data-testid={`node-${testId}`}>
      <NodeResizer
        isVisible={selected}
        minWidth={100}
        minHeight={60}
        color="hsl(var(--primary))"
        handleStyle={{
          width: 8,
          height: 8,
          borderRadius: '50%',
        }}
        onResize={handleResize}
      />
      <div
        className={`${baseClasses} ${roundedClass} w-full h-full ${isHighlighted ? 'ai-highlight' : ''}`}
        style={{
          backgroundColor: nodeColor,
          borderColor: borderColor,
          borderWidth: `${borderWidth}px`,
          borderStyle: 'solid',
          boxShadow: showShadow ? '0 10px 15px -3px rgb(0 0 0 / 0.3)' : (selected ? '0 10px 15px -3px rgb(0 0 0 / 0.3)' : 'none')
        }}
      >
        <Handle type="target" position={Position.Top} className="w-3 h-3 rounded-full bg-primary border-2 border-background" />
        <Handle type="target" position={Position.Left} className="w-3 h-3 rounded-full bg-primary border-2 border-background" />

        <div className="flex flex-col items-center gap-2 px-2">
          {Icon && <Icon className="w-5 h-5 text-primary flex-shrink-0" style={{ color: iconDef?.color }} data-testid="node-icon" />}
          <div
            className="text-center break-words max-w-full"
            style={{ fontSize: `${fontSize}px`, fontWeight, color: textColor }}
            data-testid="node-label"
          >
            {label}
          </div>
        </div>

        <Handle type="source" position={Position.Bottom} className="w-3 h-3 rounded-full bg-primary border-2 border-background" />
        <Handle type="source" position={Position.Right} className="w-3 h-3 rounded-full bg-primary border-2 border-background" />
      </div>
    </div>
  );
}

export default memo(ResizableNode);
