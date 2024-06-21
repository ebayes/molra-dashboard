import { createClient } from '@/utils/supabase/server';

export async function fetchData(modality?: string) {
  const supabase = createClient();

  let query = supabase
    .from('data')
    .select('id, source_url, modality, detections, expert_identified')
    .order('id');

  if (modality) {
    query = query.eq('modality', modality);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching data:', error);
    return null;
  }

  return data.map((item) => ({
    id: item.id,
    href: '#',
    image_url: item.source_url,
    detections: item.detections ? JSON.parse(item.detections) : [],
    expert_identified: item.expert_identified,
  }));
}