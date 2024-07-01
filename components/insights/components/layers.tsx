"use client"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion-insights"
import { Checkbox } from "@/components/ui/checkbox"
import { useInsights } from "@/components/context/insightsContext"

const insightDetails = [
  {
    title: "Terrain",
    items: ["Orthomosaic", "Border"],
  },
  {
    title: "Elevation Data",
    items: ["DSM"],
  },
  {
    title: "Species data",
    items: ["Species Detection"],
  },
  {
    title: "3D Model",
    items: ["3d model"],
  },
];

export function LayersComponent() {
  const { checkedInsights, toggleInsight } = useInsights();

  return (
    <Accordion type="multiple" className="w-full" defaultValue={insightDetails.map((_, index) => `item-${index + 1}`)}>
      {insightDetails.map((detail, index) => (
        <AccordionItem key={index} value={`item-${index + 1}`}>
          <AccordionTrigger>{detail.title}</AccordionTrigger>
          <AccordionContent>
            <ul className="space-y-2">
              {detail.items.map((item) => {
                return (
                  <li key={item} className="flex items-center space-x-2">
                    <Checkbox
                      checked={checkedInsights.includes(item)}
                      onCheckedChange={() => toggleInsight(item)}
                    />
                    <span>{item}</span>
                  </li>
                );
              })}
            </ul>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}