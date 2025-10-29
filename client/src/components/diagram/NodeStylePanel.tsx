import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { X, Paintbrush, Type, Box as BoxIcon } from 'lucide-react';
import type { NodeType, IconType } from '@shared/schema';

interface NodeStylePanelProps {
  selectedNodeIds: string[];
  nodes: any[];
  onUpdateNode: (id: string, data: any) => void;
  onClose: () => void;
}

const colorPresets = [
  { name: 'Default', value: 'hsl(var(--card))' },
  { name: 'Blue', value: '#3b82f6' },
  { name: 'Purple', value: '#8b5cf6' },
  { name: 'Green', value: '#22c55e' },
  { name: 'Red', value: '#ef4444' },
  { name: 'Orange', value: '#f97316' },
  { name: 'Pink', value: '#ec4899' },
  { name: 'Yellow', value: '#eab308' },
  { name: 'Gray', value: '#6b7280' },
];

export default function NodeStylePanel({
  selectedNodeIds,
  nodes,
  onUpdateNode,
  onClose,
}: NodeStylePanelProps) {
  const [selectedColor, setSelectedColor] = useState('hsl(var(--card))');
  const [borderColor, setBorderColor] = useState('rgb(139, 92, 246)');
  const [customColor, setCustomColor] = useState('#3b82f6');
  const [fontSize, setFontSize] = useState(14);
  const [fontWeight, setFontWeight] = useState('normal');
  const [textColor, setTextColor] = useState('hsl(var(--card-foreground))');
  const [borderWidth, setBorderWidth] = useState(2);
  const [showShadow, setShowShadow] = useState(false);

  const selectedNode = selectedNodeIds.length === 1
    ? nodes.find(n => n.id === selectedNodeIds[0])
    : null;

  const isGroupNode = selectedNode?.type === 'group';

  useEffect(() => {
    if (selectedNode) {
      if (isGroupNode) {
        setSelectedColor(selectedNode.data.backgroundColor || 'rgba(139, 92, 246, 0.1)');
        setBorderColor(selectedNode.data.borderColor || 'rgb(139, 92, 246)');
        setFontSize(selectedNode.data.fontSize || 11);
        setFontWeight(selectedNode.data.fontWeight || 700);
        setTextColor(selectedNode.data.textColor || 'hsl(var(--card-foreground))');
        setBorderWidth(selectedNode.data.borderWidth || 2);
      } else {
        setSelectedColor(selectedNode.data.color || 'hsl(var(--card))');
        setFontSize(selectedNode.data.fontSize || 14);
        setFontWeight(selectedNode.data.fontWeight || 'normal');
        setTextColor(selectedNode.data.textColor || 'hsl(var(--card-foreground))');
        setBorderWidth(selectedNode.data.borderWidth || 2);
        setShowShadow(selectedNode.data.showShadow || false);
      }
    }
  }, [selectedNode, isGroupNode]);

  const handleColorChange = (color: string) => {
    setSelectedColor(color);
    selectedNodeIds.forEach(id => {
      const node = nodes.find(n => n.id === id);
      if (node?.type === 'group') {
        onUpdateNode(id, { backgroundColor: color });
      } else {
        onUpdateNode(id, { color });
      }
    });
  };

  const handleBorderColorChange = (color: string) => {
    setBorderColor(color);
    selectedNodeIds.forEach(id => {
      onUpdateNode(id, { borderColor: color });
    });
  };

  const handleCustomColorChange = (color: string) => {
    setCustomColor(color);
    handleColorChange(color);
  };

  const handleFontSizeChange = (value: number[]) => {
    const size = value[0];
    setFontSize(size);
    selectedNodeIds.forEach(id => {
      onUpdateNode(id, { fontSize: size });
    });
  };

  const handleFontWeightChange = (weight: string) => {
    setFontWeight(weight);
    selectedNodeIds.forEach(id => {
      onUpdateNode(id, { fontWeight: weight });
    });
  };

  const handleTextColorChange = (color: string) => {
    setTextColor(color);
    selectedNodeIds.forEach(id => {
      onUpdateNode(id, { textColor: color });
    });
  };

  const handleBorderWidthChange = (value: number[]) => {
    const width = value[0];
    setBorderWidth(width);
    selectedNodeIds.forEach(id => {
      onUpdateNode(id, { borderWidth: width });
    });
  };

  const handleShadowToggle = (checked: boolean) => {
    setShowShadow(checked);
    selectedNodeIds.forEach(id => {
      onUpdateNode(id, { showShadow: checked });
    });
  };

  if (selectedNodeIds.length === 0) {
    return (
      <div className="w-80 border-l border-border bg-background h-full flex flex-col">
        <div className="p-4 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Paintbrush className="w-5 h-5 text-primary" />
            <h3 className="text-base font-semibold">Style Panel</h3>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>
        <div className="flex-1 flex items-center justify-center p-8 text-center">
          <div className="space-y-2">
            <Paintbrush className="w-12 h-12 mx-auto text-muted-foreground opacity-50" />
            <p className="text-sm text-muted-foreground">
              Select a node to edit its style
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-80 border-l border-border bg-background h-full flex flex-col">
      <div className="p-4 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Paintbrush className="w-5 h-5 text-primary" />
          <h3 className="text-base font-semibold">Style Panel</h3>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="w-4 h-4" />
        </Button>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-6">
          {/* Node Info */}
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">
              {selectedNodeIds.length === 1
                ? `Editing: ${selectedNode?.data.label || 'Node'}`
                : `Editing ${selectedNodeIds.length} nodes`}
            </Label>
          </div>

          <Separator />

          {/* Color Presets */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Paintbrush className="w-4 h-4" />
              <Label className="text-sm font-medium">
                {isGroupNode ? 'Container Color' : 'Node Color'}
              </Label>
            </div>
            <div className="grid grid-cols-5 gap-2">
              <button
                key={'transparent'}
                onClick={() => handleColorChange('transparent')}
                className={`h-10 rounded-md border-2 transition-all hover:scale-110 ${
                  selectedColor === 'transparent' ? 'border-primary ring-2 ring-primary ring-offset-2' : 'border-border'
                }`}
                style={{ background: 'linear-gradient(to bottom right, transparent 49%, red 50%, transparent 51%)' }}
                title={'Transparent'}
              />
              {colorPresets.map((preset) => (
                <button
                  key={preset.value}
                  onClick={() => handleColorChange(preset.value)}
                  className={`h-10 rounded-md border-2 transition-all hover:scale-110 ${
                    selectedColor === preset.value ? 'border-primary ring-2 ring-primary ring-offset-2' : 'border-border'
                  }`}
                  style={{ backgroundColor: preset.value }}
                  title={preset.name}
                />
              ))}
            </div>

            {/* Custom Color Picker */}
            <div className="flex items-center gap-2">
              <Label className="text-xs">Custom:</Label>
              <input
                type="color"
                value={customColor}
                onChange={(e) => handleCustomColorChange(e.target.value)}
                className="w-12 h-10 rounded cursor-pointer border-2 border-border"
              />
              <Input
                type="text"
                value={customColor}
                onChange={(e) => handleCustomColorChange(e.target.value)}
                className="flex-1 h-10 text-xs font-mono"
                placeholder="#3b82f6"
              />
            </div>

            {isGroupNode && (
              <>
                <Label className="text-xs font-medium mt-3">Border Color</Label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={borderColor}
                    onChange={(e) => handleBorderColorChange(e.target.value)}
                    className="w-12 h-10 rounded cursor-pointer border-2 border-border"
                  />
                  <Input
                    type="text"
                    value={borderColor}
                    onChange={(e) => handleBorderColorChange(e.target.value)}
                    className="flex-1 h-10 text-xs font-mono"
                    placeholder="rgb(139, 92, 246)"
                  />
                </div>
              </>
            )}
          </div>

          <Separator />

          {/* Typography */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Type className="w-4 h-4" />
              <Label className="text-sm font-medium">Typography</Label>
            </div>

            <div className="space-y-2">
              <Label className="text-xs">Font Size: {fontSize}px</Label>
              <Slider
                value={[fontSize]}
                onValueChange={handleFontSizeChange}
                min={10}
                max={32}
                step={1}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs">Font Weight</Label>
              <Select value={fontWeight} onValueChange={handleFontWeightChange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="500">Medium</SelectItem>
                  <SelectItem value="600">Semi Bold</SelectItem>
                  <SelectItem value="bold">Bold</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-xs">Text Color</Label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={textColor.startsWith('#') ? textColor : '#000000'}
                  onChange={(e) => handleTextColorChange(e.target.value)}
                  className="w-12 h-10 rounded cursor-pointer border-2 border-border"
                />
                <Input
                  type="text"
                  value={textColor}
                  onChange={(e) => handleTextColorChange(e.target.value)}
                  className="flex-1 h-10 text-xs font-mono"
                  placeholder="hsl(var(--card-foreground))"
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Border & Effects */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <BoxIcon className="w-4 h-4" />
              <Label className="text-sm font-medium">Border & Effects</Label>
            </div>

            <div className="space-y-2">
              <Label className="text-xs">Border Width: {borderWidth}px</Label>
              <Slider
                value={[borderWidth]}
                onValueChange={handleBorderWidthChange}
                min={0}
                max={8}
                step={1}
                className="w-full"
              />
            </div>

            <div className="flex items-center justify-between">
              <Label className="text-xs">Drop Shadow</Label>
              <Switch
                checked={showShadow}
                onCheckedChange={handleShadowToggle}
              />
            </div>
          </div>

          <Separator />

          {/* Actions */}
          <div className="space-y-2">
            <Button
              variant="outline"
              className="w-full"
              onClick={() => {
                selectedNodeIds.forEach(id => {
                  onUpdateNode(id, {
                    color: 'hsl(var(--card))',
                    fontSize: 14,
                    fontWeight: 'normal',
                    textColor: 'hsl(var(--card-foreground))',
                    borderWidth: 2,
                    showShadow: false,
                  });
                });
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
