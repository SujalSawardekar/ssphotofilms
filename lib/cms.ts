import prisma from './prisma';
import { galleryStories } from './galleryData';
import { pricingCategories } from './mockData';

// Self-seeding helper to guarantee default data is in database
export async function ensureCmsData() {
  try {
    const contentCount = await prisma.cmsContent.count();
    if (contentCount > 0) return;

    console.log("[CMS] Database empty. Seeding initial CMS content...");

    // 1. Seed general text content keys
    const defaultContents = {
      // Home Hero
      "home.hero.title": "CAPTURING LOVE STORIES",
      "home.hero.subtitle": "UNSCRIPTED. RAW. AUTHENTIC",
      "home.hero.images": JSON.stringify([
        "/assets/hero-bg.jpg",
        "/assets/hero-bg2.jpg",
        "/assets/hero-bg3.jpg"
      ]),
      // Home About Teaser
      "home.about.title": "FOR THE LOVE OF ART \n AND TIMELESS MEMORIES",
      "home.about.description": "SS Photo & Films is a passion project born out of Shreyas Sawardekar's obsession with freezing time. What started as a hobby in 2017 has evolved into a full-scale premium studio that has documented hundreds of unique stories across India.\n\nWe believe every frame should tell a story, every click should evoke a memory, and every client should feel the raw emotion of their special moments even decades later.",
      "home.about.quote": "\"We Capture Your Memories Forever\"",
      "home.about.signature": "Shreyas Sawardekar",
      "home.about.role": "Lead Creative Director",
      "home.about.image": "/assets/about-photo.jpg",
      // Home Stats
      "home.stats.bookings": "500",
      "home.stats.experience": "9",
      "home.stats.revenue": "387500",
      "home.stats.team": "8",
      "home.stats.events": "60",
      // Home Soul + Cinema
      "home.cinema.title": "SOUL + CINEMA",
      "home.cinema.description": "Every wedding story is unique. We capture the raw, real, unscripted magic, turning moments into a timeless cinematic experience. Because we don't just record events, we preserve the soul of your celebrations.",
      "home.cinema.image": "/assets/hero-bg2.jpg",
      // About Page
      "about.hero.bg": "/assets/about-hero-bg.jpg",
      "about.hero.subtitle": "THE STORY OF SS PHOTO & FILMS",
      "about.hero.title": "ABOUT US",
      "about.philosophy.title": "FOR THE LOVE OF ART AND TIMELESS MEMORIES",
      "about.philosophy.subtitle": "Stories that live forever",
      "about.philosophy.p1": "SS Studio is the passion project of Shreyas Sawardekar & Team. What began as a simple love for creativity and design soon transformed into a journey of capturing emotions, celebrations, and life's most treasured moments. From experimenting with design and visuals to telling stories through the lens, We discovered that every frame could hold not just an image but a memory.",
      "about.philosophy.p2": "At SS Studio, the idea is simple: create visual stories that blend artistry with authenticity. With a documentary and creative storytelling style, SS Studio captures the joy, the beauty, and those fleeting moments-in-between that truly define a celebration.",
      "about.philosophy.subquote": "Crafting stories, creating legacies since the very first frame!",
      "about.banner.quote": "Every wedding tells a story, at SS Photo & Films we feel blessed to make storytelling our profession!",
      "about.banner.image": "/assets/gallery-1.jpg",
      "about.meet.title": "MEET SHREYAS",
      "about.meet.subtitle": "Dreamer, visual storyteller, and the heart behind SS Photo & Films.",
      "about.meet.p1": "Originally a tech enthusiast, Shreyas found his true calling behind the lens, where moments turn into timeless memories. From chasing creativity in classrooms to capturing love stories through his camera, he's a believer that passion makes work feel like play!",
      "about.meet.p2": "When he's not filming weddings, you'll find him sketching ideas, exploring new art forms, or finding inspiration in everyday life. For Shreyas, photography isn't just a career — it's a canvas of emotions, colors, and stories waiting to be told.",
      "about.meet.signature": "Shreyas Sawardekar",
      "about.meet.image": "/assets/about-photo.jpg",
      "about.studio.title": "OUR STUDIO",
      "about.studio.p1": "SS Studio is more than four walls — it's a creative sanctuary where ideas turn into stories and passion meets art. With vibrant workstations, cozy brainstorming corners, and a shooting space filled with natural light, every detail is designed to spark inspiration.",
      "about.studio.p2": "Here, coffee fuels conversations, creativity flows freely, and every project feels like a celebration.",
      "about.studio.image": "/assets/studio.jpg",
      "about.process.title": "OUR PROCESS",
      "about.process.description": "We're not your usual photography team — we work with people who care about meaningful storytelling and quality over convenience. Since we take on limited projects, every shoot gets the time, attention, and direction it deserves. Based on your package, your project will be led by our lead creator or a senior director. If that sounds like the right fit, reach out and we'll schedule a consultation.",
      "about.process.image": "/assets/wedding/1ssp01096-copy.jpg",
      // Services Header
      "services.header.title": "SERVICES",
      "services.header.subtitle": "WE DON'T JUST OFFER SERVICES WE PRESERVE MEMORIES",
      // Contact Section
      "contact.phone": "+91 7741083155",
      "contact.whatsapp": "+91 7741083155",
      "contact.email": "ssphotographyofficial13@gmail.com",
      "contact.address": "SS Studio, Chiplun, Maharashtra 415605",
      "contact.social.instagram": "https://www.instagram.com/ss_photography_official13",
      "contact.social.youtube": "https://www.youtube.com/@ss_photography_official13",
      "contact.social.facebook": "https://www.facebook.com/ssphotographyofficial13/",
      "contact.map": "https://maps.app.goo.gl/GTSoLLD2cZGRgLPy5",
      // SEO
      "seo.title": "SS Photo & Films | Capturing Timeless Stories",
      "seo.description": "SS Photo & Films is a premium photography studio specializing in Wedding, Maternity, and Corporate events. Capturing raw, unscripted, and authentic moments since 2017.",
      "seo.keywords": "photography, wedding photography, maternity, engagement, pre-wedding, baby shoot, haldi, chiplun, Maharashtra"
    };

    await prisma.$transaction(async (tx) => {
      // 1. Seed general text
      for (const [key, value] of Object.entries(defaultContents)) {
        await tx.cmsContent.create({ data: { key, value } });
      }

      // 2. Seed occasions
      const defaultOccasions = [
        { title: 'Baby & Kids', description: 'One smile from them can bring happiness worth millions to us.', image: '/assets/occasion-baby.jpg', href: '/gallery?category=kids', order: 0 },
        { title: 'Wedding', description: 'A magical bond between two souls worth a million stories.', image: '/assets/occasion-wedding.jpg', href: '/gallery?category=wedding', order: 1 },
        { title: 'Maternity', description: 'A tiny heartbeat, a life in our memories and hearts.', image: '/assets/occasion-maternity.jpg', href: '/gallery?category=maternity', order: 2 },
        { title: 'Engagement', description: 'Capturing the first promise of a lifelong journey together.', image: '/assets/Engagement/1DSC08499%20copy.jpg', href: '/gallery?category=engagement', order: 3 },
        { title: 'Pre-wedding', description: 'Documenting your unique connection before the big day.', image: '/assets/hero-bg2.jpg', href: '/gallery?category=pre-wedding', order: 4 },
        { title: 'Haldi', description: 'Vibrant colors and soulful traditions of your celebration.', image: '/assets/haldi/1SSP02809%20copy.jpg', href: '/gallery?category=haldi', order: 5 }
      ];
      for (const o of defaultOccasions) {
        await tx.cmsOccasion.create({ data: o });
      }

      // 3. Seed testimonials
      const defaultTestimonials = [
        { clientName: "Mithilesh Shirke", eventType: "Wedding & Album", review: "An amazing experience from start to finish! SS Studio covered our pre-wedding, engagement, wedding and album, and everything turned out better than we imagined. Shreyas was very patient, calm and made us feel at ease throughout, never awkward or rushed.", order: 0, image: "" },
        { clientName: "Pratik Katdare", eventType: "Wedding Ceremony", review: "We entrusted SS Photo and Films with our contract of marriage ceremony photoshoot, and we are extremely satisfied with their work. The team was professional, punctual, and very cooperative throughout the event.", order: 1, image: "" },
        { clientName: "Divyanee Gite", eventType: "Baby Photoshoot", review: "Excellent work with excellent studio. Shreyas was very patiently and calmly working for us, as we are having our baby's photoshoot. All the best.", order: 2, image: "" },
        { clientName: "Kunal Baikar", eventType: "Baby Shoot", review: "Shreyas is very talented, and his passion truly shows in his work. We had a great experience with our baby shoot at SS Photo Studio and are very happy with the results.", order: 3, image: "" },
        { clientName: "Deepali Hiwalkar", eventType: "Photography & Videography", review: "Very nice photography and Videography. Captured important moment beautifully with great attention to detail and creativity.", order: 4, image: "" },
        { clientName: "Jagruti Surve", eventType: "Studio Review", review: "Great studio from chiplun. Best studio from chiplun. Truly appreciate their dedication and would highly recommend SS Photo and Films.", order: 5, image: "" }
      ];
      for (const t of defaultTestimonials) {
        await tx.cmsTestimonial.create({ data: t });
      }

      // 4. Seed services and packages
      for (const category of pricingCategories) {
        const cat = await tx.cmsServiceCategory.create({
          data: {
            id: category.id,
            label: category.label,
            description: category.description || "",
            pdfUrl: category.pdfUrl || "",
            order: pricingCategories.indexOf(category)
          }
        });

        for (const pkg of category.packages) {
          await tx.cmsServicePackage.create({
            data: {
              categoryId: cat.id,
              title: pkg.title,
              originalPrice: String(pkg.originalPrice),
              discountPrice: String(pkg.discountPrice),
              bothSidePrice: pkg.bothSidePrice ? String(pkg.bothSidePrice) : null,
              reelPrice: pkg.reelPrice ? String(pkg.reelPrice) : null,
              features: pkg.features,
              imageSrc: pkg.imageSrc,
              captionTitle: pkg.captionTitle,
              captionSubtitle: pkg.captionSubtitle,
              order: category.packages.indexOf(pkg)
            }
          });
        }
      }

      // 5. Seed default gallery stories
      for (const story of galleryStories) {
        await tx.cmsGalleryStory.create({
          data: {
            slug: story.slug,
            title: story.title,
            category: story.category,
            date: story.date,
            names: story.names,
            mainImage: story.mainImage,
            images: story.images
          }
        });
      }
    }, {
      maxWait: 30000,
      timeout: 60000
    });

    console.log("[CMS] Seeding successfully completed.");
  } catch (error) {
    console.error("[CMS] Seeding failed:", error);
  }
}

// Fetch single key or default
export async function getCmsContent(key: string, defaultVal: string): Promise<string> {
  await ensureCmsData();
  try {
    const item = await prisma.cmsContent.findUnique({ where: { key } });
    return item ? item.value : defaultVal;
  } catch (e) {
    console.error(`[CMS] Error fetching content key "${key}":`, e);
    return defaultVal;
  }
}

// Fetch all keys as record
export async function getAllCmsContent(): Promise<Record<string, string>> {
  await ensureCmsData();
  try {
    const items = await prisma.cmsContent.findMany();
    const result: Record<string, string> = {};
    items.forEach(i => {
      result[i.key] = i.value;
    });
    return result;
  } catch (e) {
    console.error("[CMS] Error fetching all content:", e);
    return {};
  }
}

// Update single content key
export async function updateCmsContent(key: string, value: string) {
  try {
    return await prisma.cmsContent.upsert({
      where: { key },
      update: { value },
      create: { key, value }
    });
  } catch (e) {
    console.error(`[CMS] Error updating content key "${key}":`, e);
    throw e;
  }
}

// Update multiple content keys
export async function updateManyCmsContent(contents: Record<string, string>) {
  try {
    const operations = Object.entries(contents).map(([key, value]) =>
      prisma.cmsContent.upsert({
        where: { key },
        update: { value },
        create: { key, value }
      })
    );
    await prisma.$transaction(operations);
  } catch (e) {
    console.error("[CMS] Error updating multiple content keys:", e);
    throw e;
  }
}

// Occasions CMS helpers
export async function getCmsOccasions() {
  await ensureCmsData();
  try {
    return await prisma.cmsOccasion.findMany({
      orderBy: { order: 'asc' }
    });
  } catch (e) {
    console.error("[CMS] Error fetching occasions:", e);
    return [];
  }
}

// Testimonials CMS helpers
export async function getCmsTestimonials() {
  await ensureCmsData();
  try {
    return await prisma.cmsTestimonial.findMany({
      orderBy: { order: 'asc' }
    });
  } catch (e) {
    console.error("[CMS] Error fetching testimonials:", e);
    return [];
  }
}

// Services tabs and packages CMS helpers
export async function getCmsServiceCategories() {
  await ensureCmsData();
  try {
    return await prisma.cmsServiceCategory.findMany({
      include: {
        packages: {
          orderBy: { order: 'asc' }
        }
      },
      orderBy: { order: 'asc' }
    });
  } catch (e) {
    console.error("[CMS] Error fetching services:", e);
    return [];
  }
}

// Gallery stories helpers
export async function getCmsGalleryStories() {
  await ensureCmsData();
  try {
    return await prisma.cmsGalleryStory.findMany({
      orderBy: { createdAt: 'desc' }
    });
  } catch (e) {
    console.error("[CMS] Error fetching gallery stories:", e);
    return [];
  }
}

export async function getCmsGalleryStoryBySlug(slug: string) {
  await ensureCmsData();
  try {
    return await prisma.cmsGalleryStory.findUnique({
      where: { slug }
    });
  } catch (e) {
    console.error(`[CMS] Error fetching gallery story slug "${slug}":`, e);
    return null;
  }
}
