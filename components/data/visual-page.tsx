'use client'

import { useState, useEffect } from 'react';
import { StudySubsiteProvider, useStudySubsite } from "@/components/context/siteContext";
import { RightPanel } from "@/components/Structure/RightPanel";
import { ImageGrid } from "@/components/data/ImageComponent";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SiteSwitcher } from "@/components/Structure/getSites";
import TopBar from "@/components/data/top-bar";
import { ImageType } from '@/types/Types';

interface VisualDataContentProps {
  initialData: ImageType[];
}

function VisualDataContent({ initialData }: { initialData: ImageType[] }) {
  const [visualData, setVisualData] = useState<ImageType[]>(initialData);
  const { selectedSubsite } = useStudySubsite();

  useEffect(() => {
    async function fetchData() {
      if (selectedSubsite) {
        try {
          const response = await fetch(`/api/fetchsupa?siteId=${selectedSubsite}`);
          if (!response.ok) {
            throw new Error('Failed to fetch data');
          }
          const newData: ImageType[] = await response.json(); 
          setVisualData(newData);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      }
    }
    fetchData();
  }, [selectedSubsite]);

  return (
    <RightPanel>
      <div id="right-top" className="right-top flex justify-between">
        <h1>Images</h1>
        <div className="flex gap-2">
          <SiteSwitcher />
        </div>
      </div>
      <div id="right-bottom" className="right-bottom">
        <div id="chat-area" className="chat-area px-[15px] pb-[15px]">
          <div id="top-buttons" className="flex py-[8px] items-center justify-between">
            <TopBar />
          </div>
          <ScrollArea className="h-full w-full">
            {visualData ? <ImageGrid images={visualData} /> : <div>Loading visual data...</div>}
          </ScrollArea>
        </div>
      </div>
    </RightPanel>
  );
}

export default function VisualDataPage() {
  const [visualData, setVisualData] = useState<ImageType[] | null>(null);

  useEffect(() => {
    async function loadInitialData() {
      try {
        const response = await fetch('/api/fetchsupa?type=visual');
        if (!response.ok) {
          throw new Error('Failed to fetch initial data');
        }
        const data: ImageType[] = await response.json();
        setVisualData(data);
      } catch (error) {
        console.error('Error fetching initial data:', error);
        setVisualData([]); 
      }
    }
    loadInitialData();
  }, []);

  return (
    <StudySubsiteProvider>
      {visualData ? <VisualDataContent initialData={visualData} /> : <div>Loading...</div>}
    </StudySubsiteProvider>
  );
}