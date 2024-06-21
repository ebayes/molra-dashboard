"use client"

import React from "react";
import { Button } from "@/components/ui/button";
import { PanelRightClose, GripVertical, Crosshair } from "lucide-react";
import { useState, useCallback, useRef } from "react";
import { RightPanel } from "@/components/Structure/RightPanel";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { accordionData } from "@/data/accordion";
import ReactFlow, { ReactFlowProvider, addEdge, useNodesState, useEdgesState, Controls, useReactFlow } from 'reactflow';
import 'reactflow/dist/style.css';

interface DraggableItemProps {
  type: string;
  icon: React.ElementType;
  label: string;
  onDragStart: (event: React.DragEvent<HTMLDivElement>, type: string) => void;
}

const DraggableItem: React.FC<DraggableItemProps> = ({ type, icon: Icon, label, onDragStart }) => (
  <div
    className="dndnode flex items-center w-full justify-between inline-flex items-center justify-start whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-[#ECECF1]/70 hover:text-[#202123] text-[#6E6E80] h-[34px] px-3 py-2"
    onDragStart={(event) => onDragStart(event, type)}
    draggable
  >
    <div>
      <Icon className="w-4 h-4 mr-3 inline" />
      {label}
    </div>
    <GripVertical className="w-4 h-4 inline" />
  </div>
);

interface SideButtonProps {
  id: string;
  icon: React.ElementType;
  label: string;
  onDragStart: (event: React.DragEvent<HTMLDivElement>, type: string) => void;
}

const SideButton: React.FC<SideButtonProps> = ({ id, icon, label, onDragStart }) => (
  <DraggableItem type={id} icon={icon} label={label} onDragStart={onDragStart} />
);

const Sidebar: React.FC = () => {
  const onDragStart = (event: React.DragEvent<HTMLDivElement>, nodeType: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };
  
  let id = 0;
  const getId = () => `dndnode_${id++}`;
  
  const getIcon = (IconComponent: React.ElementType, className: string) => <IconComponent className={className} />;

  return (
    <aside>
      <div id="right" className="w-[215px] py-[8px] pr-[8px] flex flex-col gap-1 justify-between">
        <div id="top-title" className="flex pb-[12px] gap-2 w-full">
          <div className="flex-grow">
            <Button variant="secondary" className="flex w-full justify-center">
              Components
            </Button>
          </div>
          <div className="flex-shrink-0">
            <Button variant="ghost2" size="icon">
              <PanelRightClose className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div id="image-frame" className="flex-grow overflow-hidden relative">
          <div className="relative w-full h-full flex flex-col gap-1">
            <Accordion type="multiple" defaultValue={accordionData.map(item => item.value)}>
              {accordionData.map(({ value, title, color, icon, buttons }) => (
                <AccordionItem key={value} value={value}>
                  <AccordionTrigger icon={getIcon(icon.component, icon.className)} color={color}>
                    {title}
                  </AccordionTrigger>
                  <AccordionContent className="flex flex-col gap-2 pt-1">
                    {buttons.map(({ id, icon, label }) => (
                      <SideButton key={id} id={id} icon={icon.component} label={label} onDragStart={onDragStart} />
                    ))}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;