import { RightPanel } from "@/components/Structure/RightPanel";
import { ImageGrid } from "@/components/data/ImageComponent";
import { fetchData } from '@/utils/getSupabase';

export default async function DataPage() {
  const allData = await fetchData();

  return (
    <RightPanel>
      <h1>All Data</h1>
      {allData ? <ImageGrid images={allData} /> : <div>Error loading data</div>}
    </RightPanel>
  );
}