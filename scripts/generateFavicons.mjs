import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicDir = path.resolve(__dirname, '../public');

// High-resolution Master SVG for generating crisp favicons
const masterSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="none">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0a0e1a"/>
      <stop offset="100%" stop-color="#050810"/>
    </linearGradient>
    <linearGradient id="boltGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#00ffff"/>
      <stop offset="100%" stop-color="#00b4d8"/>
    </linearGradient>
    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="0" stdDeviation="16" flood-color="#00e5ff" flood-opacity="0.6"/>
    </filter>
  </defs>
  
  <!-- Outer Rounded Container -->
  <rect width="512" height="512" rx="128" fill="url(#bgGrad)"/>
  <rect width="504" height="504" x="4" y="4" rx="124" stroke="#00e5ff" stroke-width="8" stroke-opacity="0.3"/>
  
  <!-- Electric Energy Bolt (Centered) -->
  <path d="M340 120 L210 370 h-30 l60 -120 H150 l120 -130 h70 z" 
        fill="url(#boltGrad)" 
        stroke="#00ffff" 
        stroke-width="6" 
        stroke-linejoin="round"
        filter="url(#glow)"/>
</svg>`;

async function generate() {
  console.log('Generating crisp favicons for Google Search & Browsers...');
  
  const svgBuffer = Buffer.from(masterSvg);
  
  // Write master favicon.svg
  fs.writeFileSync(path.join(publicDir, 'favicon.svg'), masterSvg);

  const sizes = [
    { name: 'favicon-48x48.png', size: 48 },
    { name: 'favicon-96x96.png', size: 96 },
    { name: 'apple-touch-icon.png', size: 180 },
    { name: 'favicon-192x192.png', size: 192 },
    { name: 'favicon-512x512.png', size: 512 },
  ];

  for (const item of sizes) {
    const dest = path.join(publicDir, item.name);
    await sharp(svgBuffer)
      .resize(item.size, item.size)
      .png()
      .toFile(dest);
    console.log(`Generated ${item.name} (${item.size}x${item.size})`);
  }

  // Create favicon.ico (using 48x48 PNG)
  const ico48Buffer = await sharp(svgBuffer).resize(48, 48).png().toBuffer();
  fs.writeFileSync(path.join(publicDir, 'favicon.ico'), ico48Buffer);
  console.log('Generated favicon.ico');

  // Generate web manifest
  const manifest = {
    name: "Sai Enterprises",
    short_name: "Sai Enterprises",
    description: "Sai Enterprises — Premier Electrical Products Supplier & Wholesale Distributor in Rourkela, Odisha.",
    start_url: "/",
    display: "standalone",
    background_color: "#050810",
    theme_color: "#00e5ff",
    icons: [
      {
        src: "/favicon-48x48.png",
        sizes: "48x48",
        type: "image/png"
      },
      {
        src: "/favicon-96x96.png",
        sizes: "96x96",
        type: "image/png"
      },
      {
        src: "/favicon-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any maskable"
      },
      {
        src: "/favicon-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any maskable"
      }
    ]
  };

  fs.writeFileSync(path.join(publicDir, 'site.webmanifest'), JSON.stringify(manifest, null, 2));
  console.log('Generated site.webmanifest');
  console.log('Done!');
}

generate().catch(err => {
  console.error(err);
  process.exit(1);
});
