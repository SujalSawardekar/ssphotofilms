import { NextRequest, NextResponse } from 'next/server';
import { updateEventProgress } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const { album_id, current, total, last_photo, stage } = await req.json();

    if (!album_id) {
       return NextResponse.json({ error: 'Missing album_id' }, { status: 400 });
    }

    // Update progress in DB
    await updateEventProgress(album_id, current, total, last_photo, stage);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Progress Webhook Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
