import { useCallback } from 'react';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from '@/components/ui/context-menu';
import {
  Copy,
  Trash2,
  Edit,
  Lock,
  Unlock,
  Eye,
  EyeOff,
  Group,
  Ungroup,
  Layers,
  Palette,
  MoveUp,
  MoveDown,
} from 'lucide-react';
import type { Node, Edge } from '@xyflow/react';

interface NodeContextMenuProps {
  children: React.ReactNode;
  node: Node;
  onDuplicate: (nodeId: string) => void;
  onDelete: (nodeId: string) => void;
  onLock: (nodeId: string) => void;
  onUnlock: (nodeId: string) => void;
  onBringToFront: (nodeId: string) => void;
  onSendToBack: (nodeId: string) => void;
  onCopy: (nodeId: string) => void;
  onGroup: () => void;
}

export function NodeContextMenu({
  children,
  node,
  onDuplicate,
  onDelete,
  onLock,
  onUnlock,
  onBringToFront,
  onSendToBack,
  onCopy,
  onGroup,
}: NodeContextMenuProps) {
  const isLocked = (node.data as any)?.locked || false;

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        {children}
      </ContextMenuTrigger>
      <ContextMenuContent className="w-56">
        <ContextMenuItem onClick={() => onCopy(node.id)}>
          <Copy className="w-4 h-4 mr-2" />
          Copy
          <span className="ml-auto text-xs text-muted-foreground">⌘C</span>
        </ContextMenuItem>
        <ContextMenuItem onClick={() => onDuplicate(node.id)}>
          <Copy className="w-4 h-4 mr-2" />
          Duplicate
          <span className="ml-auto text-xs text-muted-foreground">⌘D</span>
        </ContextMenuItem>
        <ContextMenuItem onClick={() => onDelete(node.id)}>
          <Trash2 className="w-4 h-4 mr-2" />
          Delete
          <span className="ml-auto text-xs text-muted-foreground">Del</span>
        </ContextMenuItem>

        <ContextMenuSeparator />

        <ContextMenuSub>
          <ContextMenuSubTrigger>
            <Layers className="w-4 h-4 mr-2" />
            Arrange
          </ContextMenuSubTrigger>
          <ContextMenuSubContent>
            <ContextMenuItem onClick={() => onBringToFront(node.id)}>
              <MoveUp className="w-4 h-4 mr-2" />
              Bring to Front
            </ContextMenuItem>
            <ContextMenuItem onClick={() => onSendToBack(node.id)}>
              <MoveDown className="w-4 h-4 mr-2" />
              Send to Back
            </ContextMenuItem>
          </ContextMenuSubContent>
        </ContextMenuSub>

        <ContextMenuSeparator />

        {isLocked ? (
          <ContextMenuItem onClick={() => onUnlock(node.id)}>
            <Unlock className="w-4 h-4 mr-2" />
            Unlock
          </ContextMenuItem>
        ) : (
          <ContextMenuItem onClick={() => onLock(node.id)}>
            <Lock className="w-4 h-4 mr-2" />
            Lock
          </ContextMenuItem>
        )}

        <ContextMenuItem onClick={onGroup}>
          <Group className="w-4 h-4 mr-2" />
          Group Selected
          <span className="ml-auto text-xs text-muted-foreground">⌘G</span>
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}

interface EdgeContextMenuProps {
  children: React.ReactNode;
  edge: Edge;
  onDelete: (edgeId: string) => void;
  onEditStyle: (edgeId: string) => void;
  onEditLabel: (edgeId: string) => void;
}

export function EdgeContextMenu({
  children,
  edge,
  onDelete,
  onEditStyle,
  onEditLabel,
}: EdgeContextMenuProps) {
  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        {children}
      </ContextMenuTrigger>
      <ContextMenuContent className="w-56">
        <ContextMenuItem onClick={() => onEditLabel(edge.id)}>
          <Edit className="w-4 h-4 mr-2" />
          Edit Label
        </ContextMenuItem>
        <ContextMenuItem onClick={() => onEditStyle(edge.id)}>
          <Palette className="w-4 h-4 mr-2" />
          Edit Style
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem onClick={() => onDelete(edge.id)}>
          <Trash2 className="w-4 h-4 mr-2" />
          Delete
          <span className="ml-auto text-xs text-muted-foreground">Del</span>
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}

interface CanvasContextMenuProps {
  children: React.ReactNode;
  onPaste: (position: { x: number; y: number }) => void;
  onSelectAll: () => void;
  onAddText: (position: { x: number; y: number }) => void;
  onAddNode: (type: string, position: { x: number; y: number }) => void;
}

export function CanvasContextMenu({
  children,
  onPaste,
  onSelectAll,
  onAddText,
  onAddNode,
}: CanvasContextMenuProps) {
  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        {children}
      </ContextMenuTrigger>
      <ContextMenuContent className="w-56">
        <ContextMenuItem onClick={() => onPaste({ x: 0, y: 0 })}>
          <Copy className="w-4 h-4 mr-2" />
          Paste
          <span className="ml-auto text-xs text-muted-foreground">⌘V</span>
        </ContextMenuItem>
        <ContextMenuItem onClick={onSelectAll}>
          Select All
          <span className="ml-auto text-xs text-muted-foreground">⌘A</span>
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuSub>
          <ContextMenuSubTrigger>Add Node</ContextMenuSubTrigger>
          <ContextMenuSubContent>
            <ContextMenuItem onClick={() => onAddNode('rect', { x: 0, y: 0 })}>
              Rectangle
            </ContextMenuItem>
            <ContextMenuItem onClick={() => onAddNode('circle', { x: 0, y: 0 })}>
              Circle
            </ContextMenuItem>
            <ContextMenuItem onClick={() => onAddNode('database', { x: 0, y: 0 })}>
              Database
            </ContextMenuItem>
            <ContextMenuItem onClick={() => onAddNode('decision', { x: 0, y: 0 })}>
              Decision
            </ContextMenuItem>
            <ContextMenuSeparator />
            <ContextMenuItem onClick={() => onAddText({ x: 0, y: 0 })}>
              <Edit className="w-4 h-4 mr-2" />
              Text
            </ContextMenuItem>
          </ContextMenuSubContent>
        </ContextMenuSub>
      </ContextMenuContent>
    </ContextMenu>
  );
}
