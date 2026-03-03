import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/createClient'; // Or your helper path

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');

  if (code) {
    const supabase = createClient();
    await supabase.auth.exchangeCodeForSession(code);
  }

  // Once logged in, send them home
  return NextResponse.redirect(`${origin}/home`);
}