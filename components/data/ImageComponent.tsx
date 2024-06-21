"use client"

import Image from 'next/image';
import { useState } from 'react';
import { Badge } from "@/components/ui/badge"
import { Flower, Leaf, Tag, Sprout, TreePalm, Grape } from 'lucide-react';
import { TaxaBadge } from '@/components/ui/taxabadge';

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

type Image = {
  id: number;
  href: string;
  image_url: string;
  expert_identified: boolean;
  detections: any;
};

function BlurImage({ image }: { image: Image }) {
  const [isLoading, setLoading] = useState(true);

  const countTaxa = (detections: any[]) => {
    const taxaCounts: { [key: string]: number } = {};
    detections.forEach(detection => {
      if (detection.taxa) {
        taxaCounts[detection.taxa] = (taxaCounts[detection.taxa] || 0) + 1;
      }
    });
    return taxaCounts;
  };

  const taxaCounts = Array.isArray(image.detections) ? countTaxa(image.detections) : {};
  const hasDetections = Object.keys(taxaCounts).length > 0;

  return (
    <a href={image.href} className="group">
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
            <div className={`w-2 h-2 rounded-full ${
              !hasDetections ? 'bg-[#EE0000]' : 
              image.expert_identified ? 'bg-[#F9AB00]' : 'bg-[#5BB974]'
            }`}></div>
          </div>
        </div>
        <div className="flex justify-between mt-1">
          <div className='flex gap-1'>
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
    </a>
  );
}

export function ImageGrid({ images }: { images: Image[] }) {
  return (
    <div className="grid grid-cols-1 gap-y-[15px] sm:grid-cols-2 gap-x-[15px] lg:grid-cols-3 xl:grid-cols-5 xl:gap-x-[15px]">
      {images.map((image) => (
        <BlurImage key={image.id} image={image} />
      ))}
    </div>
  );
}