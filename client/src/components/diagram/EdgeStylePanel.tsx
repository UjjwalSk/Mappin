import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Slider } from '@/components/ui/slider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { X, Minus, Workflow, Zap, ArrowRight, CircleDot, Palette, Type as TypeIcon } from 'lucide-react';
import type { Edge } from '@xyflow/react';
import type { EdgeLineType, EdgeArrowType, EdgeDashType } from './CustomEdge';

interface EdgeStylePanelProps {
  selectedEdgeIds: string[];
  edges: Edge[];
  onUpdateEdge: (edgeId: string, data: any) => void;
  onClose: () => void;
}

export default function EdgeStylePanel({
  selectedEdgeIds,
  edges,
  onUpdateEdge,
  onClose,
}: EdgeStylePanelProps) {
  const selectedEdge = edges.find(e => selectedEdgeIds.includes(e.id));

  const [lineType, setLineType] = useState<EdgeLineType>('smoothstep');
  const [strokeColor, setStrokeColor] = useState('#b1b1b7');
  const [strokeWidth, setStrokeWidth] = useState(2);
  const [dashType, setDashType] = useState<EdgeDashType>('solid');
  const [label, setLabel] = useState('');
  const [labelColor, setLabelColor] = useState('hsl(var(--foreground))');
  const [labelBgColor, setLabelBgColor] = useState('hsl(var(--card))');
  const [labelFontSize, setLabelFontSize] = useState(11);
  const [labelFontWeight, setLabelFontWeight] = useState('600');
  const [arrowType, setArrowType] = useState<EdgeArrowType>('none');

  // Load edge data when selection changes
  useEffect(() => {
    if (selectedEdge?.id) {
      const data = selectedEdge.data || {};
      setLineType((data.lineType as EdgeLineType) || 'smoothstep');
      setStrokeColor((data.strokeColor as string) || '#b1b1b7');
      setStrokeWidth((data.strokeWidth as number) || 2);
      setDashType((data.dashType as EdgeDashType) || 'solid');
      setLabel((data.label as string) || '');
      setLabelColor((data.labelColor as string) || 'hsl(var(--foreground))');
      setLabelBgColor((data.labelBgColor as string) || 'hsl(var(--card))');
      setLabelFontSize((data.labelFontSize as number) || 11);
      setLabelFontWeight((data.labelFontWeight as string) || '600');
      setArrowType((data.arrowType as EdgeArrowType) || 'none');
    }
  }, [selectedEdge?.id]); // Only depend on the edge ID change

  const applyToSelected = () => {
    selectedEdgeIds.forEach(edgeId => {
      onUpdateEdge(edgeId, {
        lineType,
        strokeColor,
        strokeWidth,
        animated: false,
        dashType,
        label,
        labelColor,
        labelBgColor,
        labelFontSize,
        labelFontWeight,
        arrowType,
      });
    });
  };

  useEffect(() => {
    applyToSelected();
  }, [lineType, strokeColor, strokeWidth, dashType, label, labelColor, labelBgColor, labelFontSize, labelFontWeight, arrowType]);

  if (selectedEdgeIds.length === 0) {
    return (
      <div className="w-80 border-l border-border bg-background h-full flex flex-col">
        <div className="p-4 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ArrowRight className="w-5 h-5 text-primary" />
            <h3 className="text-base font-semibold">Edge Style</h3>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>
        <div className="flex-1 flex items-center justify-center p-8 text-center">
          <div className="space-y-2">
            <ArrowRight className="w-12 h-12 mx-auto text-muted-foreground opacity-50" />
            <p className="text-sm text-muted-foreground">
              Select an edge to edit its style
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-80 border-l border-border bg-background h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ArrowRight className="w-5 h-5 text-primary" />
          <h3 className="text-base font-semibold">Edge Style</h3>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6"
          onClick={onClose}
        >
          <X className="w-4 h-4" />
        </Button>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-6">
          {/* Edge Info */}
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">
              {selectedEdgeIds.length === 1
                ? `Editing: ${label || 'Connection'}`
                : `Editing ${selectedEdgeIds.length} edges`}
            </Label>
          </div>

          <Separator />

          {/* Line Type */}
          <div className="space-y-3">
            <Label className="text-sm font-medium flex items-center gap-2">
              <Workflow className="w-4 h-4" />
              Line Type
            </Label>
            <div className="grid grid-cols-3 gap-2">
              <Button
                variant={lineType === 'straight' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setLineType('straight')}
                className="h-16 flex-col gap-1.5"
              >
                <Minus className="w-4 h-4" />
                <span className="text-xs">Straight</span>
              </Button>
              <Button
                variant={lineType === 'smoothstep' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setLineType('smoothstep')}
                className="h-16 flex-col gap-1.5"
              >
                <Workflow className="w-4 h-4" />
                <span className="text-xs">Step</span>
              </Button>
              <Button
                variant={lineType === 'bezier' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setLineType('bezier')}
                className="h-16 flex-col gap-1.5"
              >
                <Zap className="w-4 h-4" />
                <span className="text-xs">Curved</span>
              </Button>
            </div>
          </div>

          <Separator />

          {/* Arrow Type */}
          <div className="space-y-3">
            <Label className="text-sm font-medium flex items-center gap-2">
              <ArrowRight className="w-4 h-4" />
              Arrow Style
            </Label>
            <Select value={arrowType} onValueChange={(v) => setArrowType(v as EdgeArrowType)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="arrow">→ Arrow</SelectItem>
                <SelectItem value="arrowclosed">➤ Closed Arrow</SelectItem>
                <SelectItem value="diamond">◆ Diamond</SelectItem>
                <SelectItem value="circle">● Circle</SelectItem>
                <SelectItem value="none">— None</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Separator />

          {/* Stroke Color */}
          <div className="space-y-3">
            <Label className="text-sm font-medium flex items-center gap-2">
              <Palette className="w-4 h-4" />
              Line Color
            </Label>
            <div className="flex gap-2">
              <Input
                type="color"
                value={strokeColor}
                onChange={(e) => setStrokeColor(e.target.value)}
                className="w-16 h-9 p-1 cursor-pointer"
              />
              <Input
                type="text"
                value={strokeColor}
                onChange={(e) => setStrokeColor(e.target.value)}
                className="flex-1"
                placeholder="#b1b1b7"
              />
            </div>

            {/* Preset Colors */}
            <div className="grid grid-cols-5 gap-2">
              {[
                '#b1b1b7', // Default gray
                '#3b82f6', // Blue
                '#10b981', // Green
                '#f59e0b', // Orange
                '#ef4444', // Red
                '#8b5cf6', // Purple
                '#06b6d4', // Cyan
                '#ec4899', // Pink
                '#eab308', // Yellow
                '#6b7280', // Slate
              ].map(color => (
                <button
                  key={color}
                  onClick={() => setStrokeColor(color)}
                  className={`h-10 rounded-md border-2 transition-all hover:scale-110 ${
                    strokeColor === color ? 'border-primary ring-2 ring-primary ring-offset-2' : 'border-border'
                  }`}
                  style={{ backgroundColor: color }}
                  title={color}
                />
              ))}
            </div>
          </div>

          <Separator />

          {/* Stroke Width */}
          <div className="space-y-3">
            <Label className="text-xs">Line Width: {strokeWidth}px</Label>
            <Slider
              value={[strokeWidth]}
              onValueChange={(v) => setStrokeWidth(v[0])}
              min={1}
              max={10}
              step={1}
              className="w-full"
            />
            {/* Quick presets */}
            <div className="flex gap-2">
              {[1, 2, 3, 4, 6].map(width => (
                <Button
                  key={width}
                  variant={strokeWidth === width ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setStrokeWidth(width)}
                  className="flex-1 text-xs h-8"
                >
                  {width}px
                </Button>
              ))}
            </div>
          </div>

          <Separator />

          {/* Dash Pattern */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Line Style</Label>
            <Select value={dashType} onValueChange={(v) => setDashType(v as EdgeDashType)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="solid">━━━━ Solid</SelectItem>
                <SelectItem value="dashed">╌╌╌╌ Dashed</SelectItem>
                <SelectItem value="dotted">┈┈┈┈ Dotted</SelectItem>
                <SelectItem value="dashdot">╍╍╍╍ Dash-Dot</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Separator />

          {/* Label */}
          <div className="space-y-3">
            <Label className="text-sm font-medium flex items-center gap-2">
              <TypeIcon className="w-4 h-4" />
              Label
            </Label>
            <Input
              type="text"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="Enter label text..."
            />
          </div>

          {label && (
            <>
              <Separator />

              {/* Label Typography */}
              <div className="space-y-4">
                <Label className="text-sm font-medium">Label Typography</Label>

                <div className="space-y-2">
                  <Label className="text-xs">Font Size: {labelFontSize}px</Label>
                  <Slider
                    value={[labelFontSize]}
                    onValueChange={(v) => setLabelFontSize(v[0])}
                    min={8}
                    max={20}
                    step={1}
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-xs">Font Weight</Label>
                  <Select value={labelFontWeight} onValueChange={setLabelFontWeight}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="400">Normal</SelectItem>
                      <SelectItem value="500">Medium</SelectItem>
                      <SelectItem value="600">Semi Bold</SelectItem>
                      <SelectItem value="700">Bold</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs">Text Color</Label>
                  <div className="flex gap-2">
                    <Input
                      type="color"
                      value={labelColor.startsWith('#') ? labelColor : '#000000'}
                      onChange={(e) => setLabelColor(e.target.value)}
                      className="w-12 h-9 p-1 cursor-pointer"
                    />
                    <Input
                      type="text"
                      value={labelColor}
                      onChange={(e) => setLabelColor(e.target.value)}
                      className="flex-1 text-xs"
                      placeholder="Text color"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs">Background Color</Label>
                  <div className="flex gap-2">
                    <Input
                      type="color"
                      value={labelBgColor.startsWith('#') ? labelBgColor : '#ffffff'}
                      onChange={(e) => setLabelBgColor(e.target.value)}
                      className="w-12 h-9 p-1 cursor-pointer"
                    />
                    <Input
                      type="text"
                      value={labelBgColor}
                      onChange={(e) => setLabelBgColor(e.target.value)}
                      className="flex-1 text-xs"
                      placeholder="Background color"
                    />
                  </div>
                </div>
              </div>
            </>
          )}

          <Separator />

          {/* Reset Button */}
          <div className="space-y-2">
            <Button
              variant="outline"
              className="w-full"
              onClick={() => {
                setLineType('smoothstep');
                setStrokeColor('#b1b1b7');
                setStrokeWidth(2);
                setDashType('solid');
                setArrowType('none');
                setLabelFontSize(11);
                setLabelFontWeight('600');
              }}
            >
              Reset to Default
            </Button>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
