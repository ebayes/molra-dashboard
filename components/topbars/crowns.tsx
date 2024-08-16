"use client"

import { useState, useEffect, useCallback } from 'react';
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge";
import { Cross2Icon } from "@radix-ui/react-icons";
import { DataTableFacetedFilter } from "./faceted-filter";
import { Crown, Diameter, Ruler, Cannabis, Flower, Palmtree, Weight } from "lucide-react";
import { useVisualData } from '@/components/context/VisualDataContext';
import { PanelLeftClose } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface CrownsTopBarProps {
  featureCount: number;
  cecropiaCount: number;
  floweringCount: number;
  palmCount: number;
  avgHeight: number;
  avgDiameter: number;
  avgBiomass: number;
  toggleRightPanel: () => void;
  isRightPanelVisible: boolean;
  onHistogramToggle: (type: string | null) => void;
  onMetricToggle: (metric: string) => void;
  selectedMetric: string | null;
}

export default function CrownsTopBar({
  featureCount,
  cecropiaCount,
  floweringCount,
  palmCount,
  avgHeight,
  avgDiameter,
  avgBiomass,
  toggleRightPanel,
  isRightPanelVisible,
  onHistogramToggle,
  onMetricToggle,
  selectedMetric
}: CrownsTopBarProps) {
  const { selectedAreas, setSelectedAreas, filterData } = useVisualData();
  const [selectedTaxa, setSelectedTaxa] = useState<string[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);

  const handleAreasChange = useCallback((newAreas: string[]) => {
    setSelectedAreas(newAreas);
    filterData(selectedTaxa, selectedTypes, newAreas);
  }, [setSelectedAreas, filterData, selectedTaxa, selectedTypes]);

  const applyFilters = useCallback(() => {
    filterData(selectedTaxa, selectedTypes, selectedAreas);
  }, [filterData, selectedTaxa, selectedTypes, selectedAreas]);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  const isAnyFilterSelected = selectedTaxa.length > 0 || selectedTypes.length > 0 || selectedStatuses.length > 0 || selectedAreas.length > 0;

  const handleReset = useCallback(() => {
    setSelectedTaxa([]);
    setSelectedTypes([]);
    setSelectedStatuses([]);
    setSelectedAreas([]);
    filterData([], [], []);
  }, [filterData, setSelectedAreas, setSelectedStatuses]);
  
  const handleHistogramClick = (type: string) => {
    onHistogramToggle(type);
  };

  const handleMetricClick = (metric: string) => {
    onMetricToggle(metric);
  };

  return (
    <div id="top-bar" className='flex w-full items-center justify-between pb-[8px]'>
      <div className="flex items-center gap-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <Badge variant="yellow">
                <Crown className="mr-2 h-4 w-4" />
                Total crowns: {featureCount}
              </Badge>
            </TooltipTrigger>
            <TooltipContent>
              <p>Total tree crowns</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <p className='text-gray-300'>|</p>
        {avgHeight > 0 && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Badge variant="secondary" onClick={() => handleHistogramClick('tree_height')}>
                  <Ruler className="mr-2 h-4 w-4" />
                  {avgHeight.toFixed(2)}m
                </Badge>
              </TooltipTrigger>
              <TooltipContent>
                <p>Average height (click for histogram)</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}

        {avgDiameter > 0 && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Badge variant="secondary" onClick={() => handleHistogramClick('crown_diameter')}>
                  <Diameter className="mr-2 h-4 w-4" />
                  {avgDiameter.toFixed(2)}m
                </Badge>
              </TooltipTrigger>
              <TooltipContent>
                <p>Average diameter (click for histogram)</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
      <div className="flex flex-1 items-center justify-end space-x-2">
        <div className="flex items-center space-x-2">
        {isAnyFilterSelected && (
            <Button
              variant="ghost"
              className="h-8 px-2 lg:px-3"
              onClick={handleReset}
            >
              Reset
              <Cross2Icon className="ml-2 h-4 w-4" />
            </Button>
          )}

          <Button 
            size="icon" 
            onClick={toggleRightPanel} 
            className={`${!isRightPanelVisible ? 'flex' : 'hidden'}`}
          >
            <PanelLeftClose className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}