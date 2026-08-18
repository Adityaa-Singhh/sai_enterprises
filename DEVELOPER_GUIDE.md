# 🧭 Sai Enterprises — Developer Onboarding & Architecture Guide

Welcome to the **Sai Enterprises (VoltEdge)** codebase! This guide gives you the mental model, file structure, data flow, and an exact roadmap for building and editing features.

---

## 1. High-Level Architecture (The Big Picture)

The application is structured into **two distinct sections**:

```
                              ┌─────────────────────────────────────────┐
                              │               index.html                │
                              │  (Static SEO, WebSite Schema, Favicons) │
                              └────────────────────┬────────────────────┘
                                                   │
                                                   ▼
                                       ┌───────────────────────┐
                                       │      src/main.tsx     │
                                       └───────────┬───────────┘
                                                   │
                                                   ▼
                                       ┌───────────────────────┐
                                       │      src/App.tsx      │
                                       │ (Providers & Routing) │
                                       └─────┬───────────┬─────┘
                                             │           │
                     ┌───────────────────────┘           └───────────────────────┐
                     ▼                                                           ▼
    ┌─────────────────────────────────┐                         ┌─────────────────────────────────┐
    │     PUBLIC WEBSITE (Catalog)    │                         │      ADMIN PORTAL (/admin)      │
    │  - Home, Products, Brands, etc. │                         │  - Protected Firebase Auth      │
    │  - PublicStore (SWR + Wakeup)   │                         │  - AdminStore (Realtime CRUD)   │
    │  - 1-Tap WhatsApp Trade Desk    │                         │  - Inventory, Enquiries, CMS    │
    └─────────────────────────────────┘                         └─────────────────────────────────┘
```

1. **The Public B2B Platform (`/`, `/products`, `/brands`, etc.)**:
   - High-performance, SEO-first, mobile-friendly catalog.
   - SWR data caching with automatic tab wake-up rehydration.
   - 1-tap WhatsApp RFQ (Request for Quote) dispatch system.
2. **The Enterprise Admin Portal (`/admin/*`)**:
   - Protected behind Firebase Authentication (`AuthProvider`).
   - Real-time inventory editor, category manager, testimonial approval, analytics telemetry, and inquiry manager.

---

## 2. Where Execution Starts (The 3 Entry Points)

When the app runs in the browser, execution follows this strict sequence:

