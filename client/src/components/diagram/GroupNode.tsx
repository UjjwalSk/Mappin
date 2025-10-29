import { memo, useState } from 'react';
import { Handle, Position, type NodeProps, NodeResizer } from '@xyflow/react';
import { Pencil } from 'lucide-react';

// Dummy onLabelChange to satisfy the type
const onLabelChange = (_label: string) => {};

// GroupNode - Container/box that groups multiple nodes
// Similar to "TESTING TYPES", "INTEGRATION LAYER" in reference image
function GroupNode({ data, selected }: NodeProps) {
  const [isEditingLabel, setIsEditingLabel] = useState(false);
  const [label, setLabel] = useState((data as any).label || 'Group');

  const backgroundColor = (data as any).backgroundColor || 'rgba(139, 92, 246, 0.1)';
  const borderColor = (data as any).borderColor || 'rgb(139, 92, 246)';
  const width = (data as any).width || 300;
  const height = (data as any).height || 200;
  const fontSize = (data as any).fontSize || 11;
  const fontWeight = (data as any).fontWeight || 700;
  const borderWidth = (data as any).borderWidth || 2;

  const handleLabelSave = () => {
    setIsEditingLabel(false);
    if ((data as any).onLabelChange) {
      (data as any).onLabelChange(label);
    }
  };

  return (
    <>
      <NodeResizer
        isVisible={selected}
        minWidth={200}
        minHeight={150}
        handleStyle={{
          width: 10,
          height: 10,
          borderRadius: '50%',
          backgroundColor: borderColor,
          border: '2px solid white',
        }}
      />
      <div
        className="group-node"
        style={{
          width: '100%',
          height: '100%',
          backgroundColor,
          border: `${borderWidth}px solid ${borderColor}`,
          borderRadius: '16px',
          padding: 0,
          position: 'relative',
          boxShadow: selected ? '0 4px 12px rgba(0,0,0,0.2)' : '0 2px 6px rgba(0,0,0,0.1)',
          transition: 'all 0.2s ease',
          pointerEvents: 'all',
        }}
        data-testid={`group-${label.toLowerCase().replace(/\s+/g, '-')}`}
      >
        {/* Group Label Header */}
        <div
          style={{
            position: 'absolute',
            top: '16px',
            left: '16px',
            padding: '6px 16px',
            backgroundColor: borderColor,
            borderRadius: '8px',
            color: 'white',
            fontSize: `${fontSize}px`,
            fontWeight,
            textTransform: 'uppercase',
            letterSpacing: '1px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            whiteSpace: 'nowrap',
            cursor: 'pointer',
          }}
          onClick={() => setIsEditingLabel(true)}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
            <line x1="9" y1="3" x2="9" y2="21" />
          </svg>
          {isEditingLabel ? (
            <input
              type="text"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              onBlur={handleLabelSave}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleLabelSave();
                if (e.key === 'Escape') {
                  setIsEditingLabel(false);
                  setLabel((data as any).label || 'Group');
                }
              }}
              autoFocus
              style={{
                background: 'transparent',
                border: 'none',
                outline: 'none',
                color: 'white',
                fontSize: `${fontSize}px`,
                fontWeight,
                textTransform: 'uppercase',
                letterSpacing: '1px',
                width: '120px',
              }}
            />
          ) : (
            <>
              {label}
              <Pencil size={10} style={{ opacity: selected ? 1 : 0 }} />
            </>
          )}
        </div>

        {/* Container area for child nodes */}
        <div
          style={{
            width: '100%',
            height: '100%',
            paddingTop: '40px',
          }}
        />

        {/* Handles for connections */}
        <Handle
          type="target"
          position={Position.Top}
          className="w-3 h-3 rounded-full bg-primary border-2 border-background opacity-0 group-hover:opacity-100 transition-opacity"
        />
        <Handle
          type="source"
          position={Position.Bottom}
          className="w-3 h-3 rounded-full bg-primary border-2 border-background opacity-0 group-hover:opacity-100 transition-opacity"
        />
      </div>
    </>
  );
}

export default memo(GroupNode);
