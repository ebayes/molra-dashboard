"use client"

import { ImageGrid } from "@/components/data/ImageComponent";
import { ImageType } from "@/types/Types";

export function FilteredImageGrid({ data }: { data: ImageType[] }) {
  console.log('FilteredImageGrid received data:', data); // Log received data
  return (
    <div className="w-full">
      <ImageGrid images={data} />
    </div>
  );
}