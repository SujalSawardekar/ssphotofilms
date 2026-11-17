import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { updateManyCmsContent, ensureCmsData } from '@/lib/cms';
import { revalidatePath } from 'next/cache';

export const dynamic = 'force-dynamic';

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
        await tx.cmsOccasion.deleteMany();
        const occasionsData = (data || []).map((occ: any, i: number) => ({
          title: occ.title || '',
          description: occ.description || '',
          image: occ.image || '/assets/occasion-wedding.jpg',
          href: occ.href || `/gallery?category=${(occ.title || '').toLowerCase().replace(/ & /g, '-').replace(/ /g, '-')}`,
          order: i
        }));
        if (occasionsData.length > 0) {
          await tx.cmsOccasion.createMany({ data: occasionsData });
        }
      }, {
        maxWait: 30000,
        timeout: 60000
      });
    } 
    else if (type === 'testimonials') {
      // data is Array of testimonials
      await prisma.$transaction(async (tx) => {
        await tx.cmsTestimonial.deleteMany();
        const testimonialsData = (data || []).map((test: any, i: number) => ({
          clientName: test.clientName || 'Anonymous',
          eventType: test.eventType || 'Wedding',
          review: test.review || '',
          image: test.image || '',
          order: i
        }));
        if (testimonialsData.length > 0) {
          await tx.cmsTestimonial.createMany({ data: testimonialsData });
        }
      }, {
        maxWait: 30000,
        timeout: 60000
      });
    } 
    else if (type === 'services') {
      // data is Array of categories with nested packages
      await prisma.$transaction(async (tx) => {
        // We delete packages first, then categories, then re-insert
        await tx.cmsServicePackage.deleteMany();
        await tx.cmsServiceCategory.deleteMany();

        const categoriesData = (data || []).map((cat: any, cIdx: number) => ({
          id: String(cat.id || `cat-${cIdx}`),
          label: cat.label || 'Category',
          description: cat.description || '',
          pdfUrl: cat.pdfUrl || '',
          order: cIdx
        }));

        if (categoriesData.length > 0) {
          await tx.cmsServiceCategory.createMany({ data: categoriesData });
        }

        const packagesData: any[] = [];
        for (let cIdx = 0; cIdx < (data || []).length; cIdx++) {
          const cat = data[cIdx];
          const catId = String(cat.id || `cat-${cIdx}`);
          if (cat.packages && Array.isArray(cat.packages)) {
            for (let pIdx = 0; pIdx < cat.packages.length; pIdx++) {
              const pkg = cat.packages[pIdx];
              packagesData.push({
                categoryId: catId,
                title: pkg.title || 'Package',
                originalPrice: String(pkg.originalPrice ?? '0'),
                discountPrice: String(pkg.discountPrice ?? '0'),
                bothSidePrice: pkg.bothSidePrice ? String(pkg.bothSidePrice) : null,
                reelPrice: pkg.reelPrice ? String(pkg.reelPrice) : null,
                features: Array.isArray(pkg.features) ? pkg.features : [],
                imageSrc: pkg.imageSrc || '/assets/occasion-wedding.jpg',
                captionTitle: pkg.captionTitle || pkg.title || 'Package',
                captionSubtitle: pkg.captionSubtitle || '',
                order: pIdx
              });
            }
          }
        }

        if (packagesData.length > 0) {
          await tx.cmsServicePackage.createMany({ data: packagesData });
        }
      }, {
        maxWait: 30000,
        timeout: 60000
      });
    } 
    else if (type === 'gallery') {
      // data is Array of stories (synchronizing portfolio)
      await prisma.$transaction(async (tx) => {
        await tx.cmsGalleryStory.deleteMany();
        const usedSlugs = new Set<string>();
        const galleryData: any[] = [];

        for (let i = 0; i < (data || []).length; i++) {
          const story = data[i];
          const rawSlug = (story.slug || story.title || `session-${i}`)
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '') || `session-${i}`;
          
          let finalSlug = rawSlug;
          let counter = 1;
          while (usedSlugs.has(finalSlug)) {
            finalSlug = `${rawSlug}-${counter++}`;
          }
          usedSlugs.add(finalSlug);

          galleryData.push({
            slug: finalSlug,
            title: story.title || 'Untitled Session',
            category: story.category || 'WEDDINGS',
            date: story.date || '',
            names: story.names || '',
            mainImage: story.mainImage || '/assets/occasion-wedding.jpg',
            images: Array.isArray(story.images) && story.images.length > 0 ? story.images : [story.mainImage || '/assets/occasion-wedding.jpg']
          });
        }

        if (galleryData.length > 0) {
          await tx.cmsGalleryStory.createMany({ data: galleryData });
        }
      }, {
        maxWait: 30000,
        timeout: 60000
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
