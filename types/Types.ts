export interface ChatMessage {
  message: string;
  time: string;
  who: string;
  type: "annotation" | "comment";
  reaction?: string;
}

export interface Detection {
  taxa: string;
  bbox: number[];
  confidence: number[];
  labels: string[][];
}

export interface EnhancedDetection extends Detection {
  confirmed: boolean;
  level: "species" | "genus" | "family";
  value: string;
  expert: string;
  time: string;
  taxa: string;
  filterTaxa: string;
}

export type ImageType = {
  id: number;
  href: string;
  image_url: string;
  expert_identified: boolean;
  detections: Detection[];
  annotations: any;
  observation_id: string; 
  chat: ChatMessage[];
  site_id: string;
  width: number;
  height: number;
};

export interface Species {
  id: number;
  site_id: string;
  species_id: string;
  scientificname: string;
  taxa: string;
  rel_prob_occ: number;
  checked: boolean | null;
  disabled: boolean | null;
  species_url: string | null;
  commonname: string | null;
  common: string | null;
  family_common: string | null;
  level2: boolean | null;
  sequence_id: number | null;
  taxonomic_level: string;
  genus: string;
  removed: boolean | null;
  family: string | null;
  labels: {
    species: string;
    [key: string]: string;
  };
  read: boolean;
  likelihood: number;
}