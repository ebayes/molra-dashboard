import { RightPanel } from "@/components/Structure/RightPanel";
import { ImageGrid } from "@/components/data/ImageComponent";
import { fetchData } from "@/utils/getSupabase";

export default async function AudioDataPage() {
  const audioData = await fetchData('audio');

  return (
    <RightPanel>
      <h1>Audio Data</h1>
      {audioData ? <ImageGrid images={audioData} /> : <div>Error loading audio data</div>}
    </RightPanel>
  );
}