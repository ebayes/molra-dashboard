"use client"

import Image from "next/image";
import Link from "next/link";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Settings } from "lucide-react";
import { usePathname } from 'next/navigation';
import { SiteSwitcher } from "./getSites";

export function TopBar() {
  const pathname = usePathname();
  const pathSegments = pathname.split('/').filter(segment => segment !== '');

  const breadcrumbItems = pathSegments.slice(1).map((segment, index) => {
    const href = `./platform/${pathSegments.slice(1, index + 2).join('/')}`;
    const isLast = index === pathSegments.length - 2;
    const formattedSegment = segment.replace(/[-_]/g, ' ');
    const capitalizedSegment = formattedSegment
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');

    return (
      <BreadcrumbItem key={segment}>
        <BreadcrumbLink href={href}>{capitalizedSegment}</BreadcrumbLink>
        {!isLast && <BreadcrumbSeparator />}
      </BreadcrumbItem>
    );
  });

  return (
    <div id="top-bar" className="top-bar">
      <div className="flex items-center gap-[15px]">
        
      </div>
      <div className="flex items-center gap-2">
        <SiteSwitcher />
       
      </div>
    </div>
  );
}