import { Button } from "@/components/ui/button";
import { PanelLeftClose } from "lucide-react";

interface BlankTopBarProps {
  toggleRightPanel: () => void;
  isRightPanelVisible: boolean;
}

export default function BlankTopBar({ toggleRightPanel, isRightPanelVisible }: BlankTopBarProps) {
  return (
    <div id="top-bar" className='flex w-full items-center justify-end pb-[8px] h-[40px]'>
      <div className="flex items-center gap-2">
      <Button 
            size="icon" 
            onClick={toggleRightPanel} 
            className={`${!isRightPanelVisible ? 'flex' : 'hidden'}`}
          >
            <PanelLeftClose className="w-4 h-4" />
          </Button>
      </div>
    </div>
  );
}