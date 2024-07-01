import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const supabase = createClient();

  const { data: { user } } = await supabase.auth.getUser()

  let query = supabase
    .from('users')
    .select('expert_id, fullname, pic_url')
    .eq('email', user?.email)

  const { data, error } = await query;

  if (error) {
    console.error('Supabase error:', error);
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }

  console.log('Data fetched from Supabase:', data.length, 'items');

  const userData = data.map((item) => ({
    id: item.expert_id,
    name: item.fullname,
    pic_url: item.pic_url,
  }));

  return NextResponse.json(userData);
}