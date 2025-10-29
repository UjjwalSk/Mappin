import { memo, useState, useRef, useEffect, useCallback } from 'react';
import { NodeResizer, type NodeProps, useReactFlow } from '@xyflow/react';

function TextNode({ data, selected, id }: NodeProps) {
  const { setNodes } = useReactFlow();
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState((data as any).label || 'Double-click to edit');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const nodeColor = (data as any).color || 'hsl(var(--card))';
  const fontSize = (data as any).fontSize || 16;
  const fontWeight = (data as any).fontWeight || '400';
  const textColor = (data as any).textColor || 'hsl(var(--foreground))';
  const backgroundColor = 'transparent';
  const textAlign = (data as any).textAlign || 'left';
  const fontStyle = (data as any).fontStyle || 'normal';
  const textDecoration = (data as any).textDecoration || 'none';
  const showShadow = (data as any).showShadow || false;

  const width = (data as any).width || 200;
  const height = (data as any).height || 60;

  // Handle resize event - update node data with new dimensions
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

  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.select();
    }
  }, [isEditing]);

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const handleBlur = () => {
    setIsEditing(false);
    // Update node data
    if ((data as any).onLabelChange) {
      (data as any).onLabelChange(id, text);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsEditing(false);
      setText((data as any).label || text);
    }
  };

  return (
    <div
      className="relative border-0 rounded"
      style={{
        width,
        height,
        backgroundColor,
      }}
      data-testid="text-node"
    >
      <NodeResizer
        isVisible={selected}
        minWidth={100}
        minHeight={40}
        color="hsl(var(--primary))"
        handleStyle={{
          width: 8,
          height: 8,
          borderRadius: '50%',
        }}
        onResize={handleResize}
      />

      {/* Draggable border area - top */}
      <div className="absolute top-0 left-0 right-0 h-2 cursor-move" />

      {/* Draggable border area - bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-2 cursor-move" />

      {/* Draggable border area - left */}
      <div className="absolute left-0 top-0 bottom-0 w-2 cursor-move" />

      {/* Draggable border area - right */}
      <div className="absolute right-0 top-0 bottom-0 w-2 cursor-move" />

      {isEditing ? (
        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          className="w-full h-full p-2 bg-transparent border-none outline-none resize-none nodrag"
          style={{
            fontSize: `${fontSize}px`,
            fontWeight,
            color: textColor,
            textAlign: textAlign as any,
            fontStyle,
            textDecoration,
            overflowWrap: 'break-word',
            wordWrap: 'break-word',
            wordBreak: 'break-word',
            whiteSpace: 'pre-wrap',
            backgroundColor: nodeColor,
            boxShadow: showShadow ? '0 10px 15px -3px rgb(0 0 0 / 0.3)' : (selected ? '0 10px 15px -3px rgb(0 0 0 / 0.3)' : 'none')
          }}
        />
      ) : (
        <div
          className="w-full h-full p-2 cursor-text overflow-auto nodrag"
          onDoubleClick={handleDoubleClick}
          style={{
            fontSize: `${fontSize}px`,
            fontWeight,
            color: textColor,
            textAlign: textAlign as any,
            fontStyle,
            textDecoration,
            overflowWrap: 'break-word',
            wordWrap: 'break-word',
            wordBreak: 'break-word',
            whiteSpace: 'pre-wrap',
            backgroundColor: nodeColor,
            boxShadow: showShadow ? '0 10px 15px -3px rgb(0 0 0 / 0.3)' : (selected ? '0 10px 15px -3px rgb(0 0 0 / 0.3)' : 'none')
          }}
        >
          {text || 'Double-click to edit'}
        </div>
      )}

      {selected && !isEditing && (
        <div className="absolute -bottom-6 left-0 text-xs text-muted-foreground">
          Double-click to edit
        </div>
      )}
    </div>
  );
}

export default memo(TextNode);