1. **[`index.html`](file:///C:/Users/USER/.gemini/antigravity/scratch/voltedge/index.html)**:
   - Defines static Google SEO meta tags, Google Search `WebSite` JSON-LD schema, OpenGraph tags, and multi-size PNG/ICO favicons (`48x48`, `96x96`, `192x192`, `512x512`).
   - Injects the `#root` DOM element.

2. **[`src/main.tsx`](file:///C:/Users/USER/.gemini/antigravity/scratch/voltedge/src/main.tsx)**:
   - Entry script that mounts the React 19 tree to `#root`.
   - Imports global styling from [`src/index.css`](file:///C:/Users/USER/.gemini/antigravity/scratch/voltedge/src/index.css).

3. **[`src/App.tsx`](file:///C:/Users/USER/.gemini/antigravity/scratch/voltedge/src/App.tsx)**:
   - Sets up the global provider hierarchy:
     - `HelmetProvider` (dynamic head tags).
     - `ThemeProvider` (Dark / Light mode).
     - `AuthProvider` (Firebase admin session).
     - `AdminStoreProvider` (admin state).
     - `PublicStoreProvider` (public catalog cache).
   - Declares all routes using `lazyWithRetry` to prevent white screens if new code is deployed while a user has an old tab open.

---

## 3. Data Flow: How Data Reaches the Screen

```text
Firestore Database (Cloud)
         │
         ▼
src/lib/firebase.ts (Initializes DB, Auth, Storage)
         │
         ▼
src/services/*.ts (productService, categoryService, brandService, etc.)
         │
         ▼
src/data/publicStore.tsx (Caches catalog & auto-refreshes on mobile tab wake-up)
         │
         ▼
src/pages/*.tsx & src/components/*.tsx (Renders UI components)
```

- **Database Connection**: [`src/lib/firebase.ts`](file:///C:/Users/USER/.gemini/antigravity/scratch/voltedge/src/lib/firebase.ts) initializes Firestore `db`, Auth `auth`, and Storage `storage`.
- **Data Contracts**: [`src/lib/firestore-types.ts`](file:///C:/Users/USER/.gemini/antigravity/scratch/voltedge/src/lib/firestore-types.ts) defines TypeScript interfaces for all database collections (`products`, `categories`, `brands`, `enquiries`, `testimonials`, `business_info`, `faqs`, etc.).
- **Service Layers**:
  - [`src/services/productService.ts`](file:///C:/Users/USER/.gemini/antigravity/scratch/voltedge/src/services/productService.ts) (Pagination, search queries, CRUD).
  - [`src/services/businessService.ts`](file:///C:/Users/USER/.gemini/antigravity/scratch/voltedge/src/services/businessService.ts) (Store hours, phone, address).
  - [`src/services/analyticsService.ts`](file:///C:/Users/USER/.gemini/antigravity/scratch/voltedge/src/services/analyticsService.ts) (Event tracking, clicks, WhatsApp dispatch counts).

---

## 4. "If You Need to Edit X, Where Do You Look?" (Practical Edit Map)

Use this quick-reference guide when you need to make changes:

| If you want to change... | Look in this file... | What to do / Notes |
| :--- | :--- | :--- |
| **Store Phone / WhatsApp / Address** | [`src/data.ts`](file:///C:/Users/USER/.gemini/antigravity/scratch/voltedge/src/data.ts) | Edit `businessInfo` object or update via Admin Settings. |
| **Product Card UI (Grid or List view)** | [`src/components/ProductCard.tsx`](file:///C:/Users/USER/.gemini/antigravity/scratch/voltedge/src/components/ProductCard.tsx) | Contains `ProductGridCard` (2-col mobile) and `ProductListCard` (3-col desktop). |
| **Products Page, Search Bar & Filters** | [`src/pages/Products.tsx`](file:///C:/Users/USER/.gemini/antigravity/scratch/voltedge/src/pages/Products.tsx) | Controls sticky filter drawer, search input, and pagination. |
| **Product Detail Page & Specs** | [`src/pages/ProductDetail.tsx`](file:///C:/Users/USER/.gemini/antigravity/scratch/voltedge/src/pages/ProductDetail.tsx) | Image gallery, technical spec tables, and Similar Products. |
| **Homepage & Live Electrical Load Engine** | [`src/pages/Home.tsx`](file:///C:/Users/USER/.gemini/antigravity/scratch/voltedge/src/pages/Home.tsx) | Hero section, interactive 230V/415V spec engine, and featured carousel. |
| **Top Navbar, Call Button, Mobile Menu** | [`src/components/layout.tsx`](file:///C:/Users/USER/.gemini/antigravity/scratch/voltedge/src/components/layout.tsx) | Header navigation, top mobile call button, and slide-out menu. |
| **Footer Links & Copyright** | [`src/components/layout.tsx`](file:///C:/Users/USER/.gemini/antigravity/scratch/voltedge/src/components/layout.tsx) | Inside the `Footer` export. |
| **Global Theme, Colors, Badges, Glassmorphism** | [`src/index.css`](file:///C:/Users/USER/.gemini/antigravity/scratch/voltedge/src/index.css) | Custom utility classes (`.badge-volt`, `.liquid-glass`, `.btn-primary`). |
| **SEO, Google Site Name, Meta Tags** | [`index.html`](file:///C:/Users/USER/.gemini/antigravity/scratch/voltedge/index.html) & [`src/components/SEO.tsx`](file:///C:/Users/USER/.gemini/antigravity/scratch/voltedge/src/components/SEO.tsx) | Static and dynamic JSON-LD schemas (`WebSite`, `Organization`). |
| **Admin Dashboard & Inventory Editor** | [`src/admin/pages/*`](file:///C:/Users/USER/.gemini/antigravity/scratch/voltedge/src/admin/pages/) | Admin pages for Products, Analytics, Categories, Enquiries, etc. |
| **Favicons & PWA Manifest** | [`scripts/generateFavicons.mjs`](file:///C:/Users/USER/.gemini/antigravity/scratch/voltedge/scripts/generateFavicons.mjs) | Master SVG used to compile `48x48`, `96x96`, `192x192`, `512x512` icons. |

---

## 5. Folder & File Directory Explained

```text
src/
├── admin/                     # All Admin-Only Logic
│   ├── components/            # Admin UI components (AdminLayout, Sidebar, Charts, Modals)
│   ├── context/               # AuthContext (Firebase login/logout session state)
│   ├── data/                  # adminStore (Real-time Firestore listeners for admin view)
│   └── pages/                 # Admin pages (Products, Categories, Brands, Inquiries, etc.)
│
├── components/                # Core Shared Frontend Components
│   ├── ElectricCanvas.tsx     # Ambient canvas particle background animation
│   ├── layout.tsx             # Navbar, Footer, ThemeToggleButton, and header Call button
│   ├── ProductCard.tsx        # ProductGridCard (Mobile 2-col) & ProductListCard (Desktop)
│   ├── SEO.tsx                # Helmet SEO manager with JSON-LD schema builder
│   ├── ThemeToggle.tsx        # Light/Dark mode switcher button
│   └── ui.tsx                 # Atomic UI (SpotlightCard, Badge, QuoteModal, ProductImage)
│
├── context/                   # Global Application Contexts
│   └── ThemeContext.tsx       # Dark / Light theme provider & state hook
│
├── data/                      # Public Data Layer
│   ├── index.ts / data.ts     # Offline fallback datasets & WhatsApp URL builder functions
│   └── publicStore.tsx        # Global cached store for public catalog with tab wake-up rehydration
│
├── lib/                       # Third-Party Initializations
│   ├── firebase.ts            # Firebase app, Firestore, Auth, and Storage singletons
│   └── firestore-types.ts     # Strict TypeScript type definitions for Firestore documents
│
├── pages/                     # Public Route Views
│   ├── Home.tsx               # Homepage (Hero, Spec Engine, Categories, Featured Carousel)
│   ├── Products.tsx           # Product catalog with search, filter drawer & view toggles
│   ├── ProductDetail.tsx      # Single product page (Gallery, Specs, Related Products, CTA)
│   ├── Brands.tsx             # Authorized brand showcase
│   ├── About.tsx              # Company story, credentials, and business values
│   ├── Gallery.tsx            # Store photo gallery with category filter
│   ├── Testimonials.tsx       # Verified client reviews and feedback submission
│   ├── FAQ.tsx                # Frequently asked questions categorized
│   └── Contact.tsx            # Contact details, interactive Google Maps, and RFQ form
│
├── services/                  # Firestore Service Functions
│   ├── analyticsService.ts    # Event tracking (Product clicks, WhatsApp calls, searches)
│   ├── brandService.ts        # Fetch and update brands
│   ├── businessService.ts     # Business profile & store info
│   ├── categoryService.ts     # Categories queries
│   ├── enquiryService.ts      # Customer inquiry submission & retrieval
│   ├── faqService.ts          # FAQ queries
│   ├── galleryService.ts      # Photo gallery queries & uploads
│   ├── productService.ts      # Product pagination, queries, filtering, and CRUD
│   └── testimonialService.ts  # Testimonials fetching and admin approval
│
├── utils/                     # Utility Functions
│   └── lazyWithRetry.ts       # Self-healing lazy chunk loader (prevents stale tab freezes)
│
├── App.tsx                    # Root routing, layout wrapper, and route declarations
├── data.ts                    # Fallback seed data (products, brands, categories)
├── index.css                  # Tailwind CSS v4 directives & custom glow animations
└── main.tsx                   # React root mount
```

---

## 6. Common Developer Workflows

### 🧪 Running the Development Server
```bash
npm run dev
```
Starts Vite at `http://localhost:5173`. Hot Module Replacement (HMR) is enabled.

### 🔨 Building the Project
```bash
npm run build
```
This runs three automated steps:
1. `node scripts/generateFavicons.mjs` — Compiles high-res multi-size favicons.
2. `node scripts/generateSitemap.mjs` — Queries live products and generates `public/sitemap.xml`.
3. `tsc -b && vite build` — TypeScript type-check and production asset minification.

### 🚀 Deploying Live
```bash
npx -y firebase-tools deploy --only hosting --project saienterprises-90c6b
```

---

## 7. Important Design & Coding Conventions

1. **Always use Tailwind for styling**: Avoid custom inline style objects unless calculating dynamic transform coordinates.
2. **Use `ProductImage` for images**: Always render images via the `<ProductImage />` component ([`src/components/ui.tsx`](file:///C:/Users/USER/.gemini/antigravity/scratch/voltedge/src/components/ui.tsx)) because it handles fallbacks and skeleton loading states automatically.
3. **Use `lazyWithRetry` for new pages**: When adding a new route in `src/App.tsx`, wrap it in `lazyWithRetry(() => import(...))` so deployment chunk invalidations never break client tabs.
4. **Preserve SEO JSON-LD**: When adding or modifying pages, ensure the `<SEO />` component is included with appropriate titles and structured data.
