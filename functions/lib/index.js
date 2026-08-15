"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.sitemap = void 0;
const functions = __importStar(require("firebase-functions"));
const admin = __importStar(require("firebase-admin"));
admin.initializeApp();
const DOMAIN = 'https://saienterprises.in';
const STATIC_ROUTES = ['/', '/products', '/brands', '/gallery', '/about', '/faq', '/contact'];
const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes
// ---- In-memory cache ----
let cachedXml = null;
let cacheExpiry = 0;
function escapeXml(str) {
    return str.replace(/[<>&'"]/g, c => ({
        '<': '&lt;',
        '>': '&gt;',
        '&': '&amp;',
        "'": '&apos;',
        '"': '&quot;',
    }[c]));
}
async function buildSitemap() {
    const staticEntries = STATIC_ROUTES.map(r => `  <url><loc>${DOMAIN}${r}</loc></url>`).join('\n');
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
exports.sitemap = functions.https.onRequest(async (req, res) => {
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
    }
    catch (err) {
        console.error('[sitemap] Firestore query failed:', err);
        res.status(500).send('Internal Server Error: sitemap generation failed');
    }
});
