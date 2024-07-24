"use client"

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { PanelLeftOpen, PanelLeftClose, Eye, EyeOff } from "lucide-react";
import OpenLayersMap from "./map";
import CrownsTopBar from "@/components/topbars/crowns";
import OrthoTopBar from "@/components/topbars/ortho";
import BlankTopBar from "@/components/topbars/blank";
import DSMTopBar from "@/components/topbars/dsm";
import { Checkbox } from "@/components/ui/checkbox"
import { CheckedState } from "@radix-ui/react-checkbox";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion-insights"

export default function Main() {
  const [isRightPanelVisible, setIsRightPanelVisible] = useState(true);
  const [showCrowns, setShowCrowns] = useState(false);
  const [featureCount, setFeatureCount] = useState(0);
  const [cecropiaCount, setCecropiaCount] = useState(0);
  const [floweringCount, setFloweringCount] = useState(0);
  const [palmCount, setPalmCount] = useState(0);
  const [avgHeight, setAvgHeight] = useState(0);
  const [avgDiameter, setAvgDiameter] = useState(0);
  const [avgBiomass, setAvgBiomass] = useState(0);
  const [showDSM, setShowDSM] = useState(false);
  const [showOrthomosaic, setShowOrthomosaic] = useState(false);
  const [updateDSMLayer, setUpdateDSMLayer] = useState<any>(null);
  const [showDSMControls, setShowDSMControls] = useState(false);
  const [activeTopBar, setActiveTopBar] = useState('blank');
  const [showSiteBoundary, setShowSiteBoundary] = useState(true);

  const handleSiteBoundaryChange = (checked: boolean) => {
    setShowSiteBoundary(checked);
  };

  const handleDSMChange = (checked: boolean) => {
    setShowDSM(checked);
    setShowDSMControls(checked);
    setActiveTopBar(checked ? 'dsm' : 'blank');
  };

  const handleDSMControlChange = (controls: any) => {
    if (updateDSMLayer) {
      updateDSMLayer({ ...controls, vert: 1 });
    }
  };

  const handleDSMLayerUpdate = (updateFunction: (controls: any) => void) => {
    setUpdateDSMLayer(() => updateFunction);
  };

  const toggleRightPanel = () => {
    setIsRightPanelVisible(!isRightPanelVisible);
  };

  const handleFeatureCountChange = (count: number) => {
    setFeatureCount(count);
  };

  const handleCecropiaCountChange = (count: number) => {
    setCecropiaCount(count);
  };

  const handleFloweringCountChange = (count: number) => {
    setFloweringCount(count);
  };

  const handlePalmCountChange = (count: number) => {
    setPalmCount(count);
  };

  const handleAverageMetricsChange = ({ avgHeight, avgDiameter, avgBiomass }: { avgHeight: string; avgDiameter: string; avgBiomass: string }) => {
    setAvgHeight(parseFloat(avgHeight));
    setAvgDiameter(parseFloat(avgDiameter));
    setAvgBiomass(parseFloat(avgBiomass));
  };


  const handleCrownsChange = (checked: CheckedState) => {
    setShowCrowns(checked === true);
    setActiveTopBar(checked === true ? 'crowns' : 'blank');
  };

  const handleOrthomosaicChange = (checked: boolean) => {
    setShowOrthomosaic(checked);
    setActiveTopBar(checked ? 'ortho' : 'blank');
  };

  return (
    <div className="flex flex-col h-full w-full">
      <div id="right-bottom" className="right-bottom flex h-full px-[15px] pb-[15px] pt-[8px] gap-[15px]">
        <div id="chat-area" className="flex-grow flex flex-col">
          {activeTopBar === 'crowns' && (
            <CrownsTopBar 
              featureCount={featureCount} 
              cecropiaCount={cecropiaCount}
              floweringCount={floweringCount}
              palmCount={palmCount}
              avgHeight={avgHeight}
              avgDiameter={avgDiameter}
              avgBiomass={avgBiomass}
              toggleRightPanel={toggleRightPanel}
              isRightPanelVisible={isRightPanelVisible}
            />
          )}
          {activeTopBar === 'ortho' && (
            <OrthoTopBar 
              toggleRightPanel={toggleRightPanel}
              isRightPanelVisible={isRightPanelVisible}
            />
          )}
          {activeTopBar === 'dsm' && (
            <DSMTopBar 
              onControlChange={handleDSMControlChange}
            />
          )}
          {activeTopBar === 'blank' && (
            <BlankTopBar 
              toggleRightPanel={toggleRightPanel}
              isRightPanelVisible={isRightPanelVisible}
            />
          )}
          <div id="image-frame" className="flex-grow border rounded-lg overflow-hidden relative p-[14px] box-border flex items-center justify-center border-[hsl(var(--border-color))]">
          <OpenLayersMap 
              showCrowns={showCrowns}
              onFeatureCountChange={handleFeatureCountChange}
              onCecropiaCountChange={handleCecropiaCountChange}
              onFloweringCountChange={handleFloweringCountChange}
              onPalmCountChange={handlePalmCountChange}
              onAverageMetricsChange={handleAverageMetricsChange}
              showDSM={showDSM}
              showSiteBoundary={showSiteBoundary}
              showOrthomosaic={showOrthomosaic}
              onDSMControlChange={handleDSMControlChange}
              onDSMLayerUpdate={handleDSMLayerUpdate}
            />
          </div>
        </div>
        <div id="right" className={`w-[250px] min-w-[250px] flex flex-col gap-1 ${isRightPanelVisible ? 'hidden lg:flex' : 'hidden'}`}>
          <div id="top-title" className="flex gap-2 w-full">
            <div className="flex-grow pb-2">
              <div className="flex gap-1 w-full items-center bg-[#ECECF1] text-[#202123] font-semibold rounded-md text-sm h-[34px] py-2 justify-center">
                Layers
              </div> 
            </div>
            <div className="flex-shrink-0">
              <Button variant="secondary" size="icon" onClick={toggleRightPanel}>
                <PanelLeftOpen className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <Accordion type="multiple" defaultValue={["item-1", "item-2", "item-3", "item-4"]}>
          <AccordionItem value="item-4">
    <AccordionTrigger>Imagery and Surface Models</AccordionTrigger>
    <AccordionContent>
      <div className="checkbox-container">
      <div className="checkbox-item">
          <Checkbox id="show-site-boundary" defaultChecked={true} checked={showSiteBoundary} onCheckedChange={handleSiteBoundaryChange} />
          <label htmlFor="show-site-boundary" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Site Boundary
          </label>
        </div>
      <div className="checkbox-item">
          <Checkbox id="show-orthomosaic" defaultChecked={true} checked={showOrthomosaic} onCheckedChange={handleOrthomosaicChange} />
          <label htmlFor="show-orthomosaic" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Orthomosaic
          </label>
        </div>
        <div className="checkbox-item">
          <Checkbox id="show-dsm" checked={showDSM} onCheckedChange={handleDSMChange} />
          <label htmlFor="show-dsm" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            DSM (Digital Surface Model)
          </label>
        </div>
        
      </div>
    </AccordionContent>
  </AccordionItem>
  <AccordionItem value="item-1">
    <AccordionTrigger>Vegetation and Canopy Metrics</AccordionTrigger>
    <AccordionContent>
      <div className="checkbox-container">
        <div className="checkbox-item">
          <Checkbox id="show-crowns" checked={showCrowns} onCheckedChange={handleCrownsChange} />
          <label htmlFor="show-crowns" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Crowns
          </label>
        </div>
      </div>
    </AccordionContent>
  </AccordionItem>
  

</Accordion>
        </div>
      </div>
    </div>
  );
}