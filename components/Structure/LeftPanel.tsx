"use client";

import { Input } from "@/components/ui/search-bar";
import { Button } from "@/components/ui/button";
import { BarChart, Database, Pencil, List, Trophy, Gauge, Bot, Settings, LifeBuoy, PanelLeftOpen, PanelLeftClose, Search } from "lucide-react";
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
  const [annotateExpanded, setAnnotateExpanded] = React.useState(false);
  const [hoveredTab, setHoveredTab] = React.useState<string | null>(null);
  const [isPanelVisible, setIsPanelVisible] = React.useState(true);
  const pathname = usePathname();

  const togglePanel = () => {
    setIsPanelVisible(!isPanelVisible);
  };


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
      if (pathname.includes('/image')) {
        setSelectedTab("Data/Image");
      } else if (pathname.includes('/audio')) {
        setSelectedTab("Data/Audio");
      }
    } 
    else if (pathname.startsWith('/platform/annotate/')) {
      setAnnotateExpanded(true);
      setSelectedTab("Annotate");
    }
    if (pathname.startsWith('/platform/annotate/')) {
      setAnnotateExpanded(true);
      if (pathname.includes('/image')) {
        setSelectedTab("Annotate/Image");
      } else if (pathname.includes('/audio')) {
        setSelectedTab("Annotate/Audio");
      } else if (pathname.includes('/aerial')) {
        setSelectedTab("Annotate/Aerial");
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
      setAnnotateExpanded(false);
      setModelsExpanded(!modelsExpanded);
      if (!modelsExpanded) {
        setSelectedTab("Models/Playground");
      } else {
        setSelectedTab("Models");
      }
    } else if (name === "Data") {
      setModelsExpanded(false);
      setAnnotateExpanded(false);
      setDataExpanded(!dataExpanded);
      if (!dataExpanded) {
        setSelectedTab("Data/Image");
      } else {
        setSelectedTab("Data");
      }
    } else if (name === "Annotate") {
      setModelsExpanded(false);
      setDataExpanded(false);
      setAnnotateExpanded(!annotateExpanded);
      if (!annotateExpanded) {
        setSelectedTab("Annotate/Image");
      } else {
        setSelectedTab("Annotate");
      }
    } else if (name.startsWith("Models/") || name.startsWith("Data/") || name.startsWith("Annotate/")) {
      setSelectedTab(name);
      setModelsExpanded(name.startsWith("Models/"));
      setDataExpanded(name.startsWith("Data/"));
      setAnnotateExpanded(name.startsWith("Annotate/"));
    } else {
      setModelsExpanded(false);
      setDataExpanded(false);
      setAnnotateExpanded(false);
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
    { name: "Documentation", icon: LifeBuoy },
    { name: "Settings", icon: Settings }
  ];


  return (
    <>
    <div id="left-panel-small" className={`left-panel-small ${isPanelVisible ? 'lg:hidden flex' : 'hidden'} flex-col h-full`}>
      {/* Sidebar top */}
      <div id="sidebar-top" className="flex flex-col h-full overflow-hidden">
        <div id="sidebar-search" className="flex p-[10px] gap-2">
          <Button variant="ghost" size="icon">
            <Search className="w-4 h-4" />
          </Button>
        </div>
        <div id="sidebar-nav" className="sidebar-section overflow-y-auto flex-grow">
        {topTabs.map(({ name, icon: Icon }) => (
          <React.Fragment key={name}>
            <Link 
              href={
                name === "Models" 
                  ? "/platform/models/playground" 
                  : name === "Data"
                  ? "/platform/data/image"
                  : name === "Annotate"
                  ? "/platform/annotate/image"
                  : `/platform/${name.toLowerCase().replace(' ', '-')}`
              }
            >
              <Button
                size="icon"
                variant={
                  (name === "Models" || name === "Data" || name === "Annotate") && selectedTab.startsWith(`${name}/`)
                    ? "ghost2"
                    : selectedTab.startsWith(name)
                    ? "default"
                    : "ghost"
                }
                className="w-full relative"
                onClick={() => handleTabClick(name)}
              >
                <Icon className="w-4 h-4" />
              </Button>
            </Link>
            {/* Submenus are not included in the small panel for simplicity */}
          </React.Fragment>
        ))}
        </div>
      </div>
      {/* Sidebar bottom */}
      <div id="sidebar-bottom" className="sidebar-section border-t border-[hsl(var(--border-color))] flex-shrink-0">
        {bottomTabs.map(({ name, icon: Icon }) => (
          <Link href={`/platform/${name.toLowerCase().replace(' ', '-')}`} key={name}>
            <Button
              size="icon"
              variant={selectedTab === name ? "default" : "ghost"}
              className="w-full relative"
              onClick={() => handleTabClick(name)}
            >
              <Icon className="w-4 h-4" />
            </Button>
          </Link>
        ))}
      </div>
    </div>
    <div id="left-panel" className={`left-panel ${isPanelVisible ? 'hidden lg:flex' : 'hidden'}`}>
      {/* Sidebar top */}
      <div id="sidebar-top" className="flex flex-col h-full overflow-hidden">
        <div id="sidebar-search" className="flex p-[10px] gap-2">
          <div>
            {/* 
        <Button size="icon" className="hidden xl:flex">
                <PanelLeftClose className="w-4 h-4" onClick={togglePanel}/>
              </Button>
              */}
              </div>
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
                  ? "/platform/data/image"
                  : name === "Annotate"
                  ? "/platform/annotate/image"
                  : `/platform/${name.toLowerCase().replace(' ', '-')}`
              }
            >
              <Button
                variant={
                  (name === "Models" || name === "Data" || name === "Annotate") && selectedTab.startsWith(`${name}/`)
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
                  {(name === "Models" || name === "Data" || name === "Annotate") && (
                    <>
                      {(name === "Models" ? modelsExpanded : name === "Data" ? dataExpanded : annotateExpanded) && <ChevronDown className="w-4 h-4 transition-transform duration-200"  />}
                      {!(name === "Models" ? modelsExpanded : name === "Data" ? dataExpanded : annotateExpanded) && hoveredTab === name && <ChevronUp className="w-4 h-4 transition-transform duration-200" />}
                    </>
                  )}
                </span>
                {selectedTab.startsWith(name) && name !== "Models" && name !== "Data" && name !== "Annotate" && (
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
                <Link href="/platform/data/image">
                  <Button
                    variant={selectedTab === "Data/Image" ? "default" : "ghost"}
                    className="w-full text-sm relative"
                    onClick={() => handleTabClick("Data/Image")}
                  >
                    <span className="relative z-10">Image</span>
                    {selectedTab === "Data/Image" && (
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
                {name === "Annotate" && (annotateExpanded || selectedTab.startsWith("Annotate/")) && (
              <div className="ml-6 space-y-1">
                {["Image", "Audio", "Aerial"].map((subTab) => (
                  <Link href={`/platform/annotate/${subTab.toLowerCase()}`} key={subTab}>
                    <Button
                      variant={selectedTab === `Annotate/${subTab}` ? "default" : "ghost"}
                      className="w-full text-sm relative"
                      onClick={() => handleTabClick(`Annotate/${subTab}`)}
                    >
                      <span className="relative z-10">{subTab}</span>
                      {selectedTab === `Annotate/${subTab}` && (
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
    </>
  );
}