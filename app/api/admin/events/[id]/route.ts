import { NextRequest, NextResponse } from 'next/server';
import { deleteEvent } from '@/lib/db';

export const dynamic = 'force-dynamic';

import fs from 'fs';
import path from 'path';

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    if (!id) return NextResponse.json({ error: 'Missing ID' }, { status: 400 });

    // Physical Cleanup
    const DATA_ROOT = 'c:\\Users\\shreyas\\ss-photo-films-data';
    const albumFolder = path.join(DATA_ROOT, 'album_images', id);
    const dbFile = path.join(DATA_ROOT, 'databases', `${id}.csv`);

    try {
      if (fs.existsSync(albumFolder)) {
        fs.rmSync(albumFolder, { recursive: true, force: true });
      }
      if (fs.existsSync(dbFile)) {
        fs.unlinkSync(dbFile);
      }
    } catch (fsErr) {
      console.warn(`Physical deletion failed for ${id}:`, fsErr);
    }

    await deleteEvent(id);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Delete Event Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
