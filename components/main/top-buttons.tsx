import React from 'react';
import { Button } from "@/components/ui/button";
import { ZoomIn, ZoomOut, Hand, Square, Eraser, Sun, PanelLeftClose, Eye, EyeOff, TreeDeciduous } from "lucide-react";

interface TopButtonsProps {
  activeTool: string;
  handleToolClick: (tool: string) => void;
  toggleRightPanel: () => void;
  isRightPanelVisible: boolean;
  showCrowns: boolean;
  setShowCrowns: (showCrowns: boolean) => void;
}

export function TopButtons({ 
  activeTool, 
  handleToolClick, 
  isRightPanelVisible, 
  toggleRightPanel,
  showCrowns,
  setShowCrowns
 }: TopButtonsProps) {
  return (
    <div id="top-buttons" className="flex justify-between pb-[8px]">
      
      <div id="right" className="flex gap-1">
      
      <Button 
        variant={showCrowns ? "primary" : "ghost2"} 
        size="icon"
        onClick={() => setShowCrowns(!showCrowns)}
      >
       { showCrowns ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" /> }
      </Button>
        <Button size="icon" onClick={toggleRightPanel} className={`${!isRightPanelVisible ? 'hidden lg:flex' : 'hidden'}`}>
          <PanelLeftClose className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}