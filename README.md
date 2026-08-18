# ⚡ Sai Enterprises — Premier Electrical Products Platform

[![Live Website](https://img.shields.io/badge/Live%20Website-saienterprises.web.app-00e5ff?style=for-the-badge&logo=google-chrome&logoColor=black)](https://saienterprises-90c6b.web.app)
[![React](https://img.shields.io/badge/React%2019-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)](https://firebase.google.com/)
[![Architecture Guide](https://img.shields.io/badge/Developer-Guide%20%26%20Architecture-blueviolet?style=for-the-badge&logo=readme&logoColor=white)](./DEVELOPER_GUIDE.md)

> **Sai Enterprises** is a modern, mobile-first digital catalog and enterprise commerce platform built for Rourkela's trusted electrical supplier and wholesale distributor. From genuine modular switches and industrial cables to LED lighting and heavy-duty switchgear, the platform connects homeowners, electricians, and contractors directly to authorized brand inventory.
>
> 📖 *For new developers joining this project, please see the [Developer Onboarding & Architecture Guide](./DEVELOPER_GUIDE.md) for full execution flow, state management, and file edit maps.*

---

## 🌟 What This Platform Does

Sai Enterprises bridges traditional electrical retail with modern web performance, giving customers and commercial clients a fast, frictionless way to explore products, calculate requirements, and request bulk trade quotations.

### ✨ Key Features

- **📱 Mobile-First Product Catalog**
  - High-density 2-column mobile grid and structured 3-column desktop list view.
  - Category and brand filters with active filter pills and instant search.
  - Zero-clutter, clean product imagery with clear technical specs.

- **⚡ Real-Time Electrical Load Engine**
  - Interactive calculator for single-phase (230V) and three-phase (415V) setups.
  - Dynamic breaker sizing, cable gauge recommendations (IS 694 certified), and live warehouse stock checks.

- **💬 1-Tap WhatsApp Trade Desk**
  - Direct inquiry buttons on every product card with pre-filled product details for instant quotes.
  - Dedicated RFQ (Request for Quotation) modal for custom bulk orders and project supplies.

- **🔒 Real-Time Admin Portal**
  - Live product inventory management (CRUD, image uploads, specifications builder).
  - Brand and category management, testimonials curation, FAQ editor, and media gallery.
  - In-depth analytics dashboard, customer inquiry management, and administrative activity auditing.

- **🔍 Search Engine Optimized (Google Search Ready)**
  - Google-compliant multi-size favicon suite (`48x48`, `96x96`, `192x192`, `512x512`, `favicon.ico`).
  - Automated XML sitemap generation with daily cron-safe builds.
  - Rich JSON-LD structured data (`schema.org/WebSite`, `Organization`, `Product`, `BreadcrumbList`).

- **🛡️ Enterprise Auto-Recovery Architecture**
  - `lazyWithRetry` dynamic route loading that recovers from stale browser tabs across new deployments.
  - Tab wake-up and BFCache rehydration listeners that silently re-sync data when returning to background tabs on mobile.

---

## 🛠️ Technology Stack

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend Core** | **React 19** + **TypeScript** | Modern UI components with strict type safety |
| **Styling & Design** | **Tailwind CSS v4** | Custom dark electrical theme with glowing cyan accents (`#00e5ff`) |
| **Animations** | **Framer Motion** | Smooth interactive transitions and carousel dragging |
| **Icons** | **Lucide React** | Crisp, scalable UI icons |
| **Database** | **Firebase Cloud Firestore** | Real-time NoSQL product, brand, and analytics data |
| **Storage & Hosting** | **Firebase Storage & Hosting** | Global CDN distribution and secure image hosting |
| **Build & Bundling** | **Vite 8** + **Sharp** | Instant HMR development and automated favicon generation |

---

## 📁 Project Structure

```text
├── public/                     # Static assets, sitemap.xml, robots.txt, and favicons
│   ├── favicon.ico             # Multi-size standard favicon
│   ├── favicon-48x48.png       # Google Search recommended favicon
│   ├── favicon-192x192.png     # High-DPI Android and SERP icon
│   └── site.webmanifest        # PWA Web Manifest
├── scripts/                    # Build & automation scripts
│   ├── generateFavicons.mjs    # Generates crisp multi-size favicons from master SVG
│   └── generateSitemap.mjs     # Builds dynamic SEO XML sitemap
├── src/
│   ├── admin/                  # Enterprise Admin Portal
│   │   ├── components/         # Admin UI elements, tables, forms, and charts
│   │   ├── context/            # AuthContext & Admin Store
│   │   └── pages/              # Dashboard, Products, Categories, Analytics, etc.
│   ├── components/             # Reusable UI components
│   │   ├── ProductCard.tsx     # Mobile GridCard and Desktop ListCard
│   │   ├── SEO.tsx             # Helmet JSON-LD & meta tag manager
│   │   ├── layout.tsx          # Responsive Header, Navbar, and Footer
│   │   └── ui.tsx              # Spotlight cards, badges, modals, and buttons
│   ├── context/                # Global ThemeContext (Dark / Light)
│   ├── data/                   # Initial datasets, publicStore, and WhatsApp utilities
│   ├── lib/                    # Firebase and Firestore initialization
│   ├── pages/                  # Public pages (Home, Products, ProductDetail, Brands, etc.)
│   ├── services/               # Firestore service layers (Products, Brands, Analytics, etc.)
│   ├── utils/                  # lazyWithRetry auto-recovery utilities
│   ├── App.tsx                 # Root application component & routing
│   └── main.tsx                # Application entry point
├── index.html                  # HTML entry point with static SEO & WebSite Schema
├── package.json                # Project dependencies and scripts
└── vite.config.ts              # Vite configuration
```

---

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed on your machine:
- [Node.js](https://nodejs.org/) (version `18.0.0` or higher)
- [npm](https://www.npmjs.com/) (version `9.0.0` or higher)

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Adityaa-Singhh/voltedge.git
   cd voltedge
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env` file in the project root with your Firebase credentials:
   ```env
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
   ```

4. **Start the local development server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 📦 Build & Deployment

### Build for Production

To generate static sitemaps, build high-res favicons, and compile the optimized production bundle:

```bash
npm run build
```

### Deploy to Firebase Hosting

Deploy the compiled `dist/` directory to live Firebase Hosting:

```bash
npx -y firebase-tools deploy --only hosting --project saienterprises-90c6b
```

---

## 🏢 About Sai Enterprises

- **Location**: Near Bank of India, TCI Chowk, Rourkela, Odisha — 769004
- **Specialty**: Authorized Brand Distributor & Wholesaler
- **Key Brands**: PMCona, Havells, Polycab, Finolex, Anchor by Panasonic, Crompton
- **Phone / WhatsApp**: [+91 79786 72521](tel:+917978672521)
- **Live Catalog**: [https://saienterprises-90c6b.web.app/products](https://saienterprises-90c6b.web.app/products)

---

## 📄 License

This project is proprietary and maintained for **Sai Enterprises**. All rights reserved.
