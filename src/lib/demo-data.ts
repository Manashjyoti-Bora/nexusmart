/**
 * Demo catalog — used to SEED the database on first run, and as the
 * fallback catalog in DEMO_MODE (no MONGODB_URI set).
 * Emojis instead of external image URLs = product visuals can never break.
 */

export type DemoProduct = {
  _id: string;
  slug: string;
  name: string;
  description: string;
  price: number;
  category: string;
  emoji: string;
  stock: number;
  featured: boolean;
};

export const demoProducts: DemoProduct[] = [
  {
    _id: "demo-1",
    slug: "nexus-headphones-pro",
    name: "Nexus Headphones Pro",
    description:
      "Studio-grade wireless headphones with active noise cancellation, 40-hour battery life and ultra-low latency mode for creators.",
    price: 8999,
    category: "Audio",
    emoji: "🎧",
    stock: 42,
    featured: true,
  },
  {
    _id: "demo-2",
    slug: "nexus-watch-x",
    name: "Nexus Watch X",
    description:
      "AMOLED smartwatch with 14-day battery, SpO2 + heart-rate tracking, 120 sport modes and Bluetooth calling.",
    price: 5499,
    category: "Wearables",
    emoji: "⌚",
    stock: 67,
    featured: true,
  },
  {
    _id: "demo-3",
    slug: "nexus-mech-keyboard",
    name: "Nexus Mech Keyboard",
    description:
      "Hot-swappable 75% mechanical keyboard with RGB per-key lighting, gasket mount and tri-mode connectivity.",
    price: 6499,
    category: "Accessories",
    emoji: "⌨️",
    stock: 30,
    featured: true,
  },
  {
    _id: "demo-4",
    slug: "nexus-buds-air",
    name: "Nexus Buds Air",
    description:
      "True wireless earbuds with adaptive ANC, wireless charging case and studio-tuned 11mm drivers.",
    price: 2999,
    category: "Audio",
    emoji: "🎵",
    stock: 120,
    featured: false,
  },
  {
    _id: "demo-5",
    slug: "nexus-power-100w",
    name: "Nexus Power 100W",
    description:
      "GaN fast charger with 100W output, three ports, and intelligent power distribution for laptop + phone + buds.",
    price: 3499,
    category: "Accessories",
    emoji: "🔋",
    stock: 85,
    featured: false,
  },
  {
    _id: "demo-6",
    slug: "nexus-cam-4k",
    name: "Nexus Cam 4K",
    description:
      "4K webcam with AI auto-framing, dual noise-cancelling mics and a magnetic privacy shutter — built for remote work.",
    price: 4999,
    category: "Cameras",
    emoji: "📷",
    stock: 25,
    featured: false,
  },
  {
    _id: "demo-7",
    slug: "nexus-hub-8in1",
    name: "Nexus Hub 8-in-1",
    description:
      "USB-C hub with 4K HDMI, 3× USB-A, SD/microSD, 100W passthrough and gigabit ethernet in an aluminium shell.",
    price: 2499,
    category: "Accessories",
    emoji: "🔌",
    stock: 90,
    featured: false,
  },
  {
    _id: "demo-8",
    slug: "nexus-speaker-boom",
    name: "Nexus Speaker Boom",
    description:
      "Portable 30W speaker with 360° sound, IPX7 waterproofing, 24-hour playtime and party-link pairing.",
    price: 3999,
    category: "Audio",
    emoji: "🔊",
    stock: 55,
    featured: false,
  },
];

export const categories = ["All", "Audio", "Wearables", "Accessories", "Cameras"];
