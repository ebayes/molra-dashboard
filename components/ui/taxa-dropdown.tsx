import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { TaxaBadge } from "@/components/ui/taxabadge2";
import { fetchSpecies } from '@/utils/molra';
import { useStudySubsite } from "@/components/context/siteContext";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface Species {
  value: string;
  label: string;
}

interface EnhancedDetection {
  taxa: string;
  filterTaxa: string;
  confirmed: boolean;
  value: string;
  labels?: [string, string][];
  label?: string; 
}

const taxaMapping = {
  berry: "plants",
  flower: "plants",
  palm: "plants",
  plants: "plants",
};

export function TaxaSelectionDropdown({ detection, onSelect, open, onOpenChange }: { 
  detection: EnhancedDetection, 
  onSelect: (displayValue: string, filterValue: string) => void, 
  open: boolean, 
  onOpenChange: (isOpen: boolean) => void 
}) {
    const taxaOptions = [
      "berry", "plants", "flower", "palm", "fern", "ants", "amphibians", "odonates", 
      "birds", "moths", "dragonflies", "reptiles", "butterflies", "fishes", "mammals"
    ];
  
    const handleSelect = (value: string) => {
      const filterValue = taxaMapping[value as keyof typeof taxaMapping] || value;
      onSelect(value, filterValue);
      onOpenChange(false);
    };
  
    const content = (
      <Command>
        <CommandInput placeholder="Search taxa..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup>
            {taxaOptions.map((taxa) => (
              <CommandItem
                key={taxa}
                value={taxa}
                onSelect={handleSelect}
              >
                <TaxaBadge taxa={taxa} variant="outline" />
                <span className="ml-2">{taxa.charAt(0).toUpperCase() + taxa.slice(1)}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </Command>
    );
  
    return (
      <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => onOpenChange(true)}>
          <TaxaBadge 
            taxa={detection.taxa || 'Unknown'} 
            variant="outline"
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0" align="start">
        {content}
      </PopoverContent>
    </Popover>
    );
  }
  
  export function TaxaDropdown({ detection, onSelect, selectedTaxa, taxonomicLevel }: { 
    detection: EnhancedDetection, 
    onSelect: (value: string) => void,
    selectedTaxa: string,
    taxonomicLevel: "species" | "genus" | "family"
  }) {
    const { selectedSubsite } = useStudySubsite(); 
    const [open, setOpen] = React.useState(false)
    const [options, setOptions] = useState<Species[]>([]);
    const [loading, setLoading] = useState(false);
    
    const getDisplayValue = (value: string | null | undefined) => {
      if (value === 'branches' || value === 'unknown' || !value) {
        return 'Unlabeled';
      }
      return value.charAt(0).toUpperCase() + value.slice(1);
    };
  
    const [selectedValue, setSelectedValue] = React.useState<string | null>(
      getDisplayValue(detection?.label || selectedTaxa)
    )
  
    React.useEffect(() => {
      setSelectedValue(getDisplayValue(detection?.label || selectedTaxa))
    }, [detection, selectedTaxa])
  
    useEffect(() => {
      if (selectedSubsite && selectedTaxa) {
        setLoading(true);
        fetchSpecies(selectedSubsite).then((data: any[]) => {
          const filteredData = data.filter((item: any) => item.taxa === detection?.filterTaxa);  
          
          let formattedData: Species[];
          if (taxonomicLevel === "species") {
            formattedData = filteredData.map((item: any) => ({
              value: item.species_id,
              label: item.commonname || item.scientificname
            }));
          } else if (taxonomicLevel === "genus") {
            const uniqueGenera = Array.from(new Set(filteredData.map((item: any) => item.genus)));
            formattedData = uniqueGenera.map((genus: string) => ({
              value: genus,
              label: genus
            }));
          } else { // family
            const uniqueFamilies = Array.from(new Set(filteredData.map((item: any) => item.family)));
            formattedData = uniqueFamilies.map((family: string) => ({
              value: family,
              label: family
            }));
          }
          
          setOptions(formattedData);
          setLoading(false);
        });
      }
    }, [selectedSubsite, selectedTaxa, taxonomicLevel, detection?.filterTaxa]);
  
    const handleSelect = (value: string) => {
      setSelectedValue(getDisplayValue(value))
      onSelect(value)
      setOpen(false)
    }
  
    const content = (
      <Command>
        <CommandInput placeholder={`Search ${taxonomicLevel}...`} />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup>
            {options.map((item) => (
              <CommandItem
                key={item.value}
                value={item.value}
                onSelect={handleSelect}
              >
                {item.label}
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </Command>
    )
  
    return (
      <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="link" size="dropdown" className="w-[120px] justify-start">
          <div className="w-[120px] text-sm truncate text-left">
            {selectedValue || `Select ${taxonomicLevel}`}
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0" align="start">
        {content}
      </PopoverContent>
    </Popover>
    )
  }