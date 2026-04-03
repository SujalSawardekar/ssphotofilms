export interface Story {
  id: string;
  slug: string;
  title: string;
  category: string;
  date: string;
  names: string;
  mainImage: string;
  images: string[];
}

export const galleryCategories = [
  "WEDDINGS",
  "HALDI",
  "PRE-WEDDING",
  "MATERNITY",
  "BABY & KIDS",
  "ENGAGEMENT"
];

export const galleryStories: Story[] = [
  // WEDDINGS
  {
    id: "1",
    slug: "kaustubh-sayali",
    title: "A LOVE THAT GREW WITH THEM",
    category: "WEDDINGS",
    date: "JUNE 23, 2025",
    names: "Kaustubh & Sayali",
    mainImage: "/assets/occasion-wedding.jpg",
    images: ["/assets/occasion-wedding.jpg", "/assets/gallery-1.jpg", "/assets/gallery-2.jpg", "/assets/gallery-3.jpg", "/assets/gallery-4.jpg"]
  },
  {
    id: "5",
    slug: "eternal-vows",
    title: "ETERNAL VOWS AT DUSK",
    category: "WEDDINGS",
    date: "OCTOBER 15, 2025",
    names: "Aditya & Meera",
    mainImage: "/assets/gallery-7.jpg",
    images: ["/assets/gallery-7.jpg", "/assets/gallery-8.jpg", "/assets/gallery-9.jpg"]
  },
  {
    id: "6",
    slug: "royal-heritage-wedding",
    title: "ROYAL HERITAGE CELEBRATION",
    category: "WEDDINGS",
    date: "NOVEMBER 20, 2025",
    names: "Vikram & Shweta",
    mainImage: "/assets/gallery-6.jpg",
    images: ["/assets/gallery-6.jpg", "/assets/gallery-2.jpg", "/assets/gallery-3.jpg"]
  },

  // HALDI
  {
    id: "2",
    slug: "traditions-haldi",
    title: "VIBRANT TRADITIONS",
    category: "HALDI",
    date: "JULY 10, 2025",
    names: "Rahul & Sneha",
    mainImage: "/assets/gallery-1.jpg",
    images: ["/assets/gallery-1.jpg", "/assets/hero-bg.jpg", "/assets/hero-bg2.jpg"]
  },
  {
    id: "7",
    slug: "golden-hues",
    title: "GOLDEN HUES & LAUGHTER",
    category: "HALDI",
    date: "DECEMBER 05, 2025",
    names: "Kunal & Riya",
    mainImage: "/assets/gallery-5.jpeg",
    images: ["/assets/gallery-5.jpeg", "/assets/gallery-1.jpg"]
  },

  // PRE-WEDDING
  {
    id: "3",
    slug: "first-chapter-pre",
    title: "THE FIRST CHAPTER",
    category: "PRE-WEDDING",
    date: "AUGUST 05, 2025",
    names: "Amit & Priya",
    mainImage: "/assets/hero-bg2.jpg",
    images: ["/assets/hero-bg2.jpg", "/assets/hero-bg3.jpg", "/assets/gallery-8.jpg"]
  },
  {
    id: "8",
    slug: "urban-romance",
    title: "URBAN ROMANCE",
    category: "PRE-WEDDING",
    date: "JANUARY 12, 2026",
    names: "Siddharth & Ananya",
    mainImage: "/assets/gallery-4.jpg",
    images: ["/assets/gallery-4.jpg", "/assets/gallery-9.jpg"]
  },

  // MATERNITY
  {
    id: "4",
    slug: "new-beginnings",
    title: "NEW BEGINNINGS",
    category: "MATERNITY",
    date: "SEPTEMBER 12, 2025",
    names: "Anjali & Vikram",
    mainImage: "/assets/occasion-maternity.jpg",
    images: ["/assets/occasion-maternity.jpg", "/assets/gallery-4.jpg"]
  },
  {
    id: "9",
    slug: "pure-joy-maternity",
    title: "PURE JOY",
    category: "MATERNITY",
    date: "FEBRUARY 18, 2026",
    names: "Sameer & Tanvi",
    mainImage: "/assets/gallery-3.jpg",
    images: ["/assets/gallery-3.jpg", "/assets/gallery-2.jpg"]
  }
];
