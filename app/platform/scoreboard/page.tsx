import { RightPanel } from "@/components/Structure/RightPanel";

export default function Scoreboard() {
  return (
    <RightPanel>
      <div id="right-top" className="right-top">
        <h1>Scoreboard</h1>
      </div>
      <div id="right-bottom" className="right-bottom">
        {/* Add dashboard content */}
      </div>
    </RightPanel>
  );
}