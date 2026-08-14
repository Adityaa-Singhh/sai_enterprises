/**
 * Firestore Seed Script — Sai Enterprises
 *
 * Run this ONCE to populate Firestore with the initial mock data from data.ts.
 * After running, the public website will read from Firestore instead of static data.
 *
 * IMPORTANT: This script requires Firebase Admin SDK.
 * Run it from Node.js, NOT from the browser.
 *
 * Usage:
 *   node scripts/seedFirestore.mjs
 *
 * Prerequisites:
 *   npm install firebase-admin
 *   Set GOOGLE_APPLICATION_CREDENTIALS env var to your service account JSON path
 *   OR set FIREBASE_PROJECT_ID for default credentials
 */

import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore, Timestamp } from 'firebase-admin/firestore';
import { readFileSync } from 'fs';

// ---------------------------------------------------------------------------
// Initialize Firebase Admin
// ---------------------------------------------------------------------------
const PROJECT_ID = 'saienterprises-90c6b';

if (getApps().length === 0) {
  try {
    // Try service account first
    const serviceAccount = JSON.parse(
      readFileSync('./serviceAccountKey.json', 'utf8')
    );
    initializeApp({ credential: cert(serviceAccount) });
    console.log('✅ Initialized with Service Account');
  } catch {
    // Fall back to Application Default Credentials
    initializeApp({ projectId: PROJECT_ID });
    console.log('✅ Initialized with Application Default Credentials');
  }
}

const db = getFirestore();
const now = Timestamp.now();

// ---------------------------------------------------------------------------
// MOCK DATA (copied from src/data.ts)
// ---------------------------------------------------------------------------

const categories = [
  { name: 'Switches', slug: 'switches', description: 'Modular switches, toggle switches, and smart switches for every need', icon: 'ToggleRight', productCount: 45, image: '/images/categories/switches.jpg', featured: true, active: true, sortOrder: 1 },
  { name: 'Sockets', slug: 'sockets', description: 'Power sockets, USB sockets, and multi-pin sockets', icon: 'Plug', productCount: 32, image: '/images/categories/sockets.jpg', featured: true, active: true, sortOrder: 2 },
  { name: 'Wires', slug: 'wires', description: 'House wiring, flexible wires, and industrial grade cables', icon: 'Cable', productCount: 28, image: '/images/categories/wires.jpg', featured: true, active: true, sortOrder: 3 },
  { name: 'Cables', slug: 'cables', description: 'Armoured cables, multi-core cables, and submersible cables', icon: 'Unplug', productCount: 22, image: '/images/categories/cables.jpg', featured: false, active: true, sortOrder: 4 },
  { name: 'Lighting', slug: 'lighting', description: 'LED bulbs, panel lights, downlights, and decorative lighting', icon: 'Lightbulb', productCount: 56, image: '/images/categories/lighting.jpg', featured: true, active: true, sortOrder: 5 },
  { name: 'MCB & Protection', slug: 'mcb-protection', description: 'MCBs, RCCBs, distribution boards, and surge protectors', icon: 'ShieldCheck', productCount: 38, image: '/images/categories/mcb.jpg', featured: true, active: true, sortOrder: 6 },
  { name: 'Fans', slug: 'fans', description: 'Ceiling fans, exhaust fans, table fans, and BLDC fans', icon: 'Fan', productCount: 24, image: '/images/categories/fans.jpg', featured: false, active: true, sortOrder: 7 },
  { name: 'Accessories', slug: 'accessories', description: 'Electrical tapes, junction boxes, conduits, and tools', icon: 'Wrench', productCount: 64, image: '/images/categories/accessories.jpg', featured: false, active: true, sortOrder: 8 },
  { name: 'Industrial', slug: 'industrial', description: 'Heavy-duty switches, industrial plugs, and panel components', icon: 'Factory', productCount: 30, image: '/images/categories/industrial.jpg', featured: false, active: true, sortOrder: 9 },
];

const brands = [
  { name: 'PMCona', slug: 'pmcona', logo: '/images/brands/pmcona.png', storagePath: null, description: "One of India's leading manufacturers of modular switches, sockets, and electrical accessories.", isAuthorized: true, categories: ['Switches', 'Sockets', 'Accessories', 'MCB & Protection'], tagline: 'Innovation in Every Switch', featured: true, active: true, sortOrder: 1 },
  { name: 'Havells', slug: 'havells', logo: '/images/brands/havells.png', storagePath: null, description: 'A trusted name in electrical equipment with a wide range of products.', isAuthorized: true, categories: ['Wires', 'Cables', 'Fans', 'Lighting', 'MCB & Protection'], tagline: "Wires That Don't Catch Fire", featured: true, active: true, sortOrder: 2 },
  { name: 'Polycab', slug: 'polycab', logo: '/images/brands/polycab.png', storagePath: null, description: "India's largest wires & cables manufacturer.", isAuthorized: true, categories: ['Wires', 'Cables', 'Fans', 'Lighting'], tagline: 'Expert in Wires & Cables', featured: true, active: true, sortOrder: 3 },
  { name: 'Anchor by Panasonic', slug: 'anchor', logo: '/images/brands/anchor.png', storagePath: null, description: 'Premium modular switches and sockets with Japanese technology.', isAuthorized: true, categories: ['Switches', 'Sockets', 'Accessories'], tagline: 'Switch to Smarter Living', featured: true, active: true, sortOrder: 4 },
  { name: 'Finolex', slug: 'finolex', logo: '/images/brands/finolex.png', storagePath: null, description: 'Pioneers in cable manufacturing with over 60 years of expertise.', isAuthorized: false, categories: ['Wires', 'Cables'], tagline: 'The Wire People', featured: false, active: true, sortOrder: 5 },
  { name: 'Crompton', slug: 'crompton', logo: '/images/brands/crompton.png', storagePath: null, description: 'A century-old brand known for reliable fans, lighting, and pumps.', isAuthorized: false, categories: ['Fans', 'Lighting'], tagline: 'Lighting Lives, Stirring Air', featured: false, active: true, sortOrder: 6 },
];

const testimonials = [
  { name: 'Rajesh Kumar', role: 'Homeowner', rating: 5, review: 'Excellent shop! I got all the switches and sockets for my new home from VoltEdge. Very genuine and fair pricing.', approved: true, featured: true, active: true },
  { name: 'Suresh Electricals', role: 'Electrician', rating: 5, review: "I have been buying all my electrical supplies from VoltEdge for over 3 years. They always have stock, give good rates for bulk orders, and the quality is always genuine.", approved: true, featured: true, active: true },
  { name: 'Priya Sharma', role: 'Interior Designer', rating: 5, review: 'VoltEdge has an impressive range of switches and sockets from top brands. Highly recommended!', approved: true, featured: false, active: true },
  { name: 'Manoj Constructions', role: 'Contractor', rating: 4, review: 'We regularly source wires, cables, and MCBs from VoltEdge for our construction projects. Competitive pricing and they always deliver on time.', approved: true, featured: false, active: true },
  { name: 'Anita Patel', role: 'Homeowner', rating: 5, review: 'Very professional shop. They explained the difference between various wire grades and helped me pick the safest option for my home.', approved: true, featured: false, active: true },
  { name: 'SK Traders', role: 'Business Owner', rating: 5, review: 'Best electrical shop in the area. They are authorized dealers for multiple brands which gives us confidence about genuine products.', approved: true, featured: false, active: true },
];

const faqs = [
  { question: 'What electrical products do you sell?', answer: 'We offer a complete range of electrical products including modular switches, sockets, wires, cables, MCBs, distribution boards, LED lighting, fans, and electrical accessories.', category: 'Products', sortOrder: 1, active: true },
  { question: 'Are you an authorized dealer for these brands?', answer: 'Yes, VoltEdge is an authorized dealer and distributor for PMCona and several other leading electrical brands. All products we sell are 100% genuine with manufacturer warranty.', category: 'Brands', sortOrder: 2, active: true },
  { question: 'Do you provide quotations for bulk orders?', answer: 'Absolutely! We provide competitive quotations for bulk and project-based orders. Contact us via WhatsApp or phone with your requirements.', category: 'Orders', sortOrder: 3, active: true },
  { question: 'What are your store timings?', answer: 'Our store is open Monday to Saturday from 9:00 AM to 8:00 PM. We are closed on Sundays and public holidays.', category: 'Store', sortOrder: 4, active: true },
  { question: 'Do you offer delivery?', answer: 'Yes, we offer local delivery for orders within the city. For large orders, we can arrange transport.', category: 'Delivery', sortOrder: 5, active: true },
  { question: 'Do the products come with warranty?', answer: "All branded products come with the manufacturer's standard warranty. Typically 1 to 10 years depending on product and brand.", category: 'Warranty', sortOrder: 6, active: true },
  { question: 'Can I return or exchange a product?', answer: 'Unused and unopened products can be returned or exchanged within 7 days of purchase with the original bill.', category: 'Returns', sortOrder: 7, active: true },
  { question: 'How can I check product availability?', answer: 'The fastest way is to send us a WhatsApp message with the product name or photo. We will confirm stock and pricing within minutes during business hours.', category: 'Products', sortOrder: 8, active: true },
  { question: 'Do you offer special rates for electricians and contractors?', answer: 'Yes, we offer special trade pricing for electricians, contractors, and regular customers. Visit our store or contact us to discuss trade account benefits.', category: 'Orders', sortOrder: 9, active: true },
];

const galleryImages = [
  { url: '/images/gallery/store-front.jpg', storagePath: '', alt: 'VoltEdge Store Front', category: 'exterior', featured: true, sortOrder: 1 },
  { url: '/images/gallery/interior-1.jpg', storagePath: '', alt: 'Store Interior — Wire Section', category: 'interior', featured: false, sortOrder: 2 },
  { url: '/images/gallery/products-display.jpg', storagePath: '', alt: 'Product Display Wall', category: 'products', featured: false, sortOrder: 3 },
  { url: '/images/gallery/brand-wall.jpg', storagePath: '', alt: 'Brand Display Area', category: 'brands', featured: false, sortOrder: 4 },
  { url: '/images/gallery/switches-rack.jpg', storagePath: '', alt: 'Switches Collection', category: 'products', featured: false, sortOrder: 5 },
  { url: '/images/gallery/wires-section.jpg', storagePath: '', alt: 'Wires & Cables Section', category: 'products', featured: false, sortOrder: 6 },
];

const businessInfo = {
  name: 'Sai Enterprises',
  tagline: 'Your Trusted Electrical Partner',
  fullName: 'Sai Enterprises Electricals',
  description: 'Premium electrical products supplier and authorized brand dealer serving homeowners, electricians, contractors, and businesses.',
  phone: '+91 79786 72521',
  phoneRaw: '917978672521',
  whatsapp: '+91 79786 72521',
  whatsappRaw: '917978672521',
  whatsappMessage: "Hi Sai Enterprises! I'm interested in your electrical products. Can you help me?",
  email: 'hello@saienterprises.in',
  address: {
    line1: 'Shop No. 12, Ground Floor',
    line2: 'Main Market Road, Sector 15',
    city: 'Gurugram',
    state: 'Haryana',
    pincode: '122001',
    full: 'Shop No. 12, Ground Floor, Main Market Road, Sector 15, Gurugram, Haryana 122001',
  },
  mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3507.1234567890!2d77.0266!3d28.4595!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjjCsDI3JzM0LjIiTiA3N8KwMDEnMzUuNiJF!5e0!3m2!1sen!2sin!4v1234567890',
  mapDirectionsUrl: 'https://www.google.com/maps/dir/?api=1&destination=28.4595,77.0266',
  hours: { weekdays: '9:00 AM — 8:00 PM', saturday: '9:00 AM — 8:00 PM', sunday: 'Closed' },
  social: { instagram: 'https://instagram.com/saienterprises', facebook: 'https://facebook.com/saienterprises', google: 'https://g.co/saienterprises' },
  experience: '15+',
  productsCount: '500+',
  brandsCount: '20+',
  customersServed: '5000+',
};

// ---------------------------------------------------------------------------
// Seed Helper
// ---------------------------------------------------------------------------
async function seedCollection(collectionName, records, idField = null) {
  console.log(`\n📁 Seeding ${collectionName}...`);
  const col = db.collection(collectionName);
  let count = 0;
  for (const record of records) {
    const data = { ...record, createdAt: now, updatedAt: now };
    if (idField && record[idField]) {
      await col.doc(record[idField]).set(data, { merge: true });
    } else {
      await col.add(data);
    }
    count++;
  }
  console.log(`   ✅ Seeded ${count} records into ${collectionName}`);
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
async function main() {
  console.log('🚀 Starting Firestore seed...');
  console.log(`📦 Project: ${PROJECT_ID}\n`);

  await seedCollection('categories', categories);
  await seedCollection('brands', brands);
  await seedCollection('testimonials', testimonials);
  await seedCollection('faqs', faqs);
  await seedCollection('gallery', galleryImages);

  // Business info — singleton document
  console.log('\n📁 Seeding businessInfo/main...');
  await db.collection('businessInfo').doc('main').set(
    { ...businessInfo, updatedAt: now },
    { merge: true }
  );
  console.log('   ✅ businessInfo/main seeded');

  console.log('\n✅ Seed complete!\n');
  console.log('⚠️  NEXT STEPS:');
  console.log('   1. Go to Firebase Console → Authentication → Add your admin user');
  console.log('   2. Copy the UID of the created user');
  console.log('   3. Run seedAdminUser.mjs with that UID to create the Firestore user document');
  console.log('   4. Then enable Firebase Authentication Email/Password in the console');
}

main().catch((err) => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});
