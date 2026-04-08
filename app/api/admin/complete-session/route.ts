import { NextRequest, NextResponse } from 'next/server';
import { updateEventAiStatus, toggleEventPublish } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const { album_id, status } = await req.json();

    if (!album_id) {
       return NextResponse.json({ error: 'Missing album_id' }, { status: 400 });
    }

    console.log(`Received AI Completion for ${album_id}: ${status}`);

    const isReady = status === 'Ready';
    
    // Update AI Status in DB
    await updateEventAiStatus(album_id, isReady, album_id, status);

    // Per user request: Auto-publish when ready
    if (isReady) {
      await toggleEventPublish(album_id, true);
      console.log(`Auto-published session: ${album_id}`);
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Webhook Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
