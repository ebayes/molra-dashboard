"use client"

import { useState, useEffect, useCallback } from 'react';
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge";
import { Cross2Icon, MixerHorizontalIcon } from "@radix-ui/react-icons";
import { DataTableFacetedFilter } from "./faceted-filter";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Table, Map, ArrowDown10, ArrowUp10, Image as ImageIcon, ArrowLeft } from "lucide-react";
import { useVisualData } from '@/components/context/VisualDataContext';
import { useStudySubsite } from "@/components/context/siteContext";
import { useRouter, usePathname } from 'next/navigation';

export default function TopBar() {
  const { filteredData, filterData } = useVisualData();
  const { selectedSubsite, setSelectedSubsite } = useStudySubsite();
  const [selectedTaxa, setSelectedTaxa] = useState<string[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [position, setPosition] = useState<string>("most_diverse");
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [selectedAssignees, setSelectedAssignees] = useState<string[]>([]);
  const router = useRouter();
  const pathname = usePathname();

  const isAnnotatePage = pathname?.startsWith('/platform/annotate/image');

  const handleBackClick = () => {
    router.push(`/platform/data/image#site=${selectedSubsite}`);
  };


  const applyFilters = useCallback(() => {
    filterData(selectedTaxa, selectedTypes);
  }, [filterData, selectedTaxa, selectedTypes]);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  const handleTaxaChange = useCallback((newTaxa: string[]) => {
    setSelectedTaxa(newTaxa);
  }, []);

  const handleTypesChange = useCallback((newTypes: string[]) => {
    setSelectedTypes(newTypes);
  }, []);

  const isAnyFilterSelected = selectedTaxa.length > 0 || selectedTypes.length > 0 || selectedStatuses.length > 0;

  const handleReset = useCallback(() => {
    setSelectedTaxa([]);
    setSelectedTypes([]);
    setSelectedStatuses([]);
    filterData([], []);
  }, [filterData]);
  
  const types = [
    { label: "Ground", value: "ground" },
    { label: "Midstory", value: "midstory" },
    { label: "Canopy", value: "canopy" },
  ];

  const taxa = [
    { label: "Berry", value: "berry" },
    { label: "Plants", value: "plants" },
    { label: "Flower", value: "flower" },
    { label: "Palm", value: "palm" },
    { label: "Fern", value: "fern" },
    { label: "Ants", value: "ants" },
    { label: "Amphibians", value: "amphibians" },
    { label: "Odonates", value: "odonates" },
    { label: "Birds", value: "birds" },
    { label: "Moths", value: "moths" },
    { label: "Dragonflies", value: "dragonflies" },
    { label: "Reptiles", value: "reptiles" },
    { label: "Butterflies", value: "butterflies" },
    { label: "Fishes", value: "fishes" },
    { label: "Mammals", value: "mammals" },
  ];

  const statuses = [
    { label: "In Progress", value: "in progress" },
    { label: "Flagged", value: "flagged" },
    { label: "Unlabeled", value: "unlabeled" },
    { label: "Done", value: "done" },
    { label: "Skipped", value: "skipped" },
  ];

  const typeOptions = types.map(type => ({ label: type.label, value: type.value }));
  const statusOptions = statuses.map(status => ({ label: status.label, value: status.value }));
  const taxaOptions = taxa.map(taxa => ({ label: taxa.label, value: taxa.value }));

  return (
    <div id="top-bar" className='flex w-full items-center justify-between'>
      <div className="flex items-center">
      {isAnnotatePage ? (
          <Button 
            variant="ghost" 
            className="h-8 lg:flex text-xs" 
            onClick={handleBackClick}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        ) : (
          <Badge variant="secondary" className="mr-4">
            <ImageIcon className="mr-2 h-4 w-4" />
            {filteredData ? filteredData.length : '...'}
          </Badge>
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
      <DataTableFacetedFilter
        title="Taxa"
        options={taxaOptions}
        selectedValues={selectedTaxa}
        onChange={handleTaxaChange}
      />
      <DataTableFacetedFilter
        title="Type"
        options={typeOptions}
        selectedValues={selectedTypes}
        onChange={handleTypesChange}
      />
          <DataTableFacetedFilter
            title="Status"
            options={statusOptions}
            selectedValues={selectedStatuses}
            onChange={setSelectedStatuses}
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="ml-auto h-8 lg:flex text-xs"
            >
              <MixerHorizontalIcon className="mr-2 h-4 w-4" />
              Sort
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuLabel>Sort by</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuRadioGroup value={position} onValueChange={setPosition}>
              <DropdownMenuRadioItem value="most_diverse">
                <ArrowUp10 className="mr-2 h-4 w-4" />
                Most diverse
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="least_diverse">
                <ArrowDown10 className="mr-2 h-4 w-4" />
                Least diverse
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="highest_confidence">
                <ArrowUp10 className="mr-2 h-4 w-4" />
                Highest confidence
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="lowest_confidence">
                <ArrowDown10 className="mr-2 h-4 w-4" />
                Lowest confidence
              </DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}