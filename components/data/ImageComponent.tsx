"use client"

import Image from 'next/image';
import { useState } from 'react';
import { Badge } from "@/components/ui/badge"
import { Flower, Leaf, Tag, Sprout, TreePalm, Grape } from 'lucide-react';
import { TaxaBadge } from '@/components/ui/taxabadge';
import { getThumbnail } from '@/utils/molra';
import { ImageType } from '@/types/Types';
import { useStudySubsite } from "@/components/context/siteContext";
import { useVisualData } from "@/components/context/VisualDataContext";
import { Checkbox } from "@/components/ui/checkbox"
import { useRouter } from 'next/navigation';

const shimmer = (w: number, h: number) => `
<svg width="${w}" height="${h}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    <linearGradient id="g">
      <stop stop-color="#333" offset="20%" />
      <stop stop-color="#222" offset="50%" />
      <stop stop-color="#333" offset="70%" />
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="#333" />
  <rect id="r" width="${w}" height="${h}" fill="url(#g)" />
  <animate xlink:href="#r" attributeName="x" from="-${w}" to="${w}" dur="1s" repeatCount="indefinite"  />
</svg>`

const toBase64 = (str: string) =>
  typeof window === 'undefined'
    ? Buffer.from(str).toString('base64')
    : window.btoa(str)
    
function cn(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

function BlurImage({ image, index }: { image: ImageType; index: number }) {
  const [isLoading, setLoading] = useState(true);
  const { selectedSubsite } = useStudySubsite();
  const { currentIndex } = useVisualData();
  const router = useRouter();

  const handleImageClick = (e: React.MouseEvent) => {
    e.preventDefault();
    router.push(`/platform/annotate/image#site=${selectedSubsite}&index=${index}`);
  };

  const countTaxa = (detections: any[]) => {
    const taxaCounts: { [key: string]: number } = {};
    detections.forEach(detection => {
      if (detection.labels && detection.labels.length > 0) {
        if (detection.taxa) {
          taxaCounts[detection.taxa] = (taxaCounts[detection.taxa] || 0) + 1;
        } else {
          taxaCounts['unknown'] = (taxaCounts['unknown'] || 0) + 1;
        }
      } else {
        taxaCounts['unknown'] = (taxaCounts['unknown'] || 0) + 1;
      }
    });
    return taxaCounts;
  };

  const taxaCounts = Array.isArray(image.detections) ? countTaxa(image.detections) : {};
  const hasDetections = Object.keys(taxaCounts).length > 0;

  return (
    <div onClick={handleImageClick} className="group cursor-pointer">
      <div className="flex flex-col">
        <div className="aspect-w-16 aspect-h-9 w-full overflow-hidden rounded-lg bg-gray-200 border border-[#ECECF1] relative">
          <Image
            alt=""
            src={image.image_url}
            layout="fill"
            objectFit="cover"
            placeholder="blur"
            blurDataURL={`data:image/svg+xml;base64,${toBase64(shimmer(1600, 900))}`}
            className={cn(
              'duration-700 ease-in-out group-hover:opacity-75',
              isLoading
                ? 'scale-110 blur-2xl grayscale'
                : 'scale-100 blur-0 grayscale-0'
            )}
            onLoadingComplete={() => setLoading(false)}
          />
          <div className="absolute inset-0 flex items-start justify-end p-2">
            {/* 
            <div className={`w-2 h-2 rounded-full ${
              !hasDetections ? 'bg-[#EE0000]' : 
              image.expert_identified ? 'bg-[#F9AB00]' : 'bg-[#5BB974]'
            }`}></div>
            */}
          </div>
        </div>
        <div className="flex justify-between items-center mt-1.5">
        <Checkbox />

          <div className='flex gap-1 items-center '>
          {hasDetections ? (
              Object.entries(taxaCounts).map(([taxa, count]) => (
                <TaxaBadge key={taxa} taxa={taxa} count={count} />
              ))
            ) : (
              <Badge variant="gray" className='flex gap-1'>
                <Tag className="w-3 h-3 text-[#8A8AA3]" />
                0
              </Badge>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export function ImageGrid({ images }: { images: ImageType[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 w-full">
      {images.map((image, index) => (
        <div key={image.id} className="w-full min-w-[200px]">
          <BlurImage image={image} index={index} />
        </div>
      ))}
    </div>
  );
}