"use client"

import { useState, useEffect } from 'react';
import { fetchSites } from '@/utils/molra';
import { useStudySubsite } from "@/components/context/siteContext";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"

const parentIdToNameMap: { [key: string]: string } = {
  "b7af7c06-840e-4e82-89b6-004ff8266fae": "Rio Negro",
  "ef4ef5c2-9c3c-420e-b5ef-070daeafa758": "Balbina",
  "ea9985bf-746b-4efe-93e0-d9dfa40370b2": "Presidente",
  "f576474b-75f9-468e-873a-b41676c45978": "test-fish-sdm"
};

export function SiteSwitcher() {
  const [sites, setSites] = useState<any[]>([]);
  const [selectedParentId, setSelectedParentId] = useState<string | undefined>(undefined);
  const { selectedSubsite, setSelectedSubsite } = useStudySubsite();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSitesData() {
      try {
        const sitesData = await fetchSites();
        setSites(sitesData);
        if (sitesData.length > 0) {
          const firstParentId = sitesData.find((site: { parent_id: string | null }) => site.parent_id !== null && site.parent_id !== '').parent_id;
          setSelectedParentId(firstParentId);
          const defaultSubsite = "6897d432-459d-47b5-af07-cc2b9f67d16d";
          const subsiteExists = sitesData.some((site: { site_id: string }) => site.site_id === defaultSubsite);
          setSelectedSubsite(subsiteExists ? defaultSubsite : sitesData.find((site: { parent_id: string }) => site.parent_id === firstParentId).site_id);
        }
      } catch (error) {
        console.error('Error fetching sites:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchSitesData();
  }, []);

  const uniqueParentIds = Array.from(new Set(sites.map((site: { parent_id: string | null }) => site.parent_id).filter((parentId: string | null): parentId is string => parentId !== null && parentId !== '')));
  const filteredSites = selectedParentId ? sites.filter((site: { parent_id: string }) => site.parent_id === selectedParentId) : [];

  const handleParentChange = (parentId: string) => {
    setSelectedParentId(parentId);
    const firstSubsite = sites.find((site: { parent_id: string }) => site.parent_id === parentId)?.site_id;
    setSelectedSubsite(firstSubsite);
    console.log('Selected parent site ID:', parentId);
  };

  return (
    <div className="flex gap-1">
      <Select onValueChange={handleParentChange} value={selectedParentId}>
        <SelectTrigger>
          {loading ? <Skeleton className="h-4 w-full" /> : <SelectValue placeholder="Select study site" />}
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Select site</SelectLabel>
            {uniqueParentIds.map((parentId, index) => (
              <SelectItem key={index} value={parentId}>
                {parentIdToNameMap[parentId] || parentId}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      <Select 
        onValueChange={(value) => {
          setSelectedSubsite(value);
          console.log('Selected subsite ID:', value);
        }} 
        value={selectedSubsite || "6897d432-459d-47b5-af07-cc2b9f67d16d"}
      >
        <SelectTrigger>
          {loading ? <Skeleton className="h-4 w-full" /> : <SelectValue placeholder="Select study subsite" />}
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Subsites</SelectLabel>
            {filteredSites.map((site, index) => (
              <SelectItem key={index} value={site.site_id}>
                {site.site_name}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}