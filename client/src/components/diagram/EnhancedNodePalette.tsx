import { useState, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Search, X, Workflow, Cloud, Component, Globe, SwatchBook, Router } from 'lucide-react';
import {
  allIcons,
  awsIcons,
  azureIcons,
  gcpIcons,
  genericIcons,
  networkIcons,
  searchIcons,
  type IconDefinition,
} from '@/lib/iconLibraries';
import type { NodeType, IconType } from '@shared/schema';

interface EnhancedNodePaletteProps {
  onAddNode: (type: NodeType, icon: IconType, label: string, iconId?: string) => void;
}

const SHAPE_CATEGORIES = [
  {
    name: 'Basic Shapes',
    shapes: [
      { type: 'rect' as NodeType, icon: 'none' as IconType, label: 'Rectangle', preview: '▭' },
      { type: 'rounded' as NodeType, icon: 'none' as IconType, label: 'Rounded', preview: '▢' },
      { type: 'circle' as NodeType, icon: 'none' as IconType, label: 'Circle', preview: '●' },
      { type: 'text' as NodeType, icon: 'none' as IconType, label: 'Text', preview: 'T' },
    ],
  },
  {
    name: 'Flowchart',
    shapes: [
      { type: 'rect' as NodeType, icon: 'none' as IconType, label: 'Process', preview: '▭' },
      { type: 'decision' as NodeType, icon: 'none' as IconType, label: 'Decision', preview: '◆' },
      { type: 'circle' as NodeType, icon: 'none' as IconType, label: 'Start/End', preview: '●' },
    ],
  },
  {
    name: 'Infrastructure',
    shapes: [
      { type: 'database' as NodeType, icon: 'database' as IconType, label: 'Database', preview: '⬮' },
      { type: 'cloud' as NodeType, icon: 'cloud' as IconType, label: 'Cloud', preview: '☁' },
      { type: 'queue' as NodeType, icon: 'queue' as IconType, label: 'Queue', preview: '▭' },
      { type: 'storage' as NodeType, icon: 'storage' as IconType, label: 'Storage', preview: '▭' },
    ],
  },
];

function groupIconsByCategory(icons: IconDefinition[]): Record<string, IconDefinition[]> {
  return icons.reduce((acc, icon) => {
    const category = icon.category;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(icon);
    return acc;
  }, {} as Record<string, IconDefinition[]>);
}

export default function EnhancedNodePalette({ onAddNode }: EnhancedNodePaletteProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTab, setSelectedTab] = useState('shapes');

  const filteredIcons = useMemo(() => {
    if (!searchQuery) return allIcons;
    return searchIcons(searchQuery);
  }, [searchQuery]);

  const awsGrouped = useMemo(() => groupIconsByCategory(awsIcons), []);
  const azureGrouped = useMemo(() => groupIconsByCategory(azureIcons), []);
  const gcpGrouped = useMemo(() => groupIconsByCategory(gcpIcons), []);
  const genericGrouped = useMemo(() => groupIconsByCategory(genericIcons), []);
  const networkGrouped = useMemo(() => groupIconsByCategory(networkIcons), []);
  const filteredGrouped = useMemo(() => groupIconsByCategory(filteredIcons), [filteredIcons]);

  const handleIconClick = (icon: IconDefinition) => {
    onAddNode('rect', 'none', icon.name, icon.id);
  };

  const handleShapeClick = (shape: typeof SHAPE_CATEGORIES[0]['shapes'][0]) => {
    onAddNode(shape.type, shape.icon, shape.label);
  };

  const renderIconGrid = (icons: IconDefinition[]) => (
    <div className="grid grid-cols-2 gap-2 p-2">
      {icons.map((icon) => (
        <button
          key={icon.id}
          onClick={() => handleIconClick(icon)}
          className="flex flex-col items-center justify-between gap-1.5 p-2.5 rounded-lg border border-border hover:border-primary hover:bg-accent/50 transition-all group min-h-[88px]"
          title={icon.name}
        >
          <icon.icon
            className="w-7 h-7 flex-shrink-0 group-hover:scale-110 transition-transform"
            style={{ color: icon.color }}
          />
          <span className="text-[11px] text-center w-full text-muted-foreground group-hover:text-foreground leading-[1.2] break-words hyphens-auto">
            {icon.name}
          </span>
        </button>
      ))}
    </div>
  );

  const renderCategorizedIcons = (grouped: Record<string, IconDefinition[]>) => {
    const categories = Object.keys(grouped).sort();

    return (
      <Accordion type="multiple" defaultValue={categories.slice(0, 3)} className="w-[100%]">
        {categories.map((category) => (
          <AccordionItem key={category} value={category} className=''>
            <AccordionTrigger className="px-3 py-2 text-sm font-medium capitalize hover:no-underline">
              <div className="flex items-center gap-2">
                {category.replace(/-/g, ' ')} 
                <Badge variant="secondary" className="text-xs">
                  {grouped[category].length}
                </Badge>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              {renderIconGrid(grouped[category])}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    );
  };

  return (
    <div className="w-80 border-r border-border bg-card flex flex-col h-full relative">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <h2 className="text-lg font-semibold mb-3">Components</h2>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search icons..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 pr-9"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2"
            >
              <X className="w-4 h-4 text-muted-foreground hover:text-foreground" />
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <ScrollArea className="flex-1">
        {searchQuery ? (
          // Search Results
          <div className="p-2">
            <div className="text-sm text-muted-foreground mb-2 px-2">
              {filteredIcons.length} results
            </div>
            {Object.keys(filteredGrouped).length > 0 ? (
              renderCategorizedIcons(filteredGrouped)
            ) : (
              <div className="text-center py-8 text-muted-foreground text-sm">
                No icons found
              </div>
            )}
          </div>
        ) : (
        // Tabs
        <div className="flex h-full w-full absolute">
          {/* Left Sidebar (Icons) */}
          <Tabs value={selectedTab} onValueChange={setSelectedTab} className="flex h-full w-full">
            <TabsList
              className="
                flex flex-col items-center justify-start 
                w-12 bg-transparent
              "
            >
              <TabsTrigger
                value="shapes"
                className="flex flex-col items-center p-2 rounded-md hover:bg-accent data-[state=active]:bg-accent/50 transition-all"
              >
                <Workflow className='text-black dark:text-white'/>
                <span className="text-[10px] mt-1">Shapes</span>
              </TabsTrigger>

              <TabsTrigger
                value="aws"
                className="flex flex-col items-center p-2 rounded-md hover:bg-accent data-[state=active]:bg-accent/50 transition-all"
              >
                <Cloud className='text-black dark:text-white'/>
                <span className="text-[10px] mt-1">AWS</span>
              </TabsTrigger>

              <TabsTrigger
                value="azure"
                className="flex flex-col items-center p-2 rounded-md hover:bg-accent data-[state=active]:bg-accent/50 transition-all"
              >
                <Component className='text-black dark:text-white'/>
                <span className="text-[10px] mt-1">Azure</span>
              </TabsTrigger>

              <TabsTrigger
                value="gcp"
                className="flex flex-col items-center p-2 rounded-md hover:bg-accent data-[state=active]:bg-accent/50 transition-all"
              >
                <Globe className='text-black dark:text-white'/>
                <span className="text-[10px] mt-1">GCP</span>
              </TabsTrigger>

              <TabsTrigger
                value="generic"
                className="flex flex-col items-center p-2 rounded-md hover:bg-accent data-[state=active]:bg-accent/50 transition-all"
              >
                <SwatchBook className='text-black dark:text-white'/>
                <span className="text-[10px] mt-1">Generic</span>
              </TabsTrigger>

              <TabsTrigger
                value="network"
                className="flex flex-col items-center p-2 rounded-md hover:bg-accent data-[state=active]:bg-accent/50 transition-all"
              >
                <Router className='text-black dark:text-white'/>
                <span className="text-[10px] mt-1">Net</span>
              </TabsTrigger>
            </TabsList>

          {/* Main Content Panel */}
          <div className="flex-1 overflow-y-auto">
            <TabsContent value="shapes" className="p-3">
              <div className="space-y-0">
                {SHAPE_CATEGORIES.map((category) => (
                  <div
                    key={category.name}
                    className="p-3 border-b border-border last:border-b-0"
                  >
                    <h3 className="text-xs font-semibold mb-2 text-muted-foreground uppercase tracking-wide">
                      {category.name}
                    </h3>
                    <div className="grid grid-cols-2 gap-2">
                      {category.shapes.map((shape) => (
                        <button
                          key={shape.label}
                          onClick={() => handleShapeClick(shape)}
                          className="
                            flex flex-col items-center gap-1.5 p-2.5 rounded-lg border 
                            border-border hover:border-primary hover:bg-accent/50 transition-all
                          "
                        >
                          <div className="text-xl leading-none">{shape.preview}</div>
                          <span className="text-[11px] text-muted-foreground leading-tight">
                            {shape.label}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="aws" className="p-3">
              {renderCategorizedIcons(awsGrouped)}
            </TabsContent>

            <TabsContent value="azure" className="p-3">
              {renderCategorizedIcons(azureGrouped)}
            </TabsContent>

            <TabsContent value="gcp" className="p-3">
              {renderCategorizedIcons(gcpGrouped)}
            </TabsContent>

            <TabsContent value="generic" className="p-3">
              {renderCategorizedIcons(genericGrouped)}
            </TabsContent>

            <TabsContent value="network" className="p-3">
              {renderCategorizedIcons(networkGrouped)}
            </TabsContent>
          </div>
          </Tabs>
        </div>

        )}
      </ScrollArea>

      {/* Footer Info */}
      <div className="p-2 border-t border-border bg-muted/30">
        <p className="text-xs text-muted-foreground text-center">
          Click to place on canvas
        </p>
      </div>
    </div>
  );
}
