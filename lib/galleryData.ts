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
  "ENGAGEMENT",
  "PORTRAIT"
];

export const galleryStories: Story[] = [
  // WEDDINGS
  {
    id: "w1",
    slug: "wedding-session-1",
    title: "A TALE OF TWO HEARTS",
    category: "WEDDINGS",
    date: "JANUARY 10, 2026",
    names: "Rahul & Sneha (Session 1)",
    mainImage: "/assets/wedding/Wedding%201/1ssp02947-copy.jpg",
    images: [
      "/assets/wedding/Wedding%201/1ssp02947-copy.jpg",
      "/assets/wedding/Wedding%201/1ssp02954-copy.jpg",
      "/assets/wedding/Wedding%201/1ssp02959-copy.jpg",
      "/assets/wedding/Wedding%201/1ssp02966-copy.jpg",
      "/assets/wedding/Wedding%201/1ssp02985-copy.jpg"
    ]
  },
  {
    id: "w2",
    slug: "wedding-session-2",
    title: "VOWS UNDER THE STARS",
    category: "WEDDINGS",
    date: "JANUARY 22, 2026",
    names: "Vikram & Shweta (Session 2)",
    mainImage: "/assets/wedding/Wedding%202/1ssp02745-copy.jpg",
    images: [
      "/assets/wedding/Wedding%202/1ssp02745-copy.jpg",
      "/assets/wedding/Wedding%202/1ssp02751-copy.jpg",
      "/assets/wedding/Wedding%202/1ssp02707-copy.jpg",
      "/assets/wedding/Wedding%202/1ssp-(547)-copy.jpg",
      "/assets/wedding/Wedding%202/1ssp-(676)-copy.jpg"
    ]
  },
  {
    id: "w3",
    slug: "wedding-session-3",
    title: "ETERNAL LOVE CEREMONY",
    category: "WEDDINGS",
    date: "FEBRUARY 05, 2026",
    names: "Amit & Priya (Session 3)",
    mainImage: "/assets/wedding/Wedding%203/1ssp08616-copy.jpg",
    images: [
      "/assets/wedding/Wedding%203/1ssp08616-copy.jpg",
      "/assets/wedding/Wedding%203/1DSC04230%20copy.jpg",
      "/assets/wedding/Wedding%203/1SSP08969%20copy.jpg",
      "/assets/wedding/Wedding%203/occasion-wedding.jpg"
    ]
  },
  {
    id: "w4",
    slug: "wedding-session-4",
    title: "SACRED BONDS",
    category: "WEDDINGS",
    date: "FEBRUARY 18, 2026",
    names: "Sanjay & Meera (Session 4)",
    mainImage: "/assets/wedding/Wedding%204/1ssp01096-copy.jpg",
    images: [
      "/assets/wedding/Wedding%204/1ssp01096-copy.jpg",
      "/assets/wedding/Wedding%204/1SSP07967%20copy.jpg",
      "/assets/wedding/Wedding%204/1SSP07978%20copy.jpg"
    ]
  },
  {
    id: "w5",
    slug: "wedding-session-5",
    title: "A ROYAL AFFAIR",
    category: "WEDDINGS",
    date: "MARCH 02, 2026",
    names: "Kunal & Riya (Session 5)",
    mainImage: "/assets/wedding/Wedding%205/1SSP09220%20copy.jpg",
    images: [
      "/assets/wedding/Wedding%205/1SSP09220%20copy.jpg", 
      "/assets/wedding/Wedding%205/1SSP09253%20copy.jpg", 
      "/assets/wedding/Wedding%205/1SSP09080%20copy.jpg"
    ]
  },
  {
    id: "w6",
    slug: "wedding-session-6",
    title: "DREAMY WEDDING DAY",
    category: "WEDDINGS",
    date: "MARCH 15, 2026",
    names: "Deepak & Tanvi (Session 6)",
    mainImage: "/assets/wedding/Wedding%206/1SSP01206%20copy.jpg",
    images: [
      "/assets/wedding/Wedding%206/1SSP01206%20copy.jpg", 
      "/assets/wedding/Wedding%206/1SSP01215%20copy.jpg",
      "/assets/wedding/Wedding%206/1SSP01217%20copy.jpg"
    ]
  },
  {
    id: "w7",
    slug: "wedding-session-7",
    title: "THE PERFECT MATCH",
    category: "WEDDINGS",
    date: "APRIL 01, 2026",
    names: "Sameer & Ananya (Session 7)",
    mainImage: "/assets/wedding/Wedding%207/1SSP01747%20copy.jpg",
    images: [
      "/assets/wedding/Wedding%207/1SSP01747%20copy.jpg", 
      "/assets/wedding/Wedding%207/1SSP01701%20copy.jpg", 
      "/assets/wedding/Wedding%207/1SSP01640%20copy.jpg"
    ]
  },
  {
    id: "w8",
    slug: "wedding-session-8",
    title: "LOVE IN BLOOM",
    category: "WEDDINGS",
    date: "APRIL 20, 2026",
    names: "Arjun & Sneha (Session 8)",
    mainImage: "/assets/wedding/Wedding%208/1dsc00787-copy.jpg",
    images: [
      "/assets/wedding/Wedding%208/1dsc00787-copy.jpg", 
      "/assets/wedding/Wedding%208/1SSP08277%20copy.jpg"
    ]
  },
  {
    id: "w10",
    slug: "wedding-session-10",
    title: "MODERN LOVE STORY",
    category: "WEDDINGS",
    date: "MAY 25, 2026",
    names: "Rohan & Mehak (Session 10)",
    mainImage: "/assets/wedding/Wedding%2010/1SSP06294%20copy.jpg",
    images: [
      "/assets/wedding/Wedding%2010/1SSP06294%20copy.jpg", 
      "/assets/wedding/Wedding%2010/1SSP05827%20copy.jpg",
      "/assets/wedding/Wedding%2010/1SSP05830%20copy.jpg"
    ]
  },

  // PRE-WEDDING
  {
    id: "pw1",
    slug: "prewedding-session-1",
    title: "LOVE IN THE CITY",
    category: "PRE-WEDDING",
    date: "JUNE 10, 2026",
    names: "Siddharth & Ananya (Session 1)",
    mainImage: "/assets/prewedding/Pre%20wedding%201/ssp02832.jpg",
    images: [
      "/assets/prewedding/Pre%20wedding%201/ssp02832.jpg",
      "/assets/prewedding/Pre%20wedding%201/ssp02927.jpg",
      "/assets/prewedding/Pre%20wedding%201/dsc03154.jpg",
      "/assets/prewedding/Pre%20wedding%201/dsc03159.jpg"
    ]
  },
  {
    id: "pw2",
    slug: "prewedding-session-2",
    title: "FIELDS OF GOLD",
    category: "PRE-WEDDING",
    date: "JUNE 25, 2026",
    names: "Kunal & Riya (Session 2)",
    mainImage: "/assets/prewedding/Prewedding%202/dsc00896.jpg",
    images: [
      "/assets/prewedding/Prewedding%202/dsc00896.jpg",
      "/assets/prewedding/Prewedding%202/dsc00909.jpg",
      "/assets/prewedding/Prewedding%202/dsc01036.jpg",
      "/assets/prewedding/Prewedding%202/dsc01079.jpg"
    ]
  },
  {
    id: "pw3",
    slug: "prewedding-session-3",
    title: "RIVERSIDE ROMANCE",
    category: "PRE-WEDDING",
    date: "JULY 12, 2026",
    names: "Amit & Priya (Session 3)",
    mainImage: "/assets/prewedding/Pre%20wedding%203/1ssp01083-copy.jpg",
    images: [
      "/assets/prewedding/Pre%20wedding%203/1ssp01083-copy.jpg", 
      "/assets/prewedding/Pre%20wedding%203/1ssp01143-copy.jpg"
    ]
  },
  {
    id: "pw4",
    slug: "prewedding-session-4",
    title: "URBAN ESCAPE",
    category: "PRE-WEDDING",
    date: "JULY 30, 2026",
    names: "Rahul & Sneha (Session 4)",
    mainImage: "/assets/prewedding/Pre%20wedding%204/1ssp08804-copy.jpg",
    images: [
      "/assets/prewedding/Pre%20wedding%204/1ssp08804-copy.jpg", 
      "/assets/prewedding/Pre%20wedding%204/1dsc01960-copy.jpg"
    ]
  },

  // ENGAGEMENT
  {
    id: "e1",
    slug: "engagement-session-1",
    title: "THE PROMISE",
    category: "ENGAGEMENT",
    date: "AUGUST 05, 2026",
    names: "Vikram & Shweta",
    mainImage: "/assets/Engagement/1SSP04096%20copy.jpg",
    images: [
      "/assets/Engagement/1SSP04096%20copy.jpg",
      "/assets/Engagement/1SSP04205%20copy.jpg",
      "/assets/Engagement/1SSP04709%20copy.jpg",
      "/assets/Engagement/1SSP04721%20copy.jpg",
      "/assets/Engagement/1SSP04730%20copy.jpg"
    ]
  },
  {
    id: "e2",
    slug: "engagement-session-2",
    title: "A NEW CHAPTER",
    category: "ENGAGEMENT",
    date: "AUGUST 20, 2026",
    names: "Rahul & Sneha",
    mainImage: "/assets/Engagement/1SSP01019%20copy.jpg",
    images: [
      "/assets/Engagement/1SSP01019%20copy.jpg",
      "/assets/Engagement/1SSP01096%20copy.jpg",
      "/assets/Engagement/1SSP01943%20copy.jpg",
      "/assets/Engagement/1SSP01969%20copy.jpg"
    ]
  },
  {
    id: "e3",
    slug: "engagement-session-3",
    title: "LOVE IN FOCUS",
    category: "ENGAGEMENT",
    date: "SEPTEMBER 05, 2026",
    names: "Amit & Priya",
    mainImage: "/assets/Engagement/1SSP03215%20copy.jpg",
    images: [
      "/assets/Engagement/1SSP03215%20copy.jpg",
      "/assets/Engagement/1SSP03334%20copy.jpg",
      "/assets/Engagement/1SSP03356%20copy.jpg",
      "/assets/Engagement/1SSP03932%20copy.jpg"
    ]
  },
  {
    id: "e4",
    slug: "engagement-session-4",
    title: "HAND IN HAND",
    category: "ENGAGEMENT",
    date: "SEPTEMBER 22, 2026",
    names: "Sameer & Tanvi",
    mainImage: "/assets/Engagement/1SSP09251%20copy.jpg",
    images: [
      "/assets/Engagement/1SSP09251%20copy.jpg",
      "/assets/Engagement/1SSP09257%20copy.jpg",
      "/assets/Engagement/1SSP09266%20copy.jpg",
      "/assets/Engagement/1SSP09269%20copy.jpg",
      "/assets/Engagement/1SSP09299%20copy.jpg"
    ]
  },
  {
    id: "e5",
    slug: "engagement-session-5",
    title: "THE RING CEREMONY",
    category: "ENGAGEMENT",
    date: "OCTOBER 10, 2026",
    names: "Kunal & Riya",
    mainImage: "/assets/Engagement/1SSP09703%20copy.jpg",
    images: [
      "/assets/Engagement/1SSP09703%20copy.jpg",
      "/assets/Engagement/1SSP09719%20copy.jpg",
      "/assets/Engagement/1SSP09726%20copy.jpg",
      "/assets/Engagement/1SSP09751%20copy.jpg",
      "/assets/Engagement/1SSP09778%20copy.jpg"
    ]
  },

  // MATERNITY
  {
    id: "m1",
    slug: "maternity-session-1",
    title: "THE BLOSSOM OF LIFE",
    category: "MATERNITY",
    date: "OCTOBER 25, 2026",
    names: "Anjali & Vikram (S1)",
    mainImage: "/assets/Maternity/Maternity%201/1SSP06919%20copy.jpg",
    images: [
      "/assets/Maternity/Maternity%201/1SSP06919%20copy.jpg",
      "/assets/Maternity/Maternity%201/1SSP06947%20copy.jpg",
      "/assets/Maternity/Maternity%201/1SSP06964%20copy.jpg",
      "/assets/Maternity/Maternity%201/1SSP07015%20copy.jpg"
    ]
  },
  {
    id: "m2",
    slug: "maternity-session-2",
    title: "WAITING FOR MIRACLE",
    category: "MATERNITY",
    date: "NOVEMBER 10, 2026",
    names: "Sneha & Rahul (S2)",
    mainImage: "/assets/Maternity/Maternity%202/1SSP01383%20copy.jpg",
    images: [
      "/assets/Maternity/Maternity%202/1SSP01383%20copy.jpg",
      "/assets/Maternity/Maternity%202/1SSP01374%20copy.jpg",
      "/assets/Maternity/Maternity%202/1SSP01497%20copy.jpg"
    ]
  },
  {
    id: "m3",
    slug: "maternity-session-3",
    title: "MOTHERHOOD ESSENCE",
    category: "MATERNITY",
    date: "NOVEMBER 25, 2026",
    names: "Priya & Amit (S3)",
    mainImage: "/assets/Maternity/Maternity%203/01.jpg",
    images: [
      "/assets/Maternity/Maternity%203/01.jpg",
      "/assets/Maternity/Maternity%203/02.jpg",
      "/assets/Maternity/Maternity%203/1SSP05627%20copy.jpg",
      "/assets/Maternity/Maternity%203/1SSP05635%20copy.jpg"
    ]
  },
  {
    id: "m4",
    slug: "maternity-session-4",
    title: "PURE JOY",
    category: "MATERNITY",
    date: "DECEMBER 05, 2026",
    names: "Tanvi & Sameer (S4)",
    mainImage: "/assets/Maternity/Maternity%204/1SSP03843%20copy.jpg",
    images: [
      "/assets/Maternity/Maternity%204/1SSP03843%20copy.jpg",
      "/assets/Maternity/Maternity%204/1SSP03851%20copy.jpg",
      "/assets/Maternity/Maternity%204/1SSP04040%20copy.jpg"
    ]
  },
  {
    id: "m5",
    slug: "maternity-session-5",
    title: "RADIANT MOTHER",
    category: "MATERNITY",
    date: "DECEMBER 20, 2026",
    names: "Meera & Sanjay (S5)",
    mainImage: "/assets/Maternity/Maternity%205/1SSP06663%20copy.jpg",
    images: [
      "/assets/Maternity/Maternity%205/1SSP06663%20copy.jpg",
      "/assets/Maternity/Maternity%205/1SSP06693%20copy.jpg",
      "/assets/Maternity/Maternity%205/Post.jpg"
    ]
  },
  {
    id: "m6",
    slug: "maternity-session-6",
    title: "NEW BEGINNINGS",
    category: "MATERNITY",
    date: "JANUARY 05, 2027",
    names: "Riya & Kunal (S6)",
    mainImage: "/assets/Maternity/Maternity%206/1SSP00983%20copy.jpg",
    images: [
      "/assets/Maternity/Maternity%206/1SSP00983%20copy.jpg", 
      "/assets/Maternity/Maternity%206/1SSP04842%20copy.jpg",
      "/assets/Maternity/Maternity%206/post%20(1).jpg"
    ]
  },
  {
    id: "m7",
    slug: "maternity-session-7",
    title: "BLESSED JOURNEY",
    category: "MATERNITY",
    date: "JANUARY 15, 2027",
    names: "Swati & Manoj (S7)",
    mainImage: "/assets/Maternity/Maternity%207/1SSP00915%20copy.jpg",
    images: [
      "/assets/Maternity/Maternity%207/1SSP00915%20copy.jpg",
      "/assets/Maternity/Maternity%207/1SSP00890%20copy.jpg"
    ]
  },

  // BABY & KIDS
  {
    id: "bk1",
    slug: "baby-session-1",
    title: "FIRST SMILES",
    category: "BABY & KIDS",
    date: "FEBRUARY 01, 2027",
    names: "Arav (S1)",
    mainImage: "/assets/Babyshoot/occasion-baby.jpg",
    images: [
      "/assets/Babyshoot/occasion-baby.jpg",
      "/assets/Babyshoot/gallery-8.jpg"
    ]
  },
  {
    id: "bk2",
    slug: "baby-session-2",
    title: "LITTLE WONDERS",
    category: "BABY & KIDS",
    date: "FEBRUARY 15, 2027",
    names: "Kiara (S2)",
    mainImage: "/assets/Babyshoot/occasion-birthday.jpg",
    images: [
      "/assets/Babyshoot/occasion-birthday.jpg",
      "/assets/Babyshoot/gallery-5.jpeg"
    ]
  },

  // PORTRAIT
  {
    id: "p1",
    slug: "portrait-session-1",
    title: "SOULFUL EYES",
    category: "PORTRAIT",
    date: "MARCH 10, 2027",
    names: "Elegant Portraits (S1)",
    mainImage: "/assets/Portrait/1dsc00518-copy.jpg",
    images: [
      "/assets/Portrait/1dsc00518-copy.jpg",
      "/assets/Portrait/1dsc03312-copy.jpg",
      "/assets/Portrait/dsc03530.jpg"
    ]
  },
  {
    id: "p2",
    slug: "portrait-session-2",
    title: "ESSENCE OF SELF",
    category: "PORTRAIT",
    date: "MARCH 25, 2027",
    names: "Studio Portraits (S2)",
    mainImage: "/assets/Portrait/gallery-2.jpg",
    images: [
      "/assets/Portrait/gallery-2.jpg",
      "/assets/Portrait/gallery-6.jpg",
      "/assets/Portrait/gallery-1.jpg"
    ]
  },

  // HALDI
  {
    id: "h1",
    slug: "haldi-session-1",
    title: "VIBRANT TRADITIONS",
    category: "HALDI",
    date: "JULY 10, 2025",
    names: "Rahul & Sneha (Session 1)",
    mainImage: "/assets/haldi/1SSP00923%20copy.jpg",
    images: [
      "/assets/haldi/1SSP00923%20copy.jpg",
      "/assets/haldi/1SSP00943%20copy.jpg",
      "/assets/haldi/1SSP01032%20copy.jpg",
      "/assets/haldi/1SSP01066%20copy.jpg"
    ]
  },
  {
    id: "h2",
    slug: "haldi-session-2",
    title: "GOLDEN HUES",
    category: "HALDI",
    date: "JULY 22, 2025",
    names: "Vikram & Shweta (Session 2)",
    mainImage: "/assets/haldi/1SSP02809%20copy.jpg",
    images: [
      "/assets/haldi/1SSP02809%20copy.jpg",
      "/assets/haldi/1SSP02861%20copy.jpg",
      "/assets/haldi/1SSP02924%20copy.jpg",
      "/assets/haldi/1SSP03080%20copy.jpg",
      "/assets/haldi/1SSP03190%20copy.jpg"
    ]
  },
  {
    id: "h3",
    slug: "haldi-session-3",
    title: "YELLOW CELEBRATIONS",
    category: "HALDI",
    date: "AUGUST 05, 2025",
    names: "Amit & Priya (Session 3)",
    mainImage: "/assets/haldi/1SSP08319%20copy.jpg",
    images: [
      "/assets/haldi/1SSP08319%20copy.jpg",
      "/assets/haldi/1SSP08510%20copy.jpg",
      "/assets/haldi/1SSP08545%20copy.jpg",
      "/assets/haldi/Post%201.jpg"
    ]
  },
  {
    id: "h4",
    slug: "haldi-session-4",
    title: "TRUE COLORS",
    category: "HALDI",
    date: "AUGUST 15, 2025",
    names: "Sanjay & Meera (Session 4)",
    mainImage: "/assets/haldi/1SSP02634%20copy.jpg",
    images: [
      "/assets/haldi/1SSP02634%20copy.jpg",
      "/assets/haldi/1SSP02656%20copy.jpg",
      "/assets/haldi/Post%202.jpg",
      "/assets/haldi/Post%203.jpg"
    ]
  }
];
