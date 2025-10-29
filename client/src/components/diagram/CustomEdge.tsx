import { memo } from 'react';
import {
  BaseEdge,
  EdgeLabelRenderer,
  getSmoothStepPath,
  getStraightPath,
  getBezierPath,
  type EdgeProps,
} from '@xyflow/react';

export type EdgeLineType = 'straight' | 'smoothstep' | 'bezier' | 'step';
export type EdgeArrowType = 'arrow' | 'arrowclosed' | 'diamond' | 'circle' | 'none';
export type EdgeDashType = 'solid' | 'dashed' | 'dotted' | 'dashdot';

function CustomEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  data,
  markerEnd,
  selected,
}: EdgeProps) {
  const lineType = (data?.lineType as EdgeLineType) || 'smoothstep';
  const strokeColor = (data?.strokeColor as string) || '#b1b1b7';
  const strokeWidth = (data?.strokeWidth as number) || 2;
  const animated = (data?.animated as boolean) || false;
  const label = (data?.label as string) || '';
  const dashType = (data?.dashType as EdgeDashType) || 'solid';
  const labelBgColor = (data?.labelBgColor as string) || 'hsl(var(--card))';
  const labelColor = (data?.labelColor as string) || 'hsl(var(--foreground))';
  const labelFontSize = (data?.labelFontSize as number) || 11;
  const labelFontWeight = (data?.labelFontWeight as string) || '600';
  const arrowType = (data?.arrowType as EdgeArrowType) || 'none';

  // Generate unique marker ID for this edge
  const markerId = `${arrowType}-${id}`;

  // Get path based on line type
  let edgePath, labelX, labelY;
  if (lineType === 'straight') {
    [edgePath, labelX, labelY] = getStraightPath({
      sourceX,
      sourceY,
      targetX,
      targetY,
    });
  } else if (lineType === 'bezier') {
    [edgePath, labelX, labelY] = getBezierPath({
      sourceX,
      sourceY,
      sourcePosition,
      targetX,
      targetY,
      targetPosition,
    });
  } else {
    [edgePath, labelX, labelY] = getSmoothStepPath({
      sourceX,
      sourceY,
      sourcePosition,
      targetX,
      targetY,
      targetPosition,
    });
  }

  const getDashArray = () => {
    switch (dashType) {
      case 'dashed':
        return '8,4';
      case 'dotted':
        return '2,4';
      case 'dashdot':
        return '8,4,2,4';
      default:
        return 'none';
    }
  };

  const edgeStyle = {
    ...style,
    stroke: strokeColor,
    strokeWidth: selected ? strokeWidth + 1 : strokeWidth,
    strokeDasharray: getDashArray(),
  };

  return (
    <>
      <defs>
        {arrowType !== 'none' && (
          <>
            {arrowType === 'arrow' && (
              <marker
                id={markerId}
                markerWidth="8"
                markerHeight="8"
                refX="7"
                refY="3"
                orient="auto"
                markerUnits="userSpaceOnUse"
              >
                <path d="M0,0 L0,6 L6,3 z" fill={strokeColor} />
              </marker>
            )}
            {arrowType === 'arrowclosed' && (
              <marker
                id={markerId}
                markerWidth="8"
                markerHeight="8"
                refX="7"
                refY="3"
                orient="auto"
                markerUnits="userSpaceOnUse"
              >
                <path d="M0,0 L0,6 L6,3 z" fill={strokeColor} stroke={strokeColor} />
              </marker>
            )}
            {arrowType === 'diamond' && (
              <marker
                id={markerId}
                markerWidth="10"
                markerHeight="10"
                refX="8"
                refY="5"
                orient="auto"
                markerUnits="userSpaceOnUse"
              >
                <path d="M0,5 L5,0 L10,5 L5,10 z" fill={strokeColor} />
              </marker>
            )}
            {arrowType === 'circle' && (
              <marker
                id={markerId}
                markerWidth="8"
                markerHeight="8"
                refX="7"
                refY="4"
                orient="auto"
                markerUnits="userSpaceOnUse"
              >
                <circle cx="4" cy="4" r="2.5" fill={strokeColor} />
              </marker>
            )}
          </>
        )}
      </defs>
      <BaseEdge
        path={edgePath}
        markerEnd={arrowType !== 'none' ? `url(#${markerId})` : undefined}
        style={edgeStyle}
        interactionWidth={20}
      />
      {animated && (
        <path
          d={edgePath}
          fill="none"
          stroke={strokeColor}
          strokeWidth={strokeWidth * 0.7}
          strokeDasharray="5,8"
          strokeOpacity="0.4"
          style={{
            strokeDashoffset: 0,
            animation: 'dashdraw 3s linear infinite',
            pointerEvents: 'none',
          }}
        />
      )}
      {label && (
        <EdgeLabelRenderer>
          <div
            style={{
              position: 'absolute',
              transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
              fontSize: labelFontSize,
              fontWeight: labelFontWeight,
              pointerEvents: 'all',
              zIndex: 1000,
            }}
            className="nodrag nopan"
          >
            <div
              style={{
                padding: `${labelFontSize * 0.25}px ${labelFontSize * 0.7}px`,
                borderRadius: '6px',
                backgroundColor: labelBgColor,
                border: `1.5px solid ${strokeColor}`,
                color: labelColor,
                boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
                whiteSpace: 'nowrap',
                minWidth: 'max-content',
              }}
            >
              {label}
            </div>
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  );
}

export default memo(CustomEdge);
