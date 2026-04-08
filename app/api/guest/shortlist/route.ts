import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const album_id = formData.get('album_id');
    const face_image = formData.get('face_image');

    const pythonFormData = new FormData();
    if (album_id) pythonFormData.append('album_id', album_id);
    if (face_image) pythonFormData.append('face_image', face_image);

    const response = await fetch('http://127.0.0.1:5001/api/v1/shortlist', {
      method: 'POST',
      body: pythonFormData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json({ error: errorData.error || 'Python engine error' }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Shortlist Proxy Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
