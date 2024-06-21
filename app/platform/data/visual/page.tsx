import { RightPanel } from "@/components/Structure/RightPanel";
import { ImageGrid } from "@/components/data/ImageComponent";
import { fetchData } from "@/utils/getSupabase";
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

export default async function VisualDataPage() {
  const visualData = await fetchData('visual');

  return (
    <RightPanel>
      <div id="right-top" className="right-top flex justify-between">
        <h1>Visual data</h1>
        <div className="flex gap-2">
          <Button>
            Add image
          </Button>
          <Button variant="primary">
            <Plus className="w-4 h-4 mr-2" />
            Add dataset
          </Button>
        </div>
      </div>
      <div id="right-bottom" className="right-bottom">
        <ScrollArea className="h-full w-full">
          <div id="chat-area" className="chat-area p-[15px]">
            {visualData ? <ImageGrid images={visualData} /> : <div>Error loading visual data</div>}
          </div>
        </ScrollArea>
      </div>
    </RightPanel>
  );
}