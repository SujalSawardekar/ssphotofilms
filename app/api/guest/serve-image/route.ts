import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  req: NextRequest,
  { params }: { params: { eventId: string; filename: string } }
) {
  const { searchParams } = new URL(req.url);
  const eventId = searchParams.get('eventId');
  const filename = searchParams.get('filename');

  if (!eventId || !filename) {
    return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
  }

  const AI_ENGINE_URL = process.env.NEXT_PUBLIC_AI_ENGINE_URL || 'http://127.0.0.1:5001';
  
  try {
    const response = await fetch(`${AI_ENGINE_URL}/serve_image/${eventId}/${filename}`, {
      headers: {
        'ngrok-skip-browser-warning': 'true'
      }
    });

    if (!response.ok) {
      return NextResponse.json({ error: 'Image not found' }, { status: 404 });
    }

    const blob = await response.blob();
    return new NextResponse(blob, {
      headers: {
        'Content-Type': response.headers.get('Content-Type') || 'image/jpeg',
        'Cache-Control': 'public, max-age=31536000, immutable'
      }
    });
  } catch (error) {
    console.error('Image Proxy Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
