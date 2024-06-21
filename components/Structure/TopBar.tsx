import Image from "next/image";
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

export function TopBar() {
  return (
    <div id="top-bar" className="top-bar">
      <div className="flex items-center gap-[15px]">
        <Image src="/canopy.svg" alt="Canopy logo" width={25} height={25} />
        <Breadcrumb>
  <BreadcrumbList>
    <BreadcrumbItem>
      <BreadcrumbLink href="/components">Annotate</BreadcrumbLink>
    </BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem>
      <BreadcrumbPage>DJI_916.jpg</BreadcrumbPage>
    </BreadcrumbItem>
  </BreadcrumbList>
</Breadcrumb>

      </div>
      <div className="flex items-center gap-1">
        <Button variant="ghost">
          <Settings className="w-4 h-4" />
        </Button>
        <Avatar>
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
      </div>
    </div>
  );
}