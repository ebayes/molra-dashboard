'use client'

import { RightPanel } from "@/components/Structure/RightPanel";
import { useState, useEffect } from "react";
import OpenLayersMap from "@/components/insights/olmap";
import { DemoHelloWorld } from "@/components/insights/components/luma";
import { LayersComponent } from "@/components/insights/components/layers";
import { useStudySubsite } from "@/components/context/siteContext";
import { useInsights } from "@/components/context/insightsContext";

export default function Insights() {
  const { selectedSubsite } = useStudySubsite();
  const { checkedInsights } = useInsights();
  const show3DModel = checkedInsights.includes("3d model");
  
  return (
    <RightPanel>
    
    <div className="flex flex-col h-full">
      <div id="right-bottom" className="right-bottom flex h-full p-[15px] gap-[15px]">
        
        <div id="chat-area" className="flex-grow flex flex-col">
        <div id="image-frame" className="flex-grow border rounded-lg overflow-hidden relative p-[14px] box-border h-full">
        {show3DModel ? <DemoHelloWorld /> : <OpenLayersMap />}
      </div>
        </div>
        <div id="right" className={`w-[250px] min-w-[250px] flex flex-col gap-1 justify-between`}> {/* ${isRightPanelVisible ? 'hidden lg:flex' : 'hidden'} */}
          <div id="top-title" className="flex gap-2 w-full">
            <div className="flex-grow pb-2">
              <div className="flex gap-1 w-full items-center bg-[#ECECF1] text-[#202123] font-semibold rounded-md text-sm h-[34px] py-2 justify-center">
                Layers
              </div> 
            </div>
          {/* 
            <div className="flex-shrink-0">
              <Button variant="secondary" size="icon" onClick={toggleRightPanel}>
                <PanelLeftOpen className="w-4 h-4" />
              </Button>
            </div>
            */}
            </div>
          <div id="annotations" className="flex-grow overflow-hidden relative">
          <LayersComponent />
          </div>
          <div id="bottom-buttons" className="pr-[8px]">
           
          </div>
        </div>
      </div>
    </div>
    </RightPanel>
  );
}