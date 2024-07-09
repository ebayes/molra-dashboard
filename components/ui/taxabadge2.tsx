"use client"

import React from 'react';
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { Leaf, TreePalm, Flower, CircleHelp, Palmtree } from 'lucide-react';

interface TaxaBadgeProps {
  taxa: string;
  level?: "species" | "genus" | "family";
  variant?: "default" | "secondary" | "destructive" | "outline";
  onLevelChange?: (newLevel: "species" | "genus" | "family") => void;
}

const taxaConfigMap = {
  tree: { variant: 'green', iconColor: '#1E874C', textColor: '#17663A', bgColor: '#EEFBF4' },
  flower: { variant: 'blue', iconColor: '#0075AD', textColor: '#0075AD', bgColor: '#F0FAFF' },
  palm: { variant: 'orange', iconColor: '#EB3A00', textColor: '#B82E00', bgColor: '#FFF2EE' },
  unknown: { variant: 'gray', iconColor: '#808080', textColor: '#808080', bgColor: '#F0F0F0' },
  species: { variant: 'pink', iconColor: '#E91E63', textColor: '#C2185B', bgColor: '#FCE4EC' },
  genus: { variant: 'cyan', iconColor: '#00BCD4', textColor: '#0097A7', bgColor: '#E0F7FA' },
  family: { variant: 'indigo', iconColor: '#3F51B5', textColor: '#303F9F', bgColor: '#E8EAF6' },
};

const getTaxaIcon = (taxa: string | undefined, color: string) => {
  const iconClass = `w-3 h-3 text-[${color}] font-bold`;
  const letterClass = `w-3 h-3 text-[${color}] font-bold text-xs flex items-center justify-center`;
  
  if (!taxa) {
    return <CircleHelp className={iconClass} />;
  }

  switch (taxa.toLowerCase()) {
    case 'tree':
      return <Leaf className={iconClass} />;
    case 'palm':
      return <TreePalm className={iconClass} />;
    case 'flower':
      return <Flower className={iconClass} />;
    case 'species':
      return <span className={letterClass}>S</span>;
    case 'genus':
      return <span className={letterClass}>G</span>;
    case 'family':
      return <span className={letterClass}>F</span>;
    case 'unknown':
      return <CircleHelp className={iconClass} />;
    default:
      return <Palmtree className={iconClass} />;
  }
};

export function TaxaBadge({ taxa, level = "species", variant = "default", onLevelChange }: TaxaBadgeProps) {
  const taxaConfig = taxa && taxa !== "unknown" 
    ? (taxaConfigMap[taxa.toLowerCase() as keyof typeof taxaConfigMap] || taxaConfigMap.unknown) 
    : taxaConfigMap.unknown;
  const levelConfig = level ? taxaConfigMap[level as keyof typeof taxaConfigMap] : taxaConfigMap.unknown;

  // Use taxaConfig as a fallback if levelConfig is not available
  const config = levelConfig || taxaConfig;

  const isIcon = variant === "outline";
  const badgeClass = isIcon ? 'h-6 w-6 p-0.5 items-center justify-center' : 'flex gap-1';

  const handleClick = () => {
    if (isIcon && level) {
      const levels = ['species', 'genus', 'family'];
      const currentIndex = levels.indexOf(level);
      const nextLevel = levels[(currentIndex + 1) % levels.length] as "species" | "genus" | "family";
      if (onLevelChange) {
        onLevelChange(nextLevel);
      }
    }
  };

  const getColorClass = () => {
    return `text-[${config.textColor}]`;
  };

  const getIcon = () => {
    return getTaxaIcon(taxa, config.iconColor);
  };
  
  return (
    <Badge
      variant={variant}
      className={cn(
        "cursor-pointer",
        isIcon && "h-6 w-6 rounded-full p-0",
        badgeClass
      )}
      onClick={handleClick}
    >
      {isIcon ? (
        <span className={`text-xs ${getColorClass()}`}>{getIcon()}</span>
      ) : (
        taxa
      )}
    </Badge>
  );
}