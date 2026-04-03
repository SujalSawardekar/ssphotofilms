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
  originalPrice: number;
  discountPrice: number;
  features: string[];
  imageSrc: string;
  captionTitle: string;
  captionSubtitle: string;
}

export interface ServiceCategory {
  id: string;
  label: string;
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
    packages: [
      {
        title: "BASIC SHOOT",
        originalPrice: 15999,
        discountPrice: 14999,
        features: ["Photography Only", "25 Edited images", "4 hours shoot, 2 locations & 2 Dress Changes", "Full Frame Camera & 1 Photographer with Prime lens"],
        imageSrc: "/assets/occasion-wedding.jpg",
        captionTitle: "A Love That Grew With Them",
        captionSubtitle: "Kaustubh & Sayali"
      },
      {
        title: "PREMIUM SHOOT",
        originalPrice: 54999,
        discountPrice: 49999,
        features: ["Photography + Videography", "50 Edited images", "8 hours shoot, Multiple locations", "2 Photographers & Drone capture"],
        imageSrc: "/assets/gallery-1.jpg",
        captionTitle: "The Grand Celebration",
        captionSubtitle: "Rahul & Sneha"
      },
      {
        title: "LUXURY SHOOT",
        originalPrice: 84999,
        discountPrice: 79999,
        features: ["Candid Photo + Cinematic Video", "100 Edited images & 5min Trailer", "Full Day Coverage", "Full Team, Drone, Same Day Edit"],
        imageSrc: "/assets/gallery-2.jpg",
        captionTitle: "Royal Heritage Moments",
        captionSubtitle: "Vikas & Meera"
      }
    ]
  },
  {
    id: "pre-wedding",
    label: "Pre-Wedding",
    packages: [
      {
        title: "MINI SHOOT",
        originalPrice: 9999,
        discountPrice: 8999,
        features: ["Photography Only", "15 Edited images", "2 hours shoot, 1 location", "1 Photographer"],
        imageSrc: "/assets/gallery-3.jpg",
        captionTitle: "Sunrise Love",
        captionSubtitle: "Ajay & Pooja"
      },
      {
        title: "PREMIUM SHOOT",
        originalPrice: 19999,
        discountPrice: 17999,
        features: ["Photography + Highlight Reel", "30 Edited images", "4 hours shoot", "1 Photographer, 1 Videographer"],
        imageSrc: "/assets/gallery-4.jpg",
        captionTitle: "Mountain Retreat",
        captionSubtitle: "Samir & Tanya"
      }
    ]
  },
  {
    id: "baby-shoot",
    label: "Baby-Shoot",
    packages: [
      {
        title: "CUTE MOMENTS",
        originalPrice: 8999,
        discountPrice: 7999,
        features: ["Indoor Studio Shoot", "15 Edited images", "2 hours shoot", "Props included"],
        imageSrc: "/assets/occasion-baby.jpg",
        captionTitle: "First Steps",
        captionSubtitle: "Baby Aarav"
      }
    ]
  },
  {
    id: "maternity",
    label: "Maternity",
    packages: [
      {
        title: "CLASSIC MATERNITY",
        originalPrice: 12999,
        discountPrice: 11999,
        features: ["Outdoor Sunset Shoot", "20 Edited images", "3 hours shoot", "Gown provided (1)"],
        imageSrc: "/assets/occasion-maternity.jpg",
        captionTitle: "New Beginnings",
        captionSubtitle: "Neha & Raj"
      }
    ]
  },
  {
    id: "engagement",
    label: "Engagement",
    packages: [
      {
        title: "INTIMATE RING CEREMONY",
        originalPrice: 18999,
        discountPrice: 16999,
        features: ["Event Coverage", "40 Edited images", "4 hours", "1 Photographer & Assistant"],
        imageSrc: "/assets/gallery-8.jpg",
        captionTitle: "The Promise",
        captionSubtitle: "Vikram & Anjali"
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
