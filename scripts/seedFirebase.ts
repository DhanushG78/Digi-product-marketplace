import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBXcWWonA295q-YGKB9szKer6dbJXfBjiM",
  authDomain: "digital-product-marketpl-958ad.firebaseapp.com",
  projectId: "digital-product-marketpl-958ad",
  storageBucket: "digital-product-marketpl-958ad.firebasestorage.app",
  messagingSenderId: "670207004662",
  appId: "1:670207004662:web:dc3d8bd51fd446a55e41d7"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const newItems = [
  {
    creatorId: 'art@design.com',
    creatorName: 'Violet Designs',
    createdAt: new Date().toISOString(),
    title: 'Neon Typography Pack',
    description: '3D glowing neon letters for cyberpunk designs.',
    price: 18.00,
    category: 'asset',
    fileType: 'png',
    previewImages: ['https://images.unsplash.com/photo-1563206767-5b18f218e8de?w=800&q=80'],
    tags: ['typography', 'neon', 'cyberpunk']
  },
  {
    creatorId: 'creator@gmail.com',
    creatorName: 'Neo Studio',
    createdAt: new Date().toISOString(),
    title: 'AI Startup Landing Page',
    description: 'Modern Figma template for AI tool websites.',
    price: 35.00,
    category: 'ui-kit',
    fileType: 'figma',
    previewImages: ['https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80'],
    tags: ['ai', 'startup', 'figma']
  },
  {
    creatorId: 'systems@pro.net',
    creatorName: 'DevBoost',
    createdAt: new Date().toISOString(),
    title: 'Next.js 14 Handbook',
    description: 'Master App Router, Server Actions, and more.',
    price: 29.00,
    category: 'ebook',
    fileType: 'pdf',
    previewImages: ['https://images.unsplash.com/photo-1618477247222-ac60c6218780?w=800&q=80'],
    tags: ['nextjs', 'react', 'ebook']
  },
  {
    creatorId: 'creator@gmail.com',
    creatorName: 'Zen Systems',
    createdAt: new Date().toISOString(),
    title: 'Student OS',
    description: 'Notion system for class schedules, notes, and task management.',
    price: 15.00,
    category: 'template',
    fileType: 'zip',
    previewImages: ['https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&q=80'],
    tags: ['notion', 'student', 'productivity']
  },
  {
    creatorId: 'motion@visuals.net',
    creatorName: 'Flow Motion',
    createdAt: new Date().toISOString(),
    title: 'Kinetic Typography Templates',
    description: 'After Effects templates for dynamic text animations.',
    price: 22.00,
    category: 'asset',
    fileType: 'zip',
    previewImages: ['https://images.unsplash.com/photo-1626544827763-d516dce335e2?w=800&q=80'],
    tags: ['video', 'after-effects', 'typography']
  },
  {
    creatorId: 'audio@studio.com',
    creatorName: 'Wave Audio',
    createdAt: new Date().toISOString(),
    title: 'Futuristic UI Sounds',
    description: 'Beeps, clicks, and swooshes for modern interfaces.',
    price: 12.00,
    category: 'asset',
    fileType: 'zip',
    previewImages: ['https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=800&q=80'],
    tags: ['audio', 'ui', 'sfx']
  },
  {
    creatorId: 'creator@gmail.com',
    creatorName: 'Neo Studio',
    createdAt: new Date().toISOString(),
    title: 'SaaS Admin Dashboard',
    description: 'Light and dark mode admin dashboard UI kit.',
    price: 49.00,
    category: 'ui-kit',
    fileType: 'figma',
    previewImages: ['https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80'],
    tags: ['saas', 'dashboard', 'admin']
  },
  {
    creatorId: 'writer@words.com',
    creatorName: 'Jane Writer',
    createdAt: new Date().toISOString(),
    title: 'Email Marketing Masterclass',
    description: 'Build templates that convert leads into customers.',
    price: 39.00,
    category: 'ebook',
    fileType: 'pdf',
    previewImages: ['https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&q=80'],
    tags: ['marketing', 'email', 'ebook']
  },
  {
    creatorId: 'creator@gmail.com',
    creatorName: 'Zen Systems',
    createdAt: new Date().toISOString(),
    title: 'Freelance Invoice Generator',
    description: 'Automated invoice and contract templates in Notion.',
    price: 20.00,
    category: 'template',
    fileType: 'zip',
    previewImages: ['https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&q=80'],
    tags: ['notion', 'freelance', 'finance']
  },
  {
    creatorId: 'systems@pro.net',
    creatorName: 'DevBoost',
    createdAt: new Date().toISOString(),
    title: 'Python Web Scraping Guide',
    description: 'Learn Beautiful Soup, Selenium, and data extraction.',
    price: 24.00,
    category: 'ebook',
    fileType: 'pdf',
    previewImages: ['https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=800&q=80'],
    tags: ['python', 'scraping', 'ebook']
  },
  {
    creatorId: 'art@design.com',
    creatorName: 'Violet Designs',
    createdAt: new Date().toISOString(),
    title: 'Holographic Textures',
    description: 'Iridescent holographic backgrounds for modern web apps.',
    price: 15.00,
    category: 'asset',
    fileType: 'png',
    previewImages: ['https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80'],
    tags: ['textures', 'holographic', 'backgrounds']
  },
  {
    creatorId: 'creator@gmail.com',
    creatorName: 'Neo Studio',
    createdAt: new Date().toISOString(),
    title: 'Recipe App Figma Kit',
    description: 'Complete UI kit for food and recipe applications.',
    price: 28.00,
    category: 'ui-kit',
    fileType: 'figma',
    previewImages: ['https://images.unsplash.com/photo-1493770348161-369560ae357d?w=800&q=80'],
    tags: ['food', 'app', 'figma']
  },
  {
    creatorId: 'audio@studio.com',
    creatorName: 'Wave Audio',
    createdAt: new Date().toISOString(),
    title: 'Lo-Fi Jazz Chords',
    description: 'Royalty-free jazzy piano loops for beatmakers.',
    price: 19.00,
    category: 'asset',
    fileType: 'zip',
    previewImages: ['https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?w=800&q=80'],
    tags: ['audio', 'jazz', 'loops']
  },
  {
    creatorId: 'creator@gmail.com',
    creatorName: 'Zen Systems',
    createdAt: new Date().toISOString(),
    title: 'Personal CRM',
    description: 'Track networking contacts and relationships in Notion.',
    price: 14.00,
    category: 'template',
    fileType: 'zip',
    previewImages: ['https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&q=80'],
    tags: ['notion', 'crm', 'networking']
  },
  {
    creatorId: 'motion@visuals.net',
    creatorName: 'Flow Motion',
    createdAt: new Date().toISOString(),
    title: 'Light Leak Overlays',
    description: 'Organic film light leaks in 4K resolution.',
    price: 25.00,
    category: 'asset',
    fileType: 'zip',
    previewImages: ['https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&q=80'],
    tags: ['video', 'overlays', 'film']
  },
  {
    creatorId: 'writer@words.com',
    creatorName: 'Jane Writer',
    createdAt: new Date().toISOString(),
    title: 'Growth Hacking Strategies',
    description: 'Actionable tactics to grow your SaaS MRR.',
    price: 34.00,
    category: 'ebook',
    fileType: 'pdf',
    previewImages: ['https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80'],
    tags: ['growth', 'saas', 'ebook']
  },
  {
    creatorId: 'creator@gmail.com',
    creatorName: 'Neo Studio',
    createdAt: new Date().toISOString(),
    title: 'Fitness Tracker UI',
    description: 'Mobile interface design for workout tracking apps.',
    price: 45.00,
    category: 'ui-kit',
    fileType: 'figma',
    previewImages: ['https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&q=80'],
    tags: ['fitness', 'app', 'figma']
  },
  {
    creatorId: 'systems@pro.net',
    creatorName: 'DevBoost',
    createdAt: new Date().toISOString(),
    title: 'Mastering TypeScript',
    description: 'Advanced types, generics, and real-world patterns.',
    price: 32.00,
    category: 'ebook',
    fileType: 'pdf',
    previewImages: ['https://images.unsplash.com/photo-1516259762381-22954d7d3ad2?w=800&q=80'],
    tags: ['typescript', 'programming', 'ebook']
  },
  {
    creatorId: 'creator@gmail.com',
    creatorName: 'Zen Systems',
    createdAt: new Date().toISOString(),
    title: 'Job Hunt Tracker',
    description: 'Notion template to organize applications and interviews.',
    price: 9.00,
    category: 'template',
    fileType: 'zip',
    previewImages: ['https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=800&q=80'],
    tags: ['notion', 'career', 'tracker']
  },
  {
    creatorId: 'art@design.com',
    creatorName: 'Violet Designs',
    createdAt: new Date().toISOString(),
    title: 'Abstract 3D Shapes Vol. 2',
    description: 'More stunning, high-res geometric 3D renders.',
    price: 18.00,
    category: 'asset',
    fileType: 'png',
    previewImages: ['https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=800&q=80'],
    tags: ['3d', 'abstract', 'assets']
  }
];

async function seedItems() {
  try {
    const itemsCollection = collection(db, "items"); // Assuming your collection is 'items'
    let count = 0;
    for (const item of newItems) {
      await addDoc(itemsCollection, item);
      console.log(`Added item: ${item.title}`);
      count++;
    }
    console.log(`Successfully seeded ${count} items to Firestore.`);
    process.exit(0);
  } catch (error) {
    console.error("Error seeding data:", error);
    process.exit(1);
  }
}

seedItems();
