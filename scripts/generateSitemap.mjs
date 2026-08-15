/**
 * Static Sitemap Generator for Sai Enterprises
 * 
 * Run with: npm run build:sitemap
 * 
 * Fetches published products from Firestore (or uses fallback data)
 * and generates a clean, SEO-optimized public/sitemap.xml file.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const PUBLIC_SITEMAP_PATH = path.join(ROOT_DIR, 'public', 'sitemap.xml');

const DOMAIN = 'https://saienterprises.in';

const STATIC_ROUTES = [
  { url: '/', priority: '1.0', changefreq: 'weekly' },
  { url: '/products', priority: '0.9', changefreq: 'daily' },
  { url: '/brands', priority: '0.8', changefreq: 'monthly' },
  { url: '/about', priority: '0.7', changefreq: 'monthly' },
  { url: '/gallery', priority: '0.6', changefreq: 'monthly' },
  { url: '/faq', priority: '0.6', changefreq: 'monthly' },
  { url: '/testimonials', priority: '0.6', changefreq: 'monthly' },
  { url: '/contact', priority: '0.8', changefreq: 'monthly' },
];

async function getProductSlugs() {
  // 1. Try to fetch live published products from Firestore REST API (no admin SDK required)
  try {
    const projectId = 'saienterprises-90c6b';
    const firestoreUrl = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/products?pageSize=300`;
    const res = await fetch(firestoreUrl);
    
    if (res.ok) {
      const data = await res.json();
      if (data.documents && data.documents.length > 0) {
        const liveProducts = [];
        for (const doc of data.documents) {
          const fields = doc.fields || {};
          const isPublished = fields.published?.booleanValue !== false;
          const slug = fields.slug?.stringValue;
          const updatedAt = doc.updateTime ? doc.updateTime.split('T')[0] : null;
          
          if (slug && isPublished) {
            liveProducts.push({ slug, updatedAt });
          }
        }
        if (liveProducts.length > 0) {
          console.log(`[sitemap] Successfully fetched ${liveProducts.length} published products from Firestore.`);
          return liveProducts;
        }
      }
    }
  } catch (err) {
    console.warn('[sitemap] Notice: Could not fetch from Firestore REST API, using fallback data.', err.message);
  }

  // 2. Fallback products list from data.ts
  const fallbackSlugs = [
    'pmcona-6a-one-way-switch',
    'pmcona-16a-socket-shutter',
    'polycab-optima-plus-wire',
    'havells-32a-mcb-single-pole',
    'crompton-energion-bldc-fan',
    'havells-12w-led-panel',
    'pmcona-8way-tpn-db',
    'finolex-4sqmm-fr-lsh',
    'anchor-roma-20a-switch',
    'havells-lumeno-15w-led',
    'polycab-3c-armoured-cable',
    'pmcona-electrical-tape-pack'
  ];

  return fallbackSlugs.map(slug => ({ slug, updatedAt: null }));
}

async function generate() {
  const products = await getProductSlugs();
  const today = new Date().toISOString().split('T')[0];

  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
  xml += '  <!-- Core Static Pages -->\n';

  for (const page of STATIC_ROUTES) {
    xml += '  <url>\n';
    xml += `    <loc>${DOMAIN}${page.url}</loc>\n`;
    xml += `    <changefreq>${page.changefreq}</changefreq>\n`;
    xml += `    <priority>${page.priority}</priority>\n`;
    xml += '  </url>\n';
  }

  xml += '\n  <!-- Product Pages -->\n';
  for (const prod of products) {
    xml += '  <url>\n';
    xml += `    <loc>${DOMAIN}/products/${prod.slug}</loc>\n`;
    if (prod.updatedAt) {
      xml += `    <lastmod>${prod.updatedAt}</lastmod>\n`;
    }
    xml += '    <changefreq>weekly</changefreq>\n';
    xml += '    <priority>0.8</priority>\n';
    xml += '  </url>\n';
  }

  xml += '</urlset>\n';

  fs.writeFileSync(PUBLIC_SITEMAP_PATH, xml, 'utf8');
  console.log(`[sitemap] Successfully generated static sitemap at: ${PUBLIC_SITEMAP_PATH}`);
}

generate().catch(console.error);
