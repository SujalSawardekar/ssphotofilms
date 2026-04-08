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
  "PRE-WEDDING",
  "MATERNITY"
];

export const galleryStories: Story[] = [
  // WEDDINGS (10 Stories)
  {
    id: "w1",
    slug: "wedding-1",
    title: "A JOURNEY OF LOVE",
    category: "WEDDINGS",
    date: "JANUARY 12, 2025",
    names: "Aditya & Riya",
    mainImage: "/assets/wedding/Wedding 1/1ssp02947-copy.jpg",
    images: [
      "/assets/wedding/Wedding 1/1ssp02947-copy-(1).jpg",
      "/assets/wedding/Wedding 1/1ssp02947-copy.jpg",
      "/assets/wedding/Wedding 1/1ssp02954-copy.jpg"
    ]
  },
  {
    id: "w2",
    slug: "wedding-2",
    title: "ETERNAL VOWS",
    category: "WEDDINGS",
    date: "FEBRUARY 15, 2025",
    names: "Vikram & Anjali",
    mainImage: "/assets/wedding/Wedding 2/1ssp-(547)-copy.jpg",
    images: [
      "/assets/wedding/Wedding 2/1ssp-(547)-copy.jpg",
      "/assets/wedding/Wedding 2/1ssp-(676)-copy.jpg",
      "/assets/wedding/Wedding 2/1ssp-(708)-copy.jpg"
    ]
  },
  {
    id: "w3",
    slug: "wedding-3",
    title: "ROYAL CELEBRATION",
    category: "WEDDINGS",
    date: "MARCH 20, 2025",
    names: "Kunal & Meera",
    mainImage: "/assets/wedding/Wedding 3/1DSC04230 copy.jpg",
    images: [
      "/assets/wedding/Wedding 3/1DSC04230 copy.jpg",
      "/assets/wedding/Wedding 3/1ssp08616-copy.jpg",
      "/assets/wedding/Wedding 3/1SSP08969 copy.jpg"
    ]
  },
  {
    id: "w4",
    slug: "wedding-4",
    title: "SOULFUL UNION",
    category: "WEDDINGS",
    date: "APRIL 10, 2025",
    names: "Siddharth & Sneha",
    mainImage: "/assets/wedding/Wedding 4/1ssp01096-copy.jpg",
    images: [
      "/assets/wedding/Wedding 4/1ssp01096-copy.jpg",
      "/assets/wedding/Wedding 4/1SSP07967 copy.jpg",
      "/assets/wedding/Wedding 4/1ssp07967-copy.jpg"
    ]
  },
  {
    id: "w5",
    slug: "wedding-5",
    title: "TRADITIONAL TIES",
    category: "WEDDINGS",
    date: "MAY 05, 2025",
    names: "Rahul & Tanvi",
    mainImage: "/assets/wedding/Wedding 5/1SSP09080 copy.jpg",
    images: [
      "/assets/wedding/Wedding 5/1SSP09080 copy.jpg",
      "/assets/wedding/Wedding 5/1SSP09220 copy.jpg",
      "/assets/wedding/Wedding 5/1ssp09220-copy.jpg"
    ]
  },
  {
    id: "w6",
    slug: "wedding-6",
    title: "GLORIOUS BEGINNINGS",
    category: "WEDDINGS",
    date: "JUNE 18, 2025",
    names: "Amit & Pooja",
    mainImage: "/assets/wedding/Wedding 6/1SSP01206 copy.jpg",
    images: [
      "/assets/wedding/Wedding 6/1SSP01206 copy.jpg",
      "/assets/wedding/Wedding 6/1SSP01215 copy.jpg",
      "/assets/wedding/Wedding 6/1SSP01217 copy.jpg"
    ]
  },
  {
    id: "w7",
    slug: "wedding-7",
    title: "SACRED KNOTS",
    category: "WEDDINGS",
    date: "JULY 22, 2025",
    names: "Rohan & Shruti",
    mainImage: "/assets/wedding/Wedding 7/11SSP01811 copy.jpg",
    images: [
      "/assets/wedding/Wedding 7/11SSP01811 copy.jpg",
      "/assets/wedding/Wedding 7/1SSP01126 copy.jpg",
      "/assets/wedding/Wedding 7/1SSP01462 copy.jpg"
    ]
  },
  {
    id: "w8",
    slug: "wedding-8",
    title: "TIMELESS VOWS",
    category: "WEDDINGS",
    date: "AUGUST 14, 2025",
    names: "Varun & Isha",
    mainImage: "/assets/wedding/Wedding 8/1DSC00787 copy.jpg",
    images: [
      "/assets/wedding/Wedding 8/1DSC00787 copy.jpg",
      "/assets/wedding/Wedding 8/1dsc00787-copy.jpg",
      "/assets/wedding/Wedding 8/1DSC00808 copy.jpg"
    ]
  },
  {
    id: "w9",
    slug: "wedding-9",
    title: "CULTURAL HARMONY",
    category: "WEDDINGS",
    date: "SEPTEMBER 30, 2025",
    names: "Deepak & Aarti",
    mainImage: "/assets/wedding/Wedding 9/1SSP04623 copy.jpg",
    images: [
      "/assets/wedding/Wedding 9/1SSP04623 copy.jpg",
      "/assets/wedding/Wedding 9/1SSP04640 copy.jpg",
      "/assets/wedding/Wedding 9/1SSP04653 copy.jpg"
    ]
  },
  {
    id: "w10",
    slug: "wedding-10",
    title: "CELESTIAL CEREMONY",
    category: "WEDDINGS",
    date: "OCTOBER 15, 2025",
    names: "Abhishek & Neha",
    mainImage: "/assets/wedding/Wedding 10/1SSP05827 copy.jpg",
    images: [
      "/assets/wedding/Wedding 10/1SSP05827 copy.jpg",
      "/assets/wedding/Wedding 10/1SSP05830 copy.jpg",
      "/assets/wedding/Wedding 10/1SSP06137 copy.jpg"
    ]
  },

  // PRE-WEDDING (4 Stories)
  {
    id: "pw1",
    slug: "pre-wedding-1",
    title: "THE FIRST CHAPTER",
    category: "PRE-WEDDING",
    date: "NOVEMBER 05, 2025",
    names: "Arjun & Kavya",
    mainImage: "/assets/prewedding/Pre wedding 1/dsc03154.jpg",
    images: [
      "/assets/prewedding/Pre wedding 1/dsc03154.jpg",
      "/assets/prewedding/Pre wedding 1/dsc03155.jpg",
      "/assets/prewedding/Pre wedding 1/dsc03159.jpg"
    ]
  },
  {
    id: "pw2",
    slug: "pre-wedding-2",
    title: "URBAN ROMANCE",
    category: "PRE-WEDDING",
    date: "DECEMBER 12, 2025",
    names: "Siddharth & Ananya",
    mainImage: "/assets/prewedding/Prewedding 2/dsc00896.jpg",
    images: [
      "/assets/prewedding/Prewedding 2/dsc00896.jpg",
      "/assets/prewedding/Prewedding 2/dsc00909.jpg",
      "/assets/prewedding/Prewedding 2/dsc00928.jpg"
    ]
  },
  {
    id: "pw3",
    slug: "pre-wedding-3",
    title: "NATURE'S EMBRACE",
    category: "PRE-WEDDING",
    date: "JANUARY 20, 2026",
    names: "Rahul & Sneha",
    mainImage: "/assets/prewedding/Pre wedding 3/1ssp01083-copy.jpg",
    images: [
      "/assets/prewedding/Pre wedding 3/1ssp01083-copy.jpg",
      "/assets/prewedding/Pre wedding 3/1ssp01143-copy.jpg"
    ]
  },
  {
    id: "pw4",
    slug: "pre-wedding-4",
    title: "COASTAL ROMANCE",
    category: "PRE-WEDDING",
    date: "FEBRUARY 18, 2026",
    names: "Amit & Priya",
    mainImage: "/assets/prewedding/Pre wedding 4/1dsc01960-copy.jpg",
    images: [
      "/assets/prewedding/Pre wedding 4/1dsc01960-copy.jpg",
      "/assets/prewedding/Pre wedding 4/1dsc02006-copy.jpg",
      "/assets/prewedding/Pre wedding 4/1ssp08569-copy.jpg"
    ]
  },

  // MATERNITY (7 Stories)
  {
    id: "m1",
    slug: "maternity-1",
    title: "MOMENTS OF GRACE",
    category: "MATERNITY",
    date: "MARCH 10, 2025",
    names: "Mrs. Singhania",
    mainImage: "/assets/Maternity/Maternity 1/11SSP01284 copy.jpg",
    images: [
      "/assets/Maternity/Maternity 1/11SSP01284 copy.jpg",
      "/assets/Maternity/Maternity 1/1SSP06897 copy.jpg",
      "/assets/Maternity/Maternity 1/1SSP06919 copy.jpg"
    ]
  },
  {
    id: "m2",
    slug: "maternity-2",
    title: "LIFE'S NEWEST BLOSSOM",
    category: "MATERNITY",
    date: "APRIL 05, 2025",
    names: "Mrs. Kapoor",
    mainImage: "/assets/Maternity/Maternity 2/1SSP01262 copy.jpg",
    images: [
      "/assets/Maternity/Maternity 2/1SSP01262 copy.jpg",
      "/assets/Maternity/Maternity 2/1SSP01267-Recovered.jpg",
      "/assets/Maternity/Maternity 2/1SSP01284 copy.jpg"
    ]
  },
  {
    id: "m3",
    slug: "maternity-3",
    title: "RADIANT MOTHERHOOD",
    category: "MATERNITY",
    date: "MAY 20, 2025",
    names: "Mrs. Sharma",
    mainImage: "/assets/Maternity/Maternity 3/01.jpg",
    images: [
      "/assets/Maternity/Maternity 3/01.jpg",
      "/assets/Maternity/Maternity 3/02.jpg",
      "/assets/Maternity/Maternity 3/1SSP05627 copy.jpg"
    ]
  },
  {
    id: "m4",
    slug: "maternity-4",
    title: "BEAUTIFUL BEGINNINGS",
    category: "MATERNITY",
    date: "JUNE 15, 2025",
    names: "Mrs. Verma",
    mainImage: "/assets/Maternity/Maternity 4/11SSP03849 copy.jpg",
    images: [
      "/assets/Maternity/Maternity 4/11SSP03849 copy.jpg",
      "/assets/Maternity/Maternity 4/1SSP03843 copy.jpg",
      "/assets/Maternity/Maternity 4/1SSP03851 copy.jpg"
    ]
  },
  {
    id: "m5",
    slug: "maternity-5",
    title: "GLOW OF MOTHERHOOD",
    category: "MATERNITY",
    date: "JULY 10, 2025",
    names: "Mrs. Deshmukh",
    mainImage: "/assets/Maternity/Maternity 5/1C0167T01 copy.jpg",
    images: [
      "/assets/Maternity/Maternity 5/1C0167T01 copy.jpg",
      "/assets/Maternity/Maternity 5/1SSP06663 copy.jpg",
      "/assets/Maternity/Maternity 5/1SSP06693 copy.jpg"
    ]
  },
  {
    id: "m6",
    slug: "maternity-6",
    title: "WAITING FOR JOY",
    category: "MATERNITY",
    date: "AUGUST 22, 2025",
    names: "Mrs. Reddy",
    mainImage: "/assets/Maternity/Maternity 6/1SSP00983 copy.jpg",
    images: [
      "/assets/Maternity/Maternity 6/1SSP00983 copy.jpg",
      "/assets/Maternity/Maternity 6/1SSP04842 copy.jpg",
      "/assets/Maternity/Maternity 6/1SSP04893 copy.jpg"
    ]
  },
  {
    id: "m7",
    slug: "maternity-7",
    title: "PURE ANTICIPATION",
    category: "MATERNITY",
    date: "SEPTEMBER 30, 2025",
    names: "Mrs. Joshi",
    mainImage: "/assets/Maternity/Maternity 7/11SSP00808 copy.jpg",
    images: [
      "/assets/Maternity/Maternity 7/11SSP00808 copy.jpg",
      "/assets/Maternity/Maternity 7/1SSP00890 copy.jpg",
      "/assets/Maternity/Maternity 7/1SSP00915 copy.jpg"
    ]
  }
];
