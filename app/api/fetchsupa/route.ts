import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const siteId = searchParams.get('siteId');
  const modality = 'visual'; // Hardcoded for this example

  console.log('API called with siteId:', siteId);

  const supabase = createClient();

  let query = supabase
    .from('data')
    .select('id, source_url, modality, detections, expert_identified, site_id, observation_id, width, height, annotations, chat')
    .eq('modality', modality)
    .order('id');

  if (siteId) {
    query = query.eq('site_id', siteId);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Supabase error:', error);
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }

  console.log('Data fetched from Supabase:', data.length, 'items');

  const formattedData = data.map((item) => ({
    id: item.id,
    href: '#',
    image_url: item.source_url,
    detections: item.detections ? JSON.parse(item.detections) : [],
    annotations: item.annotations ? JSON.parse(item.annotations) : [],
    chat: item.chat ? JSON.parse(item.chat) : [],
    expert_identified: item.expert_identified,
    site_id: item.site_id,
    observation_id: item.observation_id, 
    width: item.width,
    height: item.height,
  }));

  return NextResponse.json(formattedData);
}