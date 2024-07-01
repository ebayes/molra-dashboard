"use client"

import { RightPanel } from "@/components/Structure/RightPanel";
import { FilteredImageGrid } from "@/components/data/FilteredImageGrid";
import { ScrollArea } from "@/components/ui/scroll-area";
import TopBar from "@/components/data/top-bar";
import { useVisualData } from "@/components/context/VisualDataContext";

export function VisualDataContent() {
  const { filteredData, isLoading, error } = useVisualData();

  return (
    <RightPanel>
      <div className="flex flex-col h-full">
        <div className="flex py-[8px] px-[15px] items-center justify-between">
          <TopBar />
        </div>
        <ScrollArea className="flex-grow">
          <div className="px-[15px] pb-[15px]">
            {isLoading ? (
              <div>Loading...</div>
            ) : error ? (
              <div>Error: {error.message}</div>
            ) : filteredData && filteredData.length > 0 ? (
              <FilteredImageGrid data={filteredData} />
            ) : (
              <div>No data available. Try adjusting your filters or selecting a different site.</div>
            )}
          </div>
        </ScrollArea>
      </div>
    </RightPanel>
  );
}

export default function VisualDataContentWrapper() {
  return (
    <VisualDataContent />
  );
}