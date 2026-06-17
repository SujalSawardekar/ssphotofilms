import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { updateManyCmsContent, ensureCmsData } from '@/lib/cms';
import { revalidatePath } from 'next/cache';

export async function GET() {
  try {
    await ensureCmsData();
    const contentsList = await prisma.cmsContent.findMany();
    const contents: Record<string, string> = {};
    contentsList.forEach(item => {
      contents[item.key] = item.value;
    });

    const occasions = await prisma.cmsOccasion.findMany({ orderBy: { order: 'asc' } });
    const testimonials = await prisma.cmsTestimonial.findMany({ orderBy: { order: 'asc' } });
    const services = await prisma.cmsServiceCategory.findMany({
      include: { packages: { orderBy: { order: 'asc' } } },
      orderBy: { order: 'asc' }
    });
    const gallery = await prisma.cmsGalleryStory.findMany({ orderBy: { createdAt: 'desc' } });

    return NextResponse.json({
      contents,
      occasions,
      testimonials,
      services,
      gallery
    });
  } catch (error: any) {
    console.error('[CMS_API_GET] Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { type, data } = await req.json();

    if (!type || !data) {
      return NextResponse.json({ error: 'Missing type or data' }, { status: 400 });
    }

    console.log(`[CMS_API] Processing save request for type: ${type}`);

    if (type === 'content') {
      // data is Record<string, string>
      await updateManyCmsContent(data);
    } 
    else if (type === 'occasions') {
      // data is Array of occasions
      await prisma.$transaction(async (tx) => {
        // Clear all occasions and re-insert in order
        await tx.cmsOccasion.deleteMany();
        for (let i = 0; i < data.length; i++) {
          const occ = data[i];
          await tx.cmsOccasion.create({
            data: {
              title: occ.title,
              description: occ.description,
              image: occ.image,
              href: occ.href || `/gallery?category=${occ.title.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-')}`,
              order: i
            }
          });
        }
      });
    } 
    else if (type === 'testimonials') {
      // data is Array of testimonials
      await prisma.$transaction(async (tx) => {
        await tx.cmsTestimonial.deleteMany();
        for (let i = 0; i < data.length; i++) {
          const test = data[i];
          await tx.cmsTestimonial.create({
            data: {
              clientName: test.clientName,
              eventType: test.eventType,
              review: test.review,
              image: test.image || '',
              order: i
            }
          });
        }
      });
    } 
    else if (type === 'services') {
      // data is Array of categories with nested packages
      await prisma.$transaction(async (tx) => {
        // We delete packages first, then categories, then re-insert
        await tx.cmsServicePackage.deleteMany();
        await tx.cmsServiceCategory.deleteMany();

        for (let cIdx = 0; cIdx < data.length; cIdx++) {
          const cat = data[cIdx];
          const dbCat = await tx.cmsServiceCategory.create({
            data: {
              id: cat.id,
              label: cat.label,
              description: cat.description || '',
              pdfUrl: cat.pdfUrl || '',
              order: cIdx
            }
          });

          if (cat.packages && Array.isArray(cat.packages)) {
            for (let pIdx = 0; pIdx < cat.packages.length; pIdx++) {
              const pkg = cat.packages[pIdx];
              await tx.cmsServicePackage.create({
                data: {
                  categoryId: dbCat.id,
                  title: pkg.title,
                  originalPrice: String(pkg.originalPrice),
                  discountPrice: String(pkg.discountPrice),
                  bothSidePrice: pkg.bothSidePrice ? String(pkg.bothSidePrice) : null,
                  reelPrice: pkg.reelPrice ? String(pkg.reelPrice) : null,
                  features: Array.isArray(pkg.features) ? pkg.features : [],
                  imageSrc: pkg.imageSrc,
                  captionTitle: pkg.captionTitle || pkg.title,
                  captionSubtitle: pkg.captionSubtitle || '',
                  order: pIdx
                }
              });
            }
          }
        }
      });
    } 
    else if (type === 'gallery') {
      // data is Array of stories (synchronizing portfolio)
      await prisma.$transaction(async (tx) => {
        await tx.cmsGalleryStory.deleteMany();
        for (const story of data) {
          await tx.cmsGalleryStory.create({
            data: {
              slug: story.slug || story.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
              title: story.title,
              category: story.category,
              date: story.date,
              names: story.names,
              mainImage: story.mainImage,
              images: story.images || []
            }
          });
        }
      });
    } 
    else {
      return NextResponse.json({ error: `Unsupported content type: ${type}` }, { status: 400 });
    }

    // Revalidate paths for static generation caching to clear immediately
    try {
      revalidatePath('/');
      revalidatePath('/about');
      revalidatePath('/services');
      revalidatePath('/gallery');
      revalidatePath('/gallery/[slug]', 'page');
      console.log("[CMS_API] Revalidation successfully triggered for page routes.");
    } catch (revalErr) {
      console.warn("[CMS_API] Path revalidation warning:", revalErr);
    }

    return NextResponse.json({ success: true });

  } catch (error: any) {
    console.error('[CMS_API] Error updating website content:', error);
    return NextResponse.json(
      { error: 'A server error occurred. Please try again later.', details: error.message },
      { status: 500 }
    );
  }
}
