"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MessagesSquare, CircleHelp, BarChart, Database, Pencil, List, Trophy, Gauge, Bot } from "lucide-react";
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ChevronDown, ChevronUp } from "lucide-react";
import React, { useEffect } from "react";
import { usePathname } from 'next/navigation';

interface LeftPanelProps {
  selectedTab: string;
  setSelectedTab: (tab: string) => void;
}

export function LeftPanel({ selectedTab, setSelectedTab }: LeftPanelProps) {
  const [modelsExpanded, setModelsExpanded] = React.useState(false);
  const [dataExpanded, setDataExpanded] = React.useState(false);
  const [hoveredTab, setHoveredTab] = React.useState<string | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    if (pathname.startsWith('/platform/models/')) {
      setModelsExpanded(true);
      if (pathname.includes('/playground')) {
        setSelectedTab("Models/Playground");
      } else if (pathname.includes('/list')) {
        setSelectedTab("Models/List");
      }
    } else if (pathname.startsWith('/platform/data/')) {
      setDataExpanded(true);
      if (pathname.includes('/visual')) {
        setSelectedTab("Data/Visual");
      } else if (pathname.includes('/audio')) {
        setSelectedTab("Data/Audio");
      }
    } else {
      const tab = pathname.split('/').pop();
      setSelectedTab(tab ? tab.charAt(0).toUpperCase() + tab.slice(1) : "Dashboard");
      setModelsExpanded(false);
      setDataExpanded(false);
    }
  }, [pathname, setSelectedTab]);

  const handleTabClick = (name: string) => {
    if (name === "Models") {
      setDataExpanded(false);
      setModelsExpanded(!modelsExpanded);
      if (!modelsExpanded) {
        setSelectedTab("Models/Playground");
      }
    } else if (name === "Data") {
      setModelsExpanded(false);
      setDataExpanded(!dataExpanded);
      if (!dataExpanded) {
        setSelectedTab("Data/Visual");
      }
    } else if (name.startsWith("Models/") || name.startsWith("Data/")) {
      setSelectedTab(name);
      setModelsExpanded(name.startsWith("Models/"));
      setDataExpanded(name.startsWith("Data/"));
    } else {
      setModelsExpanded(false);
      setDataExpanded(false);
      setSelectedTab(name);
    }
  };

  const topTabs = [
    { name: "Dashboard", icon: Gauge },
    { name: "Insights", icon: BarChart },
    { name: "Data", icon: Database },
    { name: "Models", icon: Bot },
    { name: "Annotate", icon: Pencil },
    { name: "Species List", icon: List },
    // { name: "Scoreboard", icon: Trophy },
  ];

  const bottomTabs = [
    { name: "Documentation", icon: MessagesSquare },
    { name: "Help", icon: CircleHelp }
  ];


  return (
    <div id="left-panel" className="left-panel">
      {/* Sidebar top */}
      <div id="sidebar-top" className="flex flex-col h-full overflow-hidden">
        <div id="sidebar-search" className="p-[10px] flex-shrink-0">
          <Input placeholder="Search" />
        </div>
        <div id="sidebar-nav" className="sidebar-section overflow-y-auto flex-grow">
        {topTabs.map(({ name, icon: Icon }) => (
          <React.Fragment key={name}>
            <Link 
              href={
                name === "Models" 
                  ? "/platform/models/playground" 
                  : name === "Data"
                  ? "/platform/data/visual"
                  : `/platform/${name.toLowerCase().replace(' ', '-')}`
              }
            >
              <Button
                variant={
                  (name === "Models" || name === "Data") && selectedTab.startsWith(`${name}/`)
                    ? "ghost2"
                    : selectedTab.startsWith(name)
                    ? "default"
                    : "ghost"
                }
                className="w-full relative"
                onClick={() => handleTabClick(name)}
                onMouseEnter={() => setHoveredTab(name)}
                onMouseLeave={() => setHoveredTab(null)}
              >
                <span className="relative z-10 flex items-center justify-between w-full">
                  <span className="flex items-center">
                    <Icon className="w-4 h-4 mr-3 inline" />
                    {name}
                  </span>
                  {(name === "Models" || name === "Data") && (
                    <>
                      {(name === "Models" ? modelsExpanded : dataExpanded) && <ChevronDown className="w-4 h-4 transition-transform duration-200"  />}
                      {!(name === "Models" ? modelsExpanded : dataExpanded) && hoveredTab === name && <ChevronUp className="w-4 h-4 transition-transform duration-200" />}
                    </>
                  )}
                </span>
                {selectedTab.startsWith(name) && name !== "Models" && name !== "Data" && (
                  <motion.span
                    layoutId="tab"
                    transition={{ type: 'spring', duration: 0.4 }}
                    className="absolute inset-0 z-0 rounded-md bg-[#ECECF1]"
                  ></motion.span>
                )}
              </Button>
            </Link>
            {name === "Models" && (modelsExpanded || selectedTab.startsWith("Models/")) && (
              <div className="ml-6 space-y-1">
    <Link href="/platform/models/playground">
      <Button
        variant={selectedTab === "Models/Playground" ? "default" : "ghost"}
        className="w-full text-sm relative"
        onClick={() => handleTabClick("Models/Playground")}
      >
        <span className="relative z-10">Playground</span>
        {selectedTab === "Models/Playground" && (
          <motion.span
            layoutId="tab"
            transition={{ type: 'spring', duration: 0.4 }}
            className="absolute inset-0 z-0 rounded-md bg-[#ECECF1]"
          ></motion.span>
        )}
      </Button>
    </Link>
    <Link href="/platform/models/list">
      <Button
        variant={selectedTab === "Models/List" ? "default" : "ghost"}
        className="w-full text-sm relative"
        onClick={() => handleTabClick("Models/List")}
      >
        <span className="relative z-10">List</span>
        {selectedTab === "Models/List" && (
          <motion.span
            layoutId="tab"
            transition={{ type: 'spring', duration: 0.4 }}
            className="absolute inset-0 z-0 rounded-md bg-[#ECECF1]"
          ></motion.span>
        )}
      </Button>
    </Link>
  </div>
)}
            {name === "Data" && (dataExpanded || selectedTab.startsWith("Data/")) && (
              <div className="ml-6 space-y-1">
                <Link href="/platform/data/visual">
                  <Button
                    variant={selectedTab === "Data/Visual" ? "default" : "ghost"}
                    className="w-full text-sm relative"
                    onClick={() => handleTabClick("Data/Visual")}
                  >
                    <span className="relative z-10">Visual</span>
                    {selectedTab === "Data/Visual" && (
                      <motion.span
                        layoutId="tab"
                        transition={{ type: 'spring', duration: 0.4 }}
                        className="absolute inset-0 z-0 rounded-md bg-[#ECECF1]"
                      ></motion.span>
                    )}
                  </Button>
                </Link>
                <Link href="/platform/data/audio">
          <Button
            variant={selectedTab === "Data/Audio" ? "default" : "ghost"}
            className="w-full text-sm relative"
            onClick={() => handleTabClick("Data/Audio")}
          >
            <span className="relative z-10">Audio</span>
            {selectedTab === "Data/Audio" && (
              <motion.span
                layoutId="tab"
                transition={{ type: 'spring', duration: 0.4 }}
                className="absolute inset-0 z-0 rounded-md bg-[#ECECF1]"
              ></motion.span>
            )}
          </Button>
        </Link>
      </div>
    )}
  </React.Fragment>
))}
        </div>
      </div>
      {/* Sidebar bottom */}
      <div id="sidebar-bottom" className="sidebar-section border-t border-[hsl(var(--border-color))] flex-shrink-0">
        {bottomTabs.map(({ name, icon: Icon }) => (
          <Link href={`/platform/${name.toLowerCase().replace(' ', '-')}`} key={name}>
            <Button
              variant={selectedTab === name ? "default" : "ghost"}
              className="w-full relative"
              onClick={() => handleTabClick(name)}
            >
              <span className="relative z-10 flex items-center">
                <Icon className="w-4 h-4 mr-2 inline" />
                {name}
              </span>
              {selectedTab === name && (
                <motion.span
                  layoutId="tab"
                  transition={{ type: 'spring', duration: 0.4 }}
                  className="absolute inset-0 z-0 rounded-md bg-[#ECECF1]"
                ></motion.span>
              )}
            </Button>
          </Link>
        ))}
      </div>
    </div>
  );
}