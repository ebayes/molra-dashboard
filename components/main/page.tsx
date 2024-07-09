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
  const [showHabitats, setShowHabitats] = useState(false); 
  const [featureCount, setFeatureCount] = useState(0);
  const [cecropiaCount, setCecropiaCount] = useState(0);
  const [floweringCount, setFloweringCount] = useState(0);
  const [palmCount, setPalmCount] = useState(0);
  const [avgHeight, setAvgHeight] = useState(0);
  const [avgDiameter, setAvgDiameter] = useState(0);
  const [avgBiomass, setAvgBiomass] = useState(0);
  const [showDSM, setShowDSM] = useState(false);
    const [showHabitat8CatsUAV, setShowHabitat8CatsUAV] = useState(false);
  const [showHabitat3CatsUAV, setShowHabitat3CatsUAV] = useState(false);
  const [showElevationSRTM, setShowElevationSRTM] = useState(false);
  const [showSlopeSRTM, setShowSlopeSRTM] = useState(false);
  const [showCanopyHeight, setShowCanopyHeight] = useState(false);
  const [showHabitat3CatsRS, setShowHabitat3CatsRS] = useState(false);
  const [showHabitat8CatsRS, setShowHabitat8CatsRS] = useState(false);
  const [showOrthomosaic, setShowOrthomosaic] = useState(false);
  const [updateDSMLayer, setUpdateDSMLayer] = useState<any>(null);
  const [showDSMControls, setShowDSMControls] = useState(false);
  const [activeTopBar, setActiveTopBar] = useState('blank');

    const handleHabitatsChange = (checked: CheckedState) => {
    setShowHabitats(checked === true);
  };

  const handleDSMChange = (checked: boolean) => {
    setShowDSM(checked);
    setShowDSMControls(checked);
    setActiveTopBar(checked ? 'dsm' : 'blank');
  };

  const handleHabitat8CatsUAVChange = (checked: CheckedState) => {
    setShowHabitat8CatsUAV(checked === true);
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


  const handleCrownsChange = (checked: boolean) => {
    setShowCrowns(checked);
    setActiveTopBar(checked ? 'crowns' : 'blank');
  };

  const handleOrthomosaicChange = (checked: boolean) => {
    setShowOrthomosaic(checked);
    setActiveTopBar(checked ? 'ortho' : 'blank');
  };
  const handleHabitat3CatsUAVChange = (checked: CheckedState) => {
    setShowHabitat3CatsUAV(checked === true);
  };

  const handleElevationSRTMChange = (checked: CheckedState) => {
    setShowElevationSRTM(checked === true);
  };

  const handleSlopeSRTMChange = (checked: CheckedState) => {
    setShowSlopeSRTM(checked === true);
  };

  const handleCanopyHeightChange = (checked: CheckedState) => {
    setShowCanopyHeight(checked === true);
  };

  const handleHabitat3CatsRSChange = (checked: CheckedState) => {
    setShowHabitat3CatsRS(checked === true);
  };

  const handleHabitat8CatsRSChange = (checked: CheckedState) => {
    setShowHabitat8CatsRS(checked === true);
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
              showHabitats={showHabitats}
              showDSM={showDSM}
              showHabitat8CatsUAV={showHabitat8CatsUAV}
              showHabitat3CatsUAV={showHabitat3CatsUAV}
              showElevationSRTM={showElevationSRTM}
              showSlopeSRTM={showSlopeSRTM}
              showCanopyHeight={showCanopyHeight}
              showHabitat3CatsRS={showHabitat3CatsRS}
              showHabitat8CatsRS={showHabitat8CatsRS}
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
        <div className="checkbox-item">
          <Checkbox id="show-canopy-height" checked={showCanopyHeight} onCheckedChange={handleCanopyHeightChange} />
          <label htmlFor="show-canopy-height" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Canopy Height
          </label>
        </div>
      </div>
    </AccordionContent>
  </AccordionItem>
  
  <AccordionItem value="item-2">
    <AccordionTrigger>Habitat Classification</AccordionTrigger>
    <AccordionContent>
      <div className="checkbox-container">
        <div className="checkbox-item">
          <Checkbox id="show-habitat-8-cats-uav" checked={showHabitat8CatsUAV} onCheckedChange={handleHabitat8CatsUAVChange} />
          <label htmlFor="show-habitat-8-cats-uav" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Habitat 8 Cats UAV
          </label>
        </div>
        <div className="checkbox-item">
          <Checkbox id="show-habitat-3-cats-uav" checked={showHabitat3CatsUAV} onCheckedChange={handleHabitat3CatsUAVChange} />
          <label htmlFor="show-habitat-3-cats-uav" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Habitat 3 Cats UAV
          </label>
        </div>
        <div className="checkbox-item">
          <Checkbox id="show-habitat-3-cats-rs" checked={showHabitat3CatsRS} onCheckedChange={handleHabitat3CatsRSChange} />
          <label htmlFor="show-habitat-3-cats-rs" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Habitat 3 Cats RS
          </label>
        </div>
        <div className="checkbox-item">
          <Checkbox id="show-habitat-8-cats-rs" checked={showHabitat8CatsRS} onCheckedChange={handleHabitat8CatsRSChange} />
          <label htmlFor="show-habitat-8-cats-rs" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Habitat 8 Cats RS
          </label>
        </div>
      </div>
    </AccordionContent>
  </AccordionItem>
  
  <AccordionItem value="item-3">
    <AccordionTrigger>Topographic Data</AccordionTrigger>
    <AccordionContent>
      <div className="checkbox-container">
        <div className="checkbox-item">
          <Checkbox id="show-elevation-srtm" checked={showElevationSRTM} onCheckedChange={handleElevationSRTMChange} />
          <label htmlFor="show-elevation-srtm" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Elevation SRTM
          </label>
        </div>
        <div className="checkbox-item">
          <Checkbox id="show-slope-srtm" checked={showSlopeSRTM} onCheckedChange={handleSlopeSRTMChange} />
          <label htmlFor="show-slope-srtm" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Slope SRTM
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