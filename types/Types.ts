export interface Image {
  id: number;
  href: string;
  image_url: string;
  assigned: string;
  expert_identified: boolean;
  height: number;
  modality: string;
  modality2: string;
  width: number;
  detections: any;
}