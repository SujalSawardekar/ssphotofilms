import { NextRequest, NextResponse } from 'next/server';
import { updateEventAiStatus } from '@/lib/db';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '5gb',
    },
  },
};

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const album_id = formData.get('album_id') as string;
    const drive_link = formData.get('drive_link');
    const album_zip = formData.get('album_zip');

    if (!album_id) return NextResponse.json({ error: 'Missing album_id' }, { status: 400 });

    // 1. Immediately mark as PROCESSING in DB so UI updates
    await updateEventAiStatus(album_id, false, album_id, 'Processing');

    const pythonFormData = new FormData();
    pythonFormData.append('album_id', album_id);
    if (drive_link) pythonFormData.append('drive_link', drive_link as string);
    if (album_zip) pythonFormData.append('album_zip', album_zip as Blob, 'upload.zip');

    // 2. Trigger Python Engine (Asynchronous but Awaitable in Serverless)
    console.log(`[PROXY_DEBUG] Forwarding request to Python for Album ID: ${album_id}`);
    if (album_zip) {
      console.log(`[PROXY_DEBUG] Forwarding "upload.zip" of size: ${(album_zip as Blob).size / (1024 * 1024)} MB`);
    }

    const response = await fetch('http://127.0.0.1:5001/api/owner/process_album', {
      method: 'POST',
      body: pythonFormData,
      // Increase timeout for large transfers to 2 minutes
      signal: AbortSignal.timeout(120000) 
    });

    const result = await response.json();
    console.log(`[PROXY_DEBUG] Python response:`, result);

    return NextResponse.json({ status: 'Processing started' });
  } catch (error: any) {
    console.error('Proxy Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
