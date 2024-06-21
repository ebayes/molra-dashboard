import { RightPanel } from "@/components/Structure/RightPanel";
import { AreaChartHero } from "@/components/dashboard/dashboard";

export default function Dashboard() {
  return (
    <RightPanel>
      <div id="right-top" className="right-top">
        <h1>Dashboard</h1>
      </div>
      <div id="right-bottom" className="right-bottom">
        
        <div id="chat-area" className="chat-area">
        <AreaChartHero/>
        </div>
        
      </div>
    </RightPanel>
  );
}