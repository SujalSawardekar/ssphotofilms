import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import fs from 'fs';
import path from 'path';

// Define target upload folder inside workspace public directory
const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads');

// Ensure directory exists
const ensureUploadDir = () => {
  if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
  }
};

// Calculate total size of uploads folder to enforce storage limits
const getStorageUsedBytes = async (): Promise<number> => {
  ensureUploadDir();
  const files = fs.readdirSync(UPLOAD_DIR);
  let total = 0;
  for (const file of files) {
    const filePath = path.join(UPLOAD_DIR, file);
    try {
      const stats = fs.statSync(filePath);
      if (stats.isFile()) {
        total += stats.size;
      }
    } catch (e) {
      console.error(e);
    }
  }
  return total;
};

// GET: List all media items and calculate storage usage
export async function GET() {
  try {
    ensureUploadDir();
    
    // Fetch items from DB
    const items = await prisma.mediaLibraryItem.findMany({
      orderBy: { createdAt: 'desc' }
    });

    const totalBytes = await getStorageUsedBytes();

    // Verify if database matches files on disk. If files are missing, we clean up
    const verifiedItems = [];
    for (const item of items) {
      const filePath = path.join(UPLOAD_DIR, item.fileName);
      if (fs.existsSync(filePath)) {
        verifiedItems.push(item);
      } else {
        // Remove stale DB records
        await prisma.mediaLibraryItem.delete({ where: { id: item.id } });
      }
    }

    return NextResponse.json({
      media: verifiedItems,
      storage: {
        usedBytes: totalBytes,
        limitBytes: 10 * 1024 * 1024 * 1024 // 10 GB limit
      }
    });

  } catch (error: any) {
    console.error('[MEDIA_API_GET] Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

// POST: Upload a file to public/uploads
export async function POST(req: NextRequest) {
  try {
    ensureUploadDir();
    
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const resolution = formData.get('resolution') as string || 'Unknown';

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Validate MIME types
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp', 'video/mp4'];
    if (!allowedMimeTypes.includes(file.type)) {
      return NextResponse.json({ 
        error: 'Invalid file format. Allowed formats: JPG, PNG, WEBP, MP4' 
      }, { status: 400 });
    }

    // Enforce 10GB storage limit
    const totalBytesUsed = await getStorageUsedBytes();
    if (totalBytesUsed + file.size > 10 * 1024 * 1024 * 1024) {
      return NextResponse.json({ 
        error: 'Upload limit exceeded. Max storage capacity is 10GB.' 
      }, { status: 400 });
    }

    // Sanitize and create filename
    const fileExt = path.extname(file.name) || `.${file.type.split('/')[1]}`;
    const baseName = path.basename(file.name, fileExt).replace(/[^a-zA-Z0-9]/g, '_');
    const fileName = `${baseName}_${Date.now()}${fileExt}`;
    const filePath = path.join(UPLOAD_DIR, fileName);

    // Save physical file
    const buffer = Buffer.from(await file.arrayBuffer());
    fs.writeFileSync(filePath, buffer);

    // Create database record
    const dbItem = await prisma.mediaLibraryItem.create({
      data: {
        fileName,
        url: `/uploads/${fileName}`,
        size: file.size,
        mimeType: file.type,
        resolution
      }
    });

    return NextResponse.json({ success: true, item: dbItem });

  } catch (error: any) {
    console.error('[MEDIA_API_POST] Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

// DELETE: Delete a media item
export async function DELETE(req: NextRequest) {
  try {
    ensureUploadDir();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Missing media ID' }, { status: 400 });
    }

    const item = await prisma.mediaLibraryItem.findUnique({
      where: { id }
    });

    if (!item) {
      return NextResponse.json({ error: 'Media item not found' }, { status: 404 });
    }

    // Delete physical file
    const filePath = path.join(UPLOAD_DIR, item.fileName);
    if (fs.existsSync(filePath)) {
      try {
        fs.unlinkSync(filePath);
      } catch (err) {
        console.warn(`[MEDIA_API] Could not delete physical file ${filePath}:`, err);
      }
    }

    // Delete DB record
    await prisma.mediaLibraryItem.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });

  } catch (error: any) {
    console.error('[MEDIA_API_DELETE] Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
