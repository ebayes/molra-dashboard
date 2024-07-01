"use client"

import React from 'react';
import { Badge } from "@/components/ui/badge"
import { Flower, Leaf, Sprout, TreePalm, Grape, CircleHelp, Star, Trash2, PawPrint } from 'lucide-react';
import { useState } from 'react';

type TaxaBadgeProps = {
  taxa: string;
  count?: number;
  variant?: 'default' | 'icon';
  onLevelChange?: (newLevel: string) => void;
  onTaxaClick?: () => void;  
};

const taxaConfig = {
  berry: { variant: 'purple', iconColor: '#7047EB', textColor: '#4316CA', bgColor: '#F4F1FD' },
  plant: { variant: 'green', iconColor: '#1E874C', textColor: '#17663A', bgColor: '#EEFBF4' },
  flower: { variant: 'blue', iconColor: '#0075AD', textColor: '#0075AD', bgColor: '#F0FAFF' },
  palm: { variant: 'orange', iconColor: '#EB3A00', textColor: '#B82E00', bgColor: '#FFF2EE' },
  fern: { variant: 'yellow', iconColor: '#C28800', textColor: '#8A6100', bgColor: '#FFF9EB' },
  unknown: { variant: 'gray', iconColor: '#808080', textColor: '#808080', bgColor: '#F0F0F0' },
  species: { variant: 'pink', iconColor: '#E91E63', textColor: '#C2185B', bgColor: '#FCE4EC' },
  genus: { variant: 'cyan', iconColor: '#00BCD4', textColor: '#0097A7', bgColor: '#E0F7FA' },
  family: { variant: 'indigo', iconColor: '#3F51B5', textColor: '#303F9F', bgColor: '#E8EAF6' },
  star: { variant: 'yellow', iconColor: '#C28800', textColor: '#8A6100', bgColor: '#FFF9EB' },
  trash: { variant: 'red', iconColor: '#E53935', textColor: '#C62828', bgColor: '#FFEBEE' },
  ants: { variant: 'brown', iconColor: '#795548', textColor: '#4E342E', bgColor: '#EFEBE9' },
  amphibians: { variant: 'teal', iconColor: '#009688', textColor: '#00796B', bgColor: '#E0F2F1' },
  odonates: { variant: 'lime', iconColor: '#CDDC39', textColor: '#AFB42B', bgColor: '#F9FBE7' },
  birds: { variant: 'lightBlue', iconColor: '#03A9F4', textColor: '#0288D1', bgColor: '#E1F5FE' },
  moths: { variant: 'deepPurple', iconColor: '#673AB7', textColor: '#512DA8', bgColor: '#EDE7F6' },
  dragonflies: { variant: 'amber', iconColor: '#FFC107', textColor: '#FFA000', bgColor: '#FFF8E1' },
  reptiles: { variant: 'deepOrange', iconColor: '#FF5722', textColor: '#E64A19', bgColor: '#FBE9E7' },
  butterflies: { variant: 'pink', iconColor: '#E91E63', textColor: '#C2185B', bgColor: '#FCE4EC' },
  fishes: { variant: 'lightGreen', iconColor: '#8BC34A', textColor: '#689F38', bgColor: '#F1F8E9' },
  mammals: { variant: 'brown', iconColor: '#795548', textColor: '#5D4037', bgColor: '#EFEBE9' },
};

const getTaxaIcon = (taxa: string, color: string) => {
  const iconClass = `w-3 h-3 text-[${color}] font-bold`;
  const letterClass = `w-3 h-3 text-[${color}] font-bold text-xs flex items-center justify-center`;
  switch (taxa.toLowerCase()) {
    case 'fern':
      return <Sprout className={iconClass} />;
    case 'plant':
      return <Leaf className={iconClass} />;
    case 'palm':
      return <TreePalm className={iconClass} />;
    case 'flower':
      return <Flower className={iconClass} />;
    case 'berry':
      return <Grape className={iconClass} />;
    case 'species':
      return <span className={letterClass}>S</span>;
    case 'genus':
      return <span className={letterClass}>G</span>;
    case 'family':
      return <span className={letterClass}>F</span>;
    case 'unknown':
      return <CircleHelp className={iconClass} />;
      case 'star':
        return <Star className={iconClass} />;
      case 'trash':
        return <Trash2 className={iconClass} />;
        case 'ants':
          case 'amphibians':
          case 'odonates':
          case 'birds':
          case 'moths':
          case 'dragonflies':
          case 'reptiles':
          case 'butterflies':
          case 'fishes':
          case 'mammals':
            return <PawPrint className={iconClass} />;
        default:
        return <Leaf className={iconClass} />;
  }
};

export function TaxaBadge({ taxa, count, variant = 'default', onLevelChange, onTaxaClick }: TaxaBadgeProps) {
  const config = taxaConfig[taxa.toLowerCase() as keyof typeof taxaConfig] || taxaConfig.plant;

  const badgeClass = variant === 'icon' ? 'h-6 w-6 p-0.5 items-center justify-center' : 'flex gap-1';

  const handleClick = () => {
    if (variant === 'icon') {
      if (['species', 'genus', 'family'].includes(taxa.toLowerCase())) {
        const levels = ['species', 'genus', 'family'];
        const currentIndex = levels.indexOf(taxa.toLowerCase());
        const nextLevel = levels[(currentIndex + 1) % levels.length];
        if (onLevelChange) {
          onLevelChange(nextLevel);
        }
      } else if (onTaxaClick) {
        onTaxaClick();  
      }
    }
  };

  return (
    <Badge 
      variant={config.variant as any}
      className={badgeClass}
      style={{
        backgroundColor: config.bgColor,
        color: config.textColor,
      }}
      onClick={handleClick}
    >
      {getTaxaIcon(taxa, config.iconColor)}
      {variant === 'default' && count}
    </Badge>
  );
}