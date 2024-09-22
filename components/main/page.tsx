"use client"

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { PanelLeftOpen, Download } from "lucide-react";
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
import Image from 'next/image';
import { Badge } from "@/components/ui/badge";
import { Ruler, Diameter } from "lucide-react";

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
  const [showOrthomosaic, setShowOrthomosaic] = useState(true);
  const [updateDSMLayer, setUpdateDSMLayer] = useState<any>(null);
  const [showDSMControls, setShowDSMControls] = useState(false);
  const [activeTopBar, setActiveTopBar] = useState('ortho');
  const [showSiteBoundary, setShowSiteBoundary] = useState(true);
  const [activeHistogram, setActiveHistogram] = useState<string | null>(null);
  const [selectedMetric, setSelectedMetric] = useState<string | null>(null);
  const [selectedCrownType, setSelectedCrownType] = useState<'all' | 'cecropia' | 'fallen' | 'flowering' | 'palms'>('all');

  const handleSiteBoundaryChange = (checked: boolean) => {
    setShowSiteBoundary(checked);
  };

  const handleHistogramToggle = (type: string | null) => {
    if (!selectedCrownType) return;

    const crownTypePrefix = selectedCrownType === 'all' ? 'all' : 
                            selectedCrownType === 'palms' ? 'palm' :
                            selectedCrownType === 'flowering' ? 'flowering' :
                            selectedCrownType === 'cecropia' ? 'cecropia' : null;

    if (!crownTypePrefix) {
      setActiveHistogram(null);
      return;
    }

    if (type === 'tree_height') {
      setActiveHistogram(activeHistogram === `${crownTypePrefix}_height_histogram` ? null : `${crownTypePrefix}_height_histogram`);
    } else if (type === 'crown_diameter') {
      setActiveHistogram(activeHistogram === `${crownTypePrefix}_diameter_histogram` ? null : `${crownTypePrefix}_diameter_histogram`);
    } else {
      setActiveHistogram(null);
    }
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

  const handleCrownsChange = (checked: CheckedState, crownType: 'all' | 'cecropia' | 'fallen' | 'flowering' | 'palms') => {
    setShowCrowns(checked === true);
    setSelectedCrownType(crownType);
    setActiveTopBar(checked === true ? 'crowns' : 'blank');
    
    // Hide the histogram whenever the checkbox changes
    setActiveHistogram(null);
  
    if (checked === true) {
      switch (crownType) {
        case 'all':
          setAvgHeight(31.66);
          setAvgDiameter(9.3);
          break;
        case 'palms':
          setAvgHeight(31.77);
          setAvgDiameter(7.91);
          break;
        case 'flowering':
          setAvgHeight(33.96);
          setAvgDiameter(10.34);
          break;
        case 'cecropia':
          setAvgHeight(36.18);
          setAvgDiameter(8.95);
          break;
        case 'fallen':
          setAvgHeight(0);
          setAvgDiameter(0);
          break;
      }
    } else {
      // Reset values when unchecked
      setAvgHeight(0);
      setAvgDiameter(0);
    }
  };

  const handleOrthomosaicChange = (checked: boolean) => {
    setShowOrthomosaic(checked);
    setActiveTopBar(checked ? 'ortho' : 'blank');
  };

  const handleMetricToggle = (metric: string) => {
    setSelectedMetric(selectedMetric === metric ? null : metric);
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
              onHistogramToggle={handleHistogramToggle}
              onMetricToggle={handleMetricToggle}
              selectedMetric={selectedMetric}        
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
  showDSM={showDSM}
  showSiteBoundary={showSiteBoundary}
  showOrthomosaic={showOrthomosaic}
  onDSMControlChange={handleDSMControlChange}
  onDSMLayerUpdate={handleDSMLayerUpdate}
  selectedMetric={selectedMetric}
  selectedCrownType={selectedCrownType}
/>
  {activeHistogram && (
    <div className="absolute bottom-4 left-4 w-80 h-48 z-10">
      <Image
        src={`/histograms/${activeHistogram}.png`}
        alt={`${activeHistogram}`}
        layout="fill"
        objectFit="contain"
      />
      <Button
        variant="secondary"
        size="sm"
        className="absolute top-2 right-2 z-20"
        onClick={() => {
        const link = document.createElement('a');
        link.href = `/histograms/${activeHistogram}.png`;
        link.download = `${activeHistogram}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }}
    >
      <Download className="w-4 h-4 mr-1" />
      Download
    </Button>
  </div>
)}
        {showCrowns && !activeHistogram && (
          <div className="absolute top-4 left-4 bg-white bg-opacity-50 p-2 rounded-md z-10 max-w-[200px] items-center justify-center">
            <p className="text-sm text-center">
              Click the <Badge variant="secondary"><Ruler className="h-4 w-4" />Height</Badge> or <Badge variant="secondary"><Diameter className="h-4 w-4" />Diameter</Badge> buttons above to display/download histograms.<br/><br/> You can also hover/click bounding boxes to view individual tree metadata.
            </p>
          </div>
        )}
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
      <Checkbox 
  id="show-orthomosaic" 
        defaultChecked={true} 
        checked={showOrthomosaic} 
        onCheckedChange={handleOrthomosaicChange} 
      />
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
      <AccordionTrigger>Tree crowns</AccordionTrigger>
      <AccordionContent>
        <div className="checkbox-container">
          <div className="checkbox-item">
            <Checkbox 
              id="show-all-crowns" 
              checked={showCrowns && selectedCrownType === 'all'} 
              onCheckedChange={(checked) => handleCrownsChange(checked, 'all')} 
            />
            <label htmlFor="show-all-crowns" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              All Crowns
            </label>
          </div>
          <div className="checkbox-item">
            <Checkbox 
              id="show-cecropia-crowns" 
              checked={showCrowns && selectedCrownType === 'cecropia'} 
              onCheckedChange={(checked) => handleCrownsChange(checked, 'cecropia')} 
            />
            <label htmlFor="show-cecropia-crowns" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Cecropia Crowns
            </label>
          </div>
          <div className="checkbox-item">
            <Checkbox 
              id="show-fallen-crowns" 
              checked={showCrowns && selectedCrownType === 'fallen'} 
              onCheckedChange={(checked) => handleCrownsChange(checked, 'fallen')} 
            />
            <label htmlFor="show-fallen-crowns" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Fallen Trees
            </label>
          </div>
          <div className="checkbox-item">
            <Checkbox 
              id="show-flowering-crowns" 
              checked={showCrowns && selectedCrownType === 'flowering'} 
              onCheckedChange={(checked) => handleCrownsChange(checked, 'flowering')} 
            />
            <label htmlFor="show-flowering-crowns" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Flowering Canopy
            </label>
          </div>
          <div className="checkbox-item">
            <Checkbox 
              id="show-palm-crowns" 
              checked={showCrowns && selectedCrownType === 'palms'} 
              onCheckedChange={(checked) => handleCrownsChange(checked, 'palms')} 
            />
            <label htmlFor="show-palm-crowns" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Pinnately Leaved Palms
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