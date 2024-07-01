import Insights from "@/components/insights/page";
import { TopBar } from "@/components/Structure/TopBar";

export default function Page() {
  return (
    <>
      <div className="w-full">
        <TopBar />
      </div>
      <div className="flex w-screen h-[calc(100vh-64px)]">
        <Insights/>
      </div>
    </>
  );
}