export interface User {
  id: number;
  email: string;
  password?: string;
  role: 'admin' | 'client' | 'attendee';
  name: string;
  image?: string;
}

export interface Booking {
  id: string;
  clientName: string;
  email: string;
  phone: string;
  eventType: string;
  eventDate: string;
  location: string;
  hours: number;
  status: 'Confirmed' | 'Pending' | 'Completed' | 'Rejected';
  amount: number;
  packageType?: string;
  message?: string;
  cancellationReason?: string;
  photographerNotes?: string;
}

export interface PricingPackage {
  title: string;
  originalPrice: string | number;
  discountPrice: string | number;
  bothSidePrice?: string | number;
  reelPrice?: string | number;
  features: string[];
  imageSrc: string;
  captionTitle: string;
  captionSubtitle: string;
}

export interface ServiceCategory {
  id: string;
  label: string;
  description?: string;
  pdfUrl?: string;
  packages: PricingPackage[];
}

export interface Event {
  id: string;
  name: string;
  date: string;
  type: string;
  photoCount: number;
  qrCode: string;
}

export interface Photo {
  id: number;
  src: string;
  event: string;
  tags: string[];
}

export interface TeamApplication {
  id: number;
  name: string;
  email: string;
  phone: string;
  experience: number;
  specialization: string[];
  portfolioUrl: string;
  status: 'Pending' | 'Approved' | 'Rejected';
}

export const mockUsers: User[] = [
  { id: 1, email: "admin@ss.com", password: "123456", role: "admin", name: "Shreyas Sawardekar" },
  { id: 2, email: "client@ss.com", password: "password", role: "client", name: "Sarah Mitchell" },
  { id: 3, email: "attendee@ss.com", password: "password", role: "attendee", name: "Priya Mehta" }
];

export interface ClientQuery {
  id: string;
  name: string;
  email: string;
  userEmail?: string; // links back to the logged-in user who submitted
  date: string;
  status: 'Open' | 'Answered';
  message: string;
}

export const mockQueries: ClientQuery[] = [];

export const mockBookings: Booking[] = [];

export const pricingCategories: ServiceCategory[] = [
  {
    id: "wedding",
    label: "Wedding",
    description: "A signature-style photoshoot delivering 10–15 artistically crafted images and a high-impact reel, designed for standout social media presence and captured with a refined documentary aesthetic.",
    pdfUrl: "/assets/Wedding - SS Portfolio 2025.pdf",
    packages: [
      {
        title: "Basic Package",
        originalPrice: "34,999",
        discountPrice: "24,999",
        bothSidePrice: "39,999",
        features: [
          "1 Cinematic Video (2-3 Min)",
          "1 Professional Photographer",
          "1 Traditional Videographer",
          "30 Edited Photos",
          "All Raw Photos",
          "Both Side Cover: 39,999/-"
        ],
        imageSrc: "/assets/wedding/Wedding 1/1ssp02947-copy.jpg",
        captionTitle: "Wedding Elegance",
        captionSubtitle: "Pure Traditional Bliss"
      },
      {
        title: "Premium Package",
        originalPrice: "54,999",
        discountPrice: "44,999",
        bothSidePrice: "64,999",
        features: [
          "1 Cinematic Video (4-5 Min)",
          "1 Candid Photographer",
          "1 Traditional Photographer",
          "1 traditional Videographer",
          "50 Edited Photos",
          "1 Coffee Table Album (20 Pages)",
          "Both Side Cover: 64,999/-"
        ],
        imageSrc: "/assets/wedding/Wedding 2/1ssp-(547)-copy.jpg",
        captionTitle: "Eternal Vows",
        captionSubtitle: "Vikram & Anjali"
      },
      {
        title: "Signature Package",
        originalPrice: "84,999",
        discountPrice: "74,999",
        bothSidePrice: "94,999",
        features: [
          "1 Cinematic Film (5-7 Min)",
          "2 Candid Photographers",
          "1 Traditional Photographer",
          "2 traditional Videographers",
          "100 Edited Photos",
          "1 Premium Wedding Album (40 Pages)",
          "Drone Coverage Included",
          "Both Side Cover: 94,999/-"
        ],
        imageSrc: "/assets/wedding/Wedding 3/1DSC04230 copy.jpg",
        captionTitle: "Royal Celebration",
        captionSubtitle: "Kunal & Meera"
      }
    ]
  },
  {
    id: "pre-wedding",
    label: "Pre-Wedding",
    description: "A signature-style photoshoot delivering 10–15 artistically crafted images and a high-impact reel, designed for standout social media presence and captured with a refined documentary aesthetic.",
    pdfUrl: "/assets/Pre-wedding - SS Portfolio 2025.pdf",
    packages: [
      {
        title: "Basic (Only Photoshoot)",
        originalPrice: "24,999",
        discountPrice: "14,999",
        features: [
          "1 Day Shoot at 2 Locations",
          "30 Fully Edited HD Photos",
          "All Soft Copies Provided",
          "Costumes & Makeup Extra"
        ],
        imageSrc: "/assets/prewedding/Pre wedding 1/dsc03154.jpg",
        captionTitle: "The First Chapter",
        captionSubtitle: "Arjun & Kavya"
      },
      {
        title: "Standard (Photos + Reel)",
        originalPrice: "29,999",
        discountPrice: "21,999",
        features: [
          "1 Day Shoot at 3 Locations",
          "50 Fully Edited HD Photos",
          "1 Cinematic Reel (60 Sec)",
          "All Soft Copies Provided"
        ],
        imageSrc: "/assets/prewedding/Prewedding 2/dsc00896.jpg",
        captionTitle: "Urban Romance",
        captionSubtitle: "Siddharth & Ananya"
      },
      {
        title: "Luxury Service",
        originalPrice: 34999,
        discountPrice: 29999,
        features: ["UNLIMITED SOFTCOPYS AND FULL CINE VIDEO WITH TEASER", "30 SELECTED EDITED PHOTOS", "3/4 DRESS CHANGES", "MORNING TO EVNING SHOOT", "SOFTCOPYS PROVIDING ON GOOGLE DRIVE", "3/4 MINUTES FULL CINE VIDEO WITH 1 MINUTES TEASER", "With 2 reels"],
        imageSrc: "/assets/gallery-4.jpg",
        captionTitle: "Mountain Retreat",
        captionSubtitle: "Samir & Tanya"
      }
    ]
  },
  {
    id: "baby-shoot",
    label: "Baby-Shoot",
    pdfUrl: "/assets/Baby Shoot First Smile.pdf",
    packages: [
      {
        title: "STANDARD PACKAGE",
        originalPrice: "3,500",
        discountPrice: "2,500",
        features: [
          "1 INDOOR SETUP (CHOOSE THEME FROM OUR CATALOGUE)",
          "30 MIN SESSION",
          "10 HD RESOLUTION EDITED IMAGES",
          "ALL SOFTCOPY PHOTOS"
        ],
        imageSrc: "/assets/Babyshoot/occasion-baby.jpg",
        captionTitle: "First Smiles",
        captionSubtitle: "Capturing Innocence"
      },
      {
        title: "PROFESSIONAL PACKAGE",
        originalPrice: "6,500",
        discountPrice: "4,500",
        features: [
          "2 INDOOR SETUP (CHOOSE THEME FROM OUR CATALOGUE)",
          "1 HRS SESSION",
          "25 HD RESOLUTION EDITED IMAGES",
          "ALL SOFTCOPY PHOTOS"
        ],
        imageSrc: "/assets/Babyshoot/gallery-8.jpg",
        captionTitle: "Little Explorers",
        captionSubtitle: "Playful Moments"
      },
      {
        title: "PRIME PACKAGE",
        originalPrice: "8,500",
        discountPrice: "6,500",
        features: [
          "3 INDOOR SETUP (CHOOSE THEME FROM OUR CATALOGUE)",
          "2 HRS SESSION",
          "30 HD RESOLUTION EDITED IMAGES",
          "ALL SOFTCOPY PHOTOS"
        ],
        imageSrc: "/assets/Babyshoot/gallery-5.jpeg",
        captionTitle: "Baby Prime",
        captionSubtitle: "Timeless Childhood"
      },
      {
        title: "PLATINUM PACKAGE",
        originalPrice: "15,500",
        discountPrice: "12,500",
        features: [
          "5 INDOOR SETUPS (CHOOSE THEMES FROM OUR CATALOGUE)",
          "2.5 HOURS SESSION",
          "40 PROFESSIONALLY EDITED HD IMAGES",
          "FAMILY PORTRAIT SESSION INCLUDED",
          "1 PREMIUM PHOTO FRAME (SIZE: 8 × 10 INCHES)",
          "ALL SOFT COPIES PROVIDED",
          "ADD-ON: CINEMATIC REEL – ₹1,500"
        ],
        reelPrice: "1,500",
        imageSrc: "/assets/Babyshoot/occasion-birthday.jpg",
        captionTitle: "Platinum Memories",
        captionSubtitle: "The Ultimate Celebration"
      }
    ]
  },
  {
    id: "maternity",
    label: "Maternity",
    pdfUrl: "/assets/Maternity of First Smile.pdf",
    packages: [
      {
        title: "STANDARD PACKAGE",
        originalPrice: "3,999",
        discountPrice: "2,999",
        features: [
          "1 INDOOR SETUP (CHOOSE THEME FROM OUR CATALOGUE)",
          "30 MIN SESSION",
          "10 HD RESOLUTION EDITED IMAGES",
          "ALL SOFTCOPY PHOTOS"
        ],
        imageSrc: "/assets/Maternity/Maternity 1/11SSP01284 copy.jpg",
        captionTitle: "Glow of Life",
        captionSubtitle: "Artistic Maternity"
      },
      {
        title: "PROFESSIONAL PACKAGE",
        originalPrice: "6,999",
        discountPrice: "4,999",
        features: [
          "2 INDOOR SETUP (CHOOSE THEME FROM OUR CATALOGUE)",
          "1 HRS SESSION",
          "20 HD RESOLUTION EDITED IMAGES",
          "ALL SOFTCOPY PHOTOS"
        ],
        imageSrc: "/assets/Maternity/Maternity 2/1SSP01262 copy.jpg",
        captionTitle: "New Beginnings",
        captionSubtitle: "Vikram & Anjali"
      },
      {
        title: "PRIME PACKAGE",
        originalPrice: "8,999",
        discountPrice: "6,999",
        features: [
          "3 INDOOR SETUP (CHOOSE THEME FROM OUR CATALOGUE)",
          "2 HRS SESSION",
          "30 HD RESOLUTION EDITED IMAGES",
          "ALL SOFTCOPY PHOTOS",
          "ADD-ON: CINEMATIC REEL – ₹1,500"
        ],
        reelPrice: "1,500",
        imageSrc: "/assets/Maternity/Maternity 3/01.jpg",
        captionTitle: "Maternity Prime",
        captionSubtitle: "Pure Anticipation"
      },
      {
        title: "PLATINUM PACKAGE",
        originalPrice: "14,999",
        discountPrice: "11,999",
        features: [
          "5 INDOOR SETUPS (CHOOSE THEMES FROM OUR CATALOGUE)",
          "2.5 HOURS SESSION",
          "40 PROFESSIONALLY EDITED HD IMAGES",
          "FAMILY PORTRAIT SESSION INCLUDED",
          "1 PREMIUM PHOTO FRAME (SIZE: 12 × 18 INCHES)",
          "ALL SOFT COPIES PROVIDED",
          "ADD-ON: CINEMATIC REEL – ₹1,500"
        ],
        reelPrice: "1,500",
        imageSrc: "/assets/Maternity/Maternity 4/11SSP03849 copy.jpg",
        captionTitle: "Maternity Platinum",
        captionSubtitle: "The Royal Wait"
      }
    ]
  },
  {
    id: "engagement",
    label: "Engagement",
    description: "A signature-style photoshoot delivering 10–15 artistically crafted images and a high-impact reel, designed for standout social media presence and captured with a refined documentary aesthetic.",
    pdfUrl: "/assets/Wedding - SS Portfolio 2025.pdf",
    packages: [
      {
        title: "Basic Service",
        originalPrice: 14999,
        discountPrice: 11999,
        features: ["1 Traditional photographer", "All Raw photos provided", "15 pages photobook", "Closeups with edit"],
        imageSrc: "/assets/Engagement/1SSP03053 copy.jpg",
        captionTitle: "The Promise",
        captionSubtitle: "Vikram & Anjali"
      },
      {
        title: "Grand Service",
        originalPrice: 24999,
        discountPrice: 19999,
        features: ["1 Traditional photographer", "1 Candid photographer", "All Raw photos provided", "Closeups with edit", "15 Pages Photobook"],
        imageSrc: "/assets/Engagement/1SSP03215 copy.jpg",
        captionTitle: "Eyes on Forever",
        captionSubtitle: "Sahil & Riya"
      },
      {
        title: "Luxury Service",
        originalPrice: 34999,
        discountPrice: 29999,
        features: ["1 Traditional photographer", "1 Cinematographer", "1 Candid photographer", "All Raw photos provided", "Closeups with edit", "15 Pages Photobook", "Cinematic video with edit"],
        imageSrc: "/assets/Engagement/1SSP04730 copy.jpg",
        captionTitle: "Royal Bond",
        captionSubtitle: "Ishaan & Tanvi"
      }
    ]
  },
  {
    id: "portrait",
    label: "Portrait",
    description: "We combine precise lighting, intentional creative direction, and a disciplined studio workflow to create portraits that are refined, expressive, and truly portfolio-ready.",
    pdfUrl: "/assets/SS Studio - Portrait Photography.pdf",
    packages: [
      {
        title: "BASIC PORTRAIT",
        originalPrice: "1,999",
        discountPrice: "1,499",
        features: [
          "1 Professional Studio Setup",
          "15 Minute Session",
          "5 High-End Retouched Images",
          "Single Person Session",
          "Digital Delivery via Private Gallery",
          "Ideal For: Profile photos, quick portrait updates"
        ],
        imageSrc: "/assets/Portrait/1dsc00518-copy.jpg",
        captionTitle: "Professional Presence",
        captionSubtitle: "Ayesha S."
      },
      {
        title: "SIGNATURE PORTRAIT",
        originalPrice: "2,999",
        discountPrice: "2,499",
        features: [
          "Multi-Light Creative Setup",
          "30 Minute Session",
          "10 Master-Retouched Images",
          "Wardrobe Consultation",
          "Up to 2 Outfit Changes",
          "Ideal For: Branding, portfolios, fine-art portraits"
        ],
        imageSrc: "/assets/Portrait/1dsc03312-copy.jpg",
        captionTitle: "Creative Expressions",
        captionSubtitle: "Devansh R."
      },
      {
        title: "PREMIUM PORTRAIT",
        originalPrice: "7,999",
        discountPrice: "6,999",
        features: [
          "Luxury In-Studio Experience",
          "90 Minute Session",
          "25 Editorial-Grade Retouched Images",
          "Full Creative Direction & Styling",
          "Premium 8x10 Print Included",
          "1 Cinematic Portrait Reel (30s)",
          "Ideal For: Personal branding, high-end portfolios"
        ],
        imageSrc: "/assets/Portrait/dsc03530.jpg",
        captionTitle: "Editorial Excellence",
        captionSubtitle: "Riya & Kabir"
      }
    ]
  }
];

export const mockEvents: Event[] = [
  { id: "EVT001", name: "Kaustubh & Sayali Wedding", date: "2025-06-23", type: "Wedding", photoCount: 342, qrCode: "SS-EVT-001" },
  { id: "EVT002", name: "Rohan & Priya Maternity", date: "2025-07-15", type: "Maternity", photoCount: 87, qrCode: "SS-EVT-002" },
  { id: "EVT003", name: "TechCorp Annual Meet", date: "2025-08-10", type: "Corporate", photoCount: 156, qrCode: "SS-EVT-003" }
];

// Using placeholder images for high-end feel
export const mockPhotos: Photo[] = [
  { id: 1, src: "https://images.unsplash.com/photo-1519741497674-611481863552", event: "EVT001", tags: ["wedding", "couple"] },
  { id: 2, src: "https://images.unsplash.com/photo-1621252119036-7c919d854d19", event: "EVT001", tags: ["wedding", "ceremony"] },
  { id: 3, src: "https://images.unsplash.com/photo-1606216794074-735e91aa2c02", event: "EVT001", tags: ["wedding", "portrait"] },
  { id: 4, src: "https://images.unsplash.com/photo-1596464716127-f2a82984de30", event: "EVT002", tags: ["maternity"] },
  { id: 5, src: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622", event: "EVT003", tags: ["corporate"] },
  { id: 6, src: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc", event: "EVT001", tags: ["wedding", "reception"] }
];

export const mockTeamApplications: TeamApplication[] = [
  { id: 1, name: "Ankit Verma", email: "ankit@gmail.com", phone: "9876501234", experience: 3, specialization: ["Wedding", "Portrait"], portfolioUrl: "https://ankit.portfolio.com", status: "Pending" },
  { id: 2, name: "Sunita Rao", email: "sunita@gmail.com", phone: "9876501235", experience: 5, specialization: ["Corporate", "Events"], portfolioUrl: "https://sunita.portfolio.com", status: "Approved" }
];

export const mockStats = {
  totalBookings: 127,
  pendingBookings: 14,
  totalRevenue: 387500,
  teamMembers: 8,
  eventsThisMonth: 6,
  photosUploaded: 4823
};
