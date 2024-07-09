"use client"

import { Badge } from "@/components/ui/badge";
import { Blend, Crown, DraftingCompass, TriangleRight } from "lucide-react";
import { useState } from "react";
import { Slider } from "@/components/ui/slider";

interface DSMTopBarProps {
  onControlChange: (controls: { opacity: number; sunEl: number; sunAz: number; vert: number; [key: string]: number }) => void;
}

export default function DSMTopBar({ onControlChange }: DSMTopBarProps) {
  const [opacity, setOpacity] = useState(0.7);
  const [sunEl, setSunEl] = useState(45);
  const [sunAz, setSunAz] = useState(315);

  const handleControlChange = (id: string, value: number[]) => {
    const newValue = value[0];
    switch (id) {
      case "opacity":
        setOpacity(newValue);
        break;
      case "sunEl":
        setSunEl(newValue);
        break;
      case "sunAz":
        setSunAz(newValue);
        break;
    }
    onControlChange({ opacity, sunEl, sunAz, vert: 1, [id]: newValue });
  };

  return (
    <div id="top-bar" className='flex w-full items-center justify-start pb-[8px] h-[40px]'>
  
      <div id="controls" className="flex items-center gap-4">
        <div className="flex items-center">
        <Blend className="mr-2 h-4 w-4" />
          <Slider
            id="opacity"
            value={[opacity]}
            onValueChange={(value) => handleControlChange("opacity", value)}
            max={1}
            step={0.1}
            className="w-24"
          />
          <span className="ml-2 text-xs">{opacity.toFixed(1)}</span>
        </div>
        <div className="flex items-center">
        <TriangleRight className="mr-2 h-4 w-4" />
          <Slider
            id="sunEl"
            value={[sunEl]}
            onValueChange={(value) => handleControlChange("sunEl", value)}
            max={90}
            step={1}
            className="w-24"
          />
          <span className="ml-2 text-xs">{sunEl}°</span>
        </div>
        <div className="flex items-center">
          <DraftingCompass className="mr-2 h-4 w-4" />
          <Slider
            id="sunAz"
            value={[sunAz]}
            onValueChange={(value) => handleControlChange("sunAz", value)}
            max={360}
            step={1}
            className="w-24"
          />
          <span className="ml-2 text-xs">{sunAz}°</span>
        </div>
      </div>
    </div>
  );
}