"use client"

import { useState, useEffect, useCallback } from 'react';
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge";
import { Cross2Icon } from "@radix-ui/react-icons";
import { DataTableFacetedFilter } from "./faceted-filter";
import { Crown, Diameter, Ruler, Cannabis, Flower, Palmtree, Weight } from "lucide-react";
import { useVisualData } from '@/components/context/VisualDataContext';
import { PanelLeftClose } from "lucide-react";

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
  isRightPanelVisible
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
  

  const areas = [
    { label: "NW", value: "nw" },
    { label: "NE", value: "ne" },
    { label: "SW", value: "sw" },
    { label: "SE", value: "se" },
  ];

  const areaOptions = areas.map(area => ({ label: area.label, value: area.value }));

  return (
    <div id="top-bar" className='flex w-full items-center justify-between pb-[8px]'>
      <div className="flex items-center gap-2">
        {/* <p className='text-gray-600 text-xs'>Tree crowns:</p> */}
        <Badge variant="yellow">
          <Crown className="mr-2 h-4 w-4" />
          {featureCount}
        </Badge>
        <Badge variant="green">
          <Cannabis className="mr-2 h-4 w-4" />
          {cecropiaCount}
        </Badge>
        <Badge variant="pink">
          <Flower className="mr-2 h-4 w-4" />
          {floweringCount}
        </Badge>
        <Badge variant="secondary">
          <Palmtree className="mr-2 h-4 w-4" />
          {palmCount}
        </Badge>
        <p className='text-gray-300'>|</p>
        {/* <p className='text-gray-600 text-xs'>Average dimensions:</p> */}
        <Badge variant="secondary">
          <Ruler className="mr-2 h-4 w-4" />
          {avgHeight}m
        </Badge>
        <Badge variant="secondary">
          <Diameter className="mr-2 h-4 w-4" />
          {avgDiameter}m
        </Badge>
        <Badge variant="secondary">
          <Weight className="mr-2 h-4 w-4" />
          {avgBiomass}kg
        </Badge>
        
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
    <DataTableFacetedFilter
      title="Area"
      options={areaOptions}
      selectedValues={selectedAreas}
      onChange={handleAreasChange}
    />
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