import React from 'react';
import { Badge } from "@/components/ui/badge"
import { Flower, Leaf, Sprout, TreePalm, Grape } from 'lucide-react';

type TaxaBadgeProps = {
  taxa: string;
  count: number;
};

const taxaConfig = {
  berry: { variant: 'purple', iconColor: '#7047EB', textColor: '#4316CA', bgColor: '#F4F1FD' },
  plant: { variant: 'green', iconColor: '#1E874C', textColor: '#17663A', bgColor: '#EEFBF4' },
  flower: { variant: 'blue', iconColor: '#0075AD', textColor: '#0075AD', bgColor: '#F0FAFF' },
  palm: { variant: 'orange', iconColor: '#EB3A00', textColor: '#B82E00', bgColor: '#FFF2EE' },
  fern: { variant: 'yellow', iconColor: '#C28800', textColor: '#8A6100', bgColor: '#FFF9EB' },
};

const getTaxaIcon = (taxa: string, color: string) => {
  const iconClass = `w-3 h-3 text-[${color}]`;
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
    default:
      return <Leaf className={iconClass} />;
  }
};

export function TaxaBadge({ taxa, count }: TaxaBadgeProps) {
  const config = taxaConfig[taxa.toLowerCase() as keyof typeof taxaConfig] || taxaConfig.plant;

  return (
    <Badge 
      variant={config.variant as any}
      className='flex gap-1'
      style={{
        backgroundColor: config.bgColor,
        color: config.textColor,
      }}
    >
      {getTaxaIcon(taxa, config.iconColor)}
      {count}
    </Badge>
  );
}