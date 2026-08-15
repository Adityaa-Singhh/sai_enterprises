import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();

const DOMAIN = 'https://saienterprises.in';
const STATIC_ROUTES = ['/', '/products', '/brands', '/gallery', '/about', '/faq', '/contact'];
const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes

// ---- In-memory cache ----
let cachedXml: string | null = null;
let cacheExpiry = 0;

function escapeXml(str: string): string {
  return str.replace(/[<>&'"]/g, c => ({
    '<': '&lt;',
    '>': '&gt;',
    '&': '&amp;',
    "'": '&apos;',
    '"': '&quot;',
  } as Record<string, string>)[c]);
}

async function buildSitemap(): Promise<string> {
  const staticEntries = STATIC_ROUTES.map(
    r => `  <url><loc>${DOMAIN}${r}</loc></url>`
  ).join('\n');

  const snapshot = await admin.firestore()
    .collection('products')
    .where('published', '==', true)
    .select('slug', 'updatedAt')
    .get();

  const productEntries = snapshot.docs
    .filter(doc => typeof doc.data().slug === 'string' && doc.data().slug.length > 0)
    .map(doc => {
      const { slug, updatedAt } = doc.data();
      const loc = escapeXml(`${DOMAIN}/products/${slug}`);
      const lastmod = updatedAt?.toDate?.()?.toISOString?.()
        ? `<lastmod>${updatedAt.toDate().toISOString()}</lastmod>`
        : '';
      return `  <url><loc>${loc}</loc>${lastmod}</url>`;
    })
    .join('\n');

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    staticEntries,
    productEntries,
    '</urlset>',
  ].filter(Boolean).join('\n');
}

// ---- HTTP Function: GET /sitemap.xml ----
export const sitemap = functions.https.onRequest(async (req, res) => {
  try {
    const now = Date.now();

    if (cachedXml && now < cacheExpiry) {
      res.set('Content-Type', 'application/xml');
      res.set('Cache-Control', 'public, max-age=600');
      res.send(cachedXml);
      return;
    }

    const xml = await buildSitemap();

    cachedXml = xml;
    cacheExpiry = now + CACHE_TTL_MS;

    res.set('Content-Type', 'application/xml');
    res.set('Cache-Control', 'public, max-age=600');
    res.send(xml);
  } catch (err) {
    console.error('[sitemap] Firestore query failed:', err);
    res.status(500).send('Internal Server Error: sitemap generation failed');
  }
});
