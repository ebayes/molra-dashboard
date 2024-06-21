import { RightPanel } from "@/components/Structure/RightPanel";
import TaskPage from "@/components/species/tablecomponent";

export default function SpeciesList() {
  return (
    <RightPanel>
      <div id="right-top" className="right-top">
        <h1>Species list</h1>
      </div>
      <div id="right-bottom" className="right-bottom">
        <TaskPage />
      </div>
    </RightPanel>
  );
}