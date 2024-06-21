"use client"

import { RightPanel } from "@/components/Structure/RightPanel";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Wand, Hand, Pencil, Eraser, ZoomIn, ZoomOut, Sun, Bird } from "lucide-react";
import { useState } from "react";

export default function Annotate() {
  const [isImageSelected, setIsImageSelected] = useState(false);
  const [activeTool, setActiveTool] = useState('hand');

  const handleImageClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    setIsImageSelected(true);
  };

  const handleOutsideClick = () => {
    setIsImageSelected(false);
  };

  const handleToolClick = (tool: string) => {
    setActiveTool(tool);
  };

  return (
    <RightPanel>
      <div id="right-top" className="right-top">
        <h1>Annotate</h1>
      </div>
      <div id="right-bottom" className="right-bottom flex h-full" onClick={handleOutsideClick}>
        <div id="chat-area" className="px-[15px] pt-[8px] pb-[15px] flex-grow flex flex-col"  >
          <div id="top-buttons" className="flex pb-[8px] justify-between">
            
          <div id="left" className="flex gap-1">
            <Button variant="ghost2" size="icon">
              <ZoomIn className="w-4 h-4 " />
            </Button>
            <Button variant="ghost2" size="icon">
              <ZoomOut className="w-4 h-4" />
            </Button>
            </div>

            <div id="middle" className="flex gap-1">
              <Button 
                variant={activeTool === 'hand' ? "primary" : "ghost2"} 
                size="icon"
                onClick={() => handleToolClick('hand')}
              >
                <Hand className="w-4 h-4" />
              </Button>
              <Button 
                variant={activeTool === 'pencil' ? "primary" : "ghost2"} 
                size="icon"
                onClick={() => handleToolClick('pencil')}
              >
                <Pencil className="w-4 h-4" />
              </Button>
              <Button 
                variant={activeTool === 'eraser' ? "primary" : "ghost2"} 
                size="icon"
                onClick={() => handleToolClick('eraser')}
              >
                <Eraser className="w-4 h-4" />
              </Button>
            </div>

            <div id="right" className="flex gap-1">
            <Button variant="ghost2" size="icon">
              <Sun className="w-4 h-4" />
            </Button>
            <Button variant="ghost2" size="icon">
              <Wand className="w-4 h-4" />
            </Button>
            </div>

          </div>

          <div id="image-frame" 
           className={`flex-grow border rounded-lg overflow-hidden relative p-[14px] box-border ${
             isImageSelected ? 'border-[#54B2BF] border-2 p-[13px]' : 'border-[hsl(var(--border-color))] border'
           }`}
           onClick={handleImageClick}
          >

        <div className="relative w-full h-full rounded-md overflow-hidden">
          <Image
            src="https://storage.googleapis.com/cdn.mol.org/rapid_assessment/sites/coata/visual/assets/Mavic_Pro/Jacinta/1/DJI_20240130162310_0055_D.jpg"
            alt="Current image" 
            layout="fill"
            objectFit="cover"
          />
        </div>
      </div>
        </div>

        <div id="right" className="w-[250px] py-[8px] pr-[8px] flex flex-col gap-1 justify-between">

        <div id="top-title" className="flex pb-[12px] gap-2 w-full">
  <div className="flex-grow">
    <Button variant="secondary" className="flex w-full justify-center">
      Annotations
    </Button> 
  </div>

  <div className="flex-shrink-0">
    <Button variant="secondary" size="icon">
      0
    </Button>
  </div>
</div>

            <div id="image-frame" 
           className="flex-grow overflow-hidden relative "
            >
        <div className="relative w-full h-full flex flex-col gap-1">
        <Button variant="ghost2" className="w-full">
        <Bird className="w-4 h-4 mr-3 inline" />
                Harpy Eagle
              </Button> 
              <Button variant="ghost2" className="w-full">
                Annotations
              </Button> 
        </div>
      </div>

      <div id="bottom-buttons" className="flex gap-[15px]">
  <Button variant="primary" className="flex w-full justify-center">
    Save
  </Button>
  <Button variant="secondary" className="flex w-full justify-center">
    Skip
  </Button>
</div>    
        
        </div>
      </div>
    </RightPanel>
  );
}