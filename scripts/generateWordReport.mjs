import fs from 'fs';
import path from 'path';
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  Table,
  TableRow,
  TableCell,
  WidthType,
  BorderStyle,
  AlignmentType,
  ShadingType,
  PageBreak,
  Header,
  Footer,
  PageNumber,
  NumberFormat,
} from 'docx';

const PRIMARY_COLOR = '00E5FF';
const DARK_BG = '0A0A0F';
const NAVY_HEADER = '0F172A';
const TEXT_MUTED = '64748B';
const BORDER_COLOR = 'CBD5E1';
const LIGHT_BG = 'F8FAFC';
const CODE_BG = '1E293B';
const HIGHLIGHT_COLOR = '0284C7';

function createHeading1(text) {
  return new Paragraph({
    text: text,
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 360, after: 180 },
    run: {
      font: 'Calibri',
      size: 32, // 16pt
      bold: true,
      color: NAVY_HEADER,
    },
  });
}

function createHeading2(text) {
  return new Paragraph({
    text: text,
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 280, after: 120 },
    run: {
      font: 'Calibri',
      size: 26, // 13pt
      bold: true,
      color: HIGHLIGHT_COLOR,
    },
  });
}

function createHeading3(text) {
  return new Paragraph({
    text: text,
    heading: HeadingLevel.HEADING_3,
    spacing: { before: 200, after: 80 },
    run: {
      font: 'Calibri',
      size: 22, // 11pt
      bold: true,
      color: '334155',
    },
  });
}

function createParagraph(text, options = {}) {
  return new Paragraph({
    spacing: { after: 120, line: 276 },
    children: [
      new TextRun({
        text: text,
        font: 'Calibri',
        size: 20, // 10pt
        color: options.color || '334155',
        bold: options.bold || false,
        italics: options.italics || false,
      }),
    ],
  });
}

function createBullet(text, boldPrefix = '') {
  const children = [];
  if (boldPrefix) {
    children.push(
      new TextRun({
        text: boldPrefix + ' ',
        font: 'Calibri',
        size: 20,
        bold: true,
        color: NAVY_HEADER,
      })
    );
  }
  children.push(
    new TextRun({
      text: text,
      font: 'Calibri',
      size: 20,
      color: '334155',
    })
  );

  return new Paragraph({
    bullet: { level: 0 },
    spacing: { after: 80, line: 260 },
    children: children,
  });
}

function createCodeBlock(codeLines) {
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: {
      top: { style: BorderStyle.SINGLE, size: 1, color: CODE_BG },
      bottom: { style: BorderStyle.SINGLE, size: 1, color: CODE_BG },
      left: { style: BorderStyle.SINGLE, size: 4, color: PRIMARY_COLOR },
      right: { style: BorderStyle.SINGLE, size: 1, color: CODE_BG },
    },
    rows: [
      new TableRow({
        children: [
          new TableCell({
            shading: { type: ShadingType.CLEAR, fill: CODE_BG },
            margins: { top: 120, bottom: 120, left: 160, right: 160 },
            children: codeLines.map(
              line =>
                new Paragraph({
                  spacing: { line: 240, after: 40 },
                  children: [
                    new TextRun({
                      text: line,
                      font: 'Consolas',
                      size: 17,
                      color: 'F1F5F9',
                    }),
                  ],
                })
            ),
          }),
        ],
      }),
    ],
  });
}

function createCallout(title, text) {
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: {
      top: { style: BorderStyle.SINGLE, size: 1, color: BORDER_COLOR },
      bottom: { style: BorderStyle.SINGLE, size: 1, color: BORDER_COLOR },
      left: { style: BorderStyle.SINGLE, size: 6, color: HIGHLIGHT_COLOR },
      right: { style: BorderStyle.SINGLE, size: 1, color: BORDER_COLOR },
    },
    rows: [
      new TableRow({
        children: [
          new TableCell({
            shading: { type: ShadingType.CLEAR, fill: 'F0F9FF' },
            margins: { top: 120, bottom: 120, left: 160, right: 160 },
            children: [
              new Paragraph({
                spacing: { after: 60 },
                children: [
                  new TextRun({
                    text: title,
                    font: 'Calibri',
                    size: 20,
                    bold: true,
                    color: HIGHLIGHT_COLOR,
                  }),
                ],
              }),
              new Paragraph({
                spacing: { line: 260, after: 0 },
                children: [
                  new TextRun({
                    text: text,
                    font: 'Calibri',
                    size: 19,
                    color: '0369A1',
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
    ],
  });
}

function createStyledTable(headers, rowsData) {
  const headerRow = new TableRow({
    tableHeader: true,
    children: headers.map(
      h =>
        new TableCell({
          shading: { type: ShadingType.CLEAR, fill: NAVY_HEADER },
          margins: { top: 100, bottom: 100, left: 120, right: 120 },
          children: [
            new Paragraph({
              alignment: AlignmentType.LEFT,
              children: [
                new TextRun({
                  text: h,
                  font: 'Calibri',
                  size: 18,
                  bold: true,
                  color: 'FFFFFF',
                }),
              ],
            }),
          ],
        })
    ),
  });

  const bodyRows = rowsData.map((row, rIdx) => {
    return new TableRow({
      children: row.map(
        cellText =>
          new TableCell({
            shading: {
              type: ShadingType.CLEAR,
              fill: rIdx % 2 === 0 ? 'FFFFFF' : LIGHT_BG,
            },
            margins: { top: 80, bottom: 80, left: 120, right: 120 },
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: cellText,
                    font: 'Calibri',
                    size: 18,
                    color: '334155',
                  }),
                ],
              }),
            ],
          })
      ),
    });
  });

  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: {
      top: { style: BorderStyle.SINGLE, size: 1, color: BORDER_COLOR },
      bottom: { style: BorderStyle.SINGLE, size: 1, color: BORDER_COLOR },
      left: { style: BorderStyle.SINGLE, size: 1, color: BORDER_COLOR },
      right: { style: BorderStyle.SINGLE, size: 1, color: BORDER_COLOR },
      insideHorizontal: { style: BorderStyle.SINGLE, size: 1, color: BORDER_COLOR },
      insideVertical: { style: BorderStyle.SINGLE, size: 1, color: BORDER_COLOR },
    },
    rows: [headerRow, ...bodyRows],
  });
}

// Build Document Structure
const doc = new Document({
  styles: {
    default: {
      document: {
        run: {
          font: 'Calibri',
          size: 20,
          color: '334155',
        },
      },
    },
  },
  sections: [
    {
      properties: {
        page: {
          margin: {
            top: 1440, // 1 inch
            right: 1440,
            bottom: 1440,
            left: 1440,
          },
        },
      },
      headers: {
        default: new Header({
          children: [
            new Paragraph({
              alignment: AlignmentType.RIGHT,
              children: [
                new TextRun({
                  text: 'Sai Enterprises — Software Engineering & Architecture Report',
                  font: 'Calibri',
                  size: 16,
                  color: TEXT_MUTED,
                }),
              ],
            }),
          ],
        }),
      },
      footers: {
        default: new Footer({
          children: [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [
                new TextRun({
                  text: 'Page ',
                  font: 'Calibri',
                  size: 16,
                  color: TEXT_MUTED,
                }),
                new TextRun({
                  children: [PageNumber.CURRENT],
                  font: 'Calibri',
                  size: 16,
                  color: TEXT_MUTED,
                }),
                new TextRun({
                  text: ' of ',
                  font: 'Calibri',
                  size: 16,
                  color: TEXT_MUTED,
                }),
                new TextRun({
                  children: [PageNumber.TOTAL_PAGES],
                  font: 'Calibri',
                  size: 16,
                  color: TEXT_MUTED,
                }),
              ],
            }),
          ],
        }),
      },
      children: [
        // COVER BANNER
        new Paragraph({
          spacing: { after: 120 },
          children: [
            new TextRun({
              text: 'SAI ENTERPRISES',
              font: 'Calibri',
              size: 38,
              bold: true,
              color: NAVY_HEADER,
            }),
          ],
        }),
        new Paragraph({
          spacing: { after: 180 },
          children: [
            new TextRun({
              text: 'Complete Software Engineering & Architectural Blueprint',
              font: 'Calibri',
              size: 24,
              bold: true,
              color: HIGHLIGHT_COLOR,
            }),
          ],
        }),
        new Paragraph({
          spacing: { after: 240 },
          children: [
            new TextRun({
              text: 'A Comprehensive Technical Report for Developers, Architects, and Engineering Leadership',
              font: 'Calibri',
              size: 20,
              italics: true,
              color: TEXT_MUTED,
            }),
          ],
        }),

        createCallout(
          'Document Metadata & System Classification',
          'Platform: React 19 + TypeScript 6 + Vite 8 + Firebase v12 | Architecture: Dual-Tier Jamstack Single Page Application (Public Showroom + Headless ERP CMS) | Target Audiences: Software Engineers & Systems Architects.'
        ),

        new Paragraph({ spacing: { after: 240 } }),

        // SECTION 1
        createHeading1('1. Executive Overview & System Architecture'),
        createParagraph(
          'Sai Enterprises is a modern, high-performance web platform built for an authorized industrial and residential electrical products distributor (representing tier-1 brands such as PMCona, Havells, Polycab, and Finolex). The system is architected as a decoupled, dual-tier Single Page Application (SPA):'
        ),
        createBullet(
          'An interactive catalog offering high-resolution product discovery, rich technical specification sheets, an interactive electrical circuit load simulator, and instant one-click WhatsApp Request-for-Quote (RFQ) conversion.',
          'Customer Digital Showroom (Public SPA):'
        ),
        createBullet(
          'A secured back-office console with Role-Based Access Control (RBAC) enabling authorized personnel to manage product inventory, modify taxonomy, track incoming customer leads, adjust business metadata, and analyze engagement metrics.',
          'Enterprise Admin Portal & CMS (Private SPA):'
        ),

        new Paragraph({ spacing: { after: 140 } }),

        // SECTION 2
        createHeading1('2. Comprehensive Technology Stack & Selection Rationale'),
        createParagraph(
          'Every component and library in the Sai Enterprises codebase was selected based on strict engineering criteria: developer velocity, compile-time type safety, zero server maintenance overhead, and client-side performance.'
        ),

        createStyledTable(
          ['Technology', 'Category', 'Version', 'Architectural Rationale & Importance'],
          [
            ['React', 'UI Framework', '19.2.8', 'Provides component-driven UI architecture with automatic batching, concurrent rendering, and optimal virtual DOM reconciliation.'],
            ['TypeScript', 'Language', '6.0.2', 'Enforces strict compile-time type safety across data schemas and API layers, eliminating runtime null/undefined crashes in product specification tables.'],
            ['Vite', 'Bundler & Tooling', '8.2.0', 'Ultra-fast ES-module development server with instant Hot Module Replacement (HMR) and optimized Rollup production bundling with route-level code splitting.'],
            ['Tailwind CSS', 'Styling Engine', '4.3.3', 'Next-generation utility CSS engine utilizing CSS custom properties for instant dark/light theme transitions with zero runtime JavaScript overhead.'],
            ['Cloud Firestore', 'NoSQL Database', '12.17.1', 'Serverless, auto-scaling NoSQL database offering millisecond latency, offline local persistence, and live WebSocket snapshot listeners.'],
            ['Firebase Auth', 'Identity & Security', '12.17.1', 'Secure JWT authentication managing Role-Based Access Control (RBAC) without requiring custom authentication microservices.'],
            ['Firebase Storage', 'Object Storage', '12.17.1', 'Cloud object bucket infrastructure with CDN integration for hosting and streaming optimized product photos and brand vector logos.'],
            ['Framer Motion', 'Animation Engine', '13.1.0', 'Declarative, GPU-accelerated motion library powering layout transitions, interactive drawer animations, and spring physics interactions.'],
            ['Recharts', 'Data Visualization', '3.10.1', 'Composable, responsive SVG charting library powering the Admin Analytics module for revenue telemetry and lead tracking.'],
            ['React Helmet Async', 'Head & SEO Manager', '3.0.0', 'Asynchronous document head coordinator for injecting dynamic Canonical URLs, Open Graph cards, and structured JSON-LD schemas.'],
            ['Oxlint', 'Linter', '1.75.0', 'Ultra-fast Rust-based linter enforcing clean code standards and best practices during continuous integration.'],
          ]
        ),

        new Paragraph({ spacing: { after: 180 } }),

        // SECTION 3
        createHeading1('3. Directory Structure & Codebase Anatomy'),
        createParagraph(
          'The repository follows a clean, modular structure separating public views, admin views, data services, and shared UI components:'
        ),
        createBullet('Enterprise administrative management portal including pages (Dashboard, Products, Enquiries, Settings), layout components, and RBAC context.', 'src/admin/:'),
        createBullet('Reusable shared presentation components such as ElectricCanvas.tsx, InteractiveCircuitShowcase.tsx, layout.tsx, and SEO.tsx.', 'src/components/:'),
        createBullet('Global React contexts such as ThemeContext.tsx (Dark/Light mode coordinator).', 'src/context/:'),
        createBullet('Public read cache store (publicStore.tsx) and baseline initial fallback constants.', 'src/data/:'),
        createBullet('Firebase initialization singletons (firebase.ts), Firestore TypeScript interfaces (firestore-types.ts), and utility helpers.', 'src/lib/:'),
        createBullet('Public customer-facing pages (Home, Products, ProductDetail, Brands, About, Gallery, Testimonials, FAQ, Contact).', 'src/pages/:'),
        createBullet('Data Access Layer (DAL) encapsulating Firebase Firestore and Cloud Storage calls into modular service files.', 'src/services/:'),
        createBullet('Build-time maintenance automation scripts including automated XML sitemap generation and database seeding.', 'scripts/:'),

        new Paragraph({ spacing: { after: 180 } }),

        // SECTION 4
        createHeading1('4. Data Architecture & Cloud Firestore Schema'),
        createParagraph(
          'All application data is organized in document-oriented collections designed for fast querying, indexing, and minimal bandwidth consumption:'
        ),

        createStyledTable(
          ['Collection Name', 'Primary Schema Fields', 'Access Model & Purpose'],
          [
            ['products', 'name, slug, brandSlug, categorySlug, specifications[], images[], inStock, isFeatured', 'Public Read / Admin Write. Stores full technical catalog and inventory state.'],
            ['categories', 'name, slug, icon, image, active, sortOrder, productCount', 'Public Read / Admin Write. Product categorization taxonomy (Switches, MCBs, Cables).'],
            ['brands', 'name, slug, logo, isAuthorized, tagline, active', 'Public Read / Admin Write. Manufacturer profiles and dealership verification checkmarks.'],
            ['enquiries', 'customerName, phone, email, message, status (NEW|IN_REVIEW|QUOTED)', 'Public Write / Admin Full Access. Lead capture pipeline from Quote Modal and Contact form.'],
            ['users', 'uid, email, displayName, role (OWNER|MANAGER|STAFF), status', 'Owner Full Access. Administrator credentials and security permission assignments.'],
            ['business_info', 'phone, whatsapp, email, address, hours, socialLinks', 'Public Read / Manager Write. Dynamic store contact info editable without redeployment.'],
            ['admin_logs', 'userId, userEmail, action, entity, timestamp, details', 'Admin Read-Only. Immutable audit trail recording every administrative CRUD operation.'],
          ]
        ),

        new Paragraph({ spacing: { after: 180 } }),

        // SECTION 5
        createHeading1('5. State Management & Data Flow Architecture'),
        createParagraph(
          'To optimize performance and reliability, the application implements a decoupled, dual-tier state model:'
        ),
        createHeading2('5.1 Public Read Layer (Stale-While-Revalidate Model)'),
        createParagraph(
          'To eliminate blank-screen loading delays (FCP < 1.0s), the public layout mounts immediately with pre-compiled static fallback constants. Concurrently in the background, PublicStoreProvider executes non-blocking queries to Cloud Firestore. When the cloud response resolves, React seamlessly hydrates the state with fresh inventory data without flickering.'
        ),

        createHeading2('5.2 Admin Operational Layer (Real-Time Synchronous Subscriptions)'),
        createParagraph(
          'The Admin Console connects directly to Cloud Firestore using onSnapshot WebSocket listeners. When inventory, stock status, or customer inquiries are updated in one browser tab or by another team member, changes propagate instantly across all active administrative sessions.'
        ),

        new Paragraph({ spacing: { after: 180 } }),

        // SECTION 6
        createHeading1('6. Security & Role-Based Access Control (RBAC)'),
        createParagraph(
          'The application enforces security at three distinct operational tiers: OWNER (Executive), MANAGER (Store Lead), and STAFF (Sales Associate):'
        ),

        createStyledTable(
          ['Permission / Resource', 'Owner', 'Manager', 'Staff', 'Public'],
          [
            ['Browse Public Catalog & Submit RFQ', 'Yes', 'Yes', 'Yes', 'Yes'],
            ['Access Admin Portal (/admin)', 'Yes', 'Yes', 'Yes', 'No'],
            ['Create, Edit & Delete Products', 'Yes', 'Yes', 'Yes', 'No'],
            ['View Customer Enquiries & RFQ Leads', 'Yes', 'Yes', 'Yes', 'No'],
            ['Update Lead Status / Add Internal CRM Notes', 'Yes', 'Yes', 'No', 'No'],
            ['Manage Categories & Brand Partnerships', 'Yes', 'Yes', 'No', 'No'],
            ['Edit Store Business Info & Hours', 'Yes', 'Yes', 'No', 'No'],
            ['Manage User Accounts & Assign Roles', 'Yes', 'No', 'No', 'No'],
            ['System Settings & Security Data Reset', 'Yes', 'No', 'No', 'No'],
          ]
        ),

        createParagraph(
          'Security is enforced two-fold: (1) Client-side route guards (<ProtectedRoute requiredPermission="...">) prevent unauthorized rendering, and (2) Server-side Cloud Firestore Security Rules (firestore.rules) reject any unauthenticated or unauthorized database mutation.'
        ),

        new Paragraph({ spacing: { after: 180 } }),

        // SECTION 7
        createHeading1('7. UI/UX Design System, Animations & Visual FX'),
        createParagraph(
          'The visual identity is designed around a modern industrial electrical aesthetic, utilizing curated HSL tokens, liquid glassmorphism, and responsive micro-interactions:'
        ),
        createBullet('Primary color palette anchored on Cyan Volt (#00E5FF) and Volt Dim (#00B8D4) over Deep Slate Dark (#0A0A0F) backgrounds.', 'Color System:'),
        createBullet('Ambient particle canvas rendering dynamic electrical spark connections responding smoothly to cursor velocity.', 'Electric Canvas Engine:'),
        createBullet('Interactive circuit simulator allowing users to toggle breakers and switches to observe live load calculations.', 'Interactive Circuit Simulation:'),
        createBullet('Seamless light/dark theme switching coordinated via Tailwind CSS v4 and CSS variables.', 'Theme Transition Engine:'),

        new Paragraph({ spacing: { after: 180 } }),

        // SECTION 8
        createHeading1('8. Search Engine Optimization (SEO) & Web Discovery'),
        createParagraph(
          'To maximize organic search ranking for regional electrical distribution queries, comprehensive SEO engineering is embedded into the build pipeline:'
        ),
        createBullet('Dynamically coordinates document title, meta descriptions, canonical URLs, and Open Graph social cards on every page view.', 'SEO Component (src/components/SEO.tsx):'),
        createBullet('Embeds LocalBusiness, Product, and FAQPage structured data into document heads for rich Google Search snippet indexing.', 'JSON-LD Structured Data:'),
        createBullet('Automated build script (scripts/generateSitemap.mjs) that queries all product and category slugs to generate a compliant public/sitemap.xml before production bundling.', 'Dynamic XML Sitemap Generation:'),

        new Paragraph({ spacing: { after: 180 } }),

        // SECTION 9
        createHeading1('9. Developer Onboarding & Local Setup Guide'),
        createParagraph('To run and develop the project locally, follow these standard steps:'),

        createCodeBlock([
          '# 1. Clone the repository and install dependencies',
          'git clone <repository-url>',
          'cd voltedge',
          'npm install',
          '',
          '# 2. Configure environment variables in .env.local',
          'VITE_FIREBASE_API_KEY=AIzaSyCzH4adr9PKGAkqRHQuzqSzcpO3_GLKmeA',
          'VITE_FIREBASE_AUTH_DOMAIN=saienterprises-90c6b.firebaseapp.com',
          'VITE_FIREBASE_PROJECT_ID=saienterprises-90c6b',
          'VITE_FIREBASE_STORAGE_BUCKET=saienterprises-90c6b.firebasestorage.app',
          'VITE_FIREBASE_MESSAGING_SENDER_ID=189441387992',
          'VITE_FIREBASE_APP_ID=1:189441387992:web:678c0898495f8fa88216ad',
          'VITE_FIREBASE_MEASUREMENT_ID=G-PQEVRPH9B3',
          '',
          '# 3. Start local development server',
          'npm run dev',
          '',
          '# 4. Build for production (runs sitemap generation, TypeScript typecheck, and Vite bundle)',
          'npm run build',
          '',
          '# 5. Preview production build locally',
          'npm run preview',
        ]),

        new Paragraph({ spacing: { after: 140 } }),

        createCallout(
          '💡 Developer Pro-Tip: Quick Admin Portal Navigation',
          'On any public page of the website, press Ctrl + Shift + A (or Cmd + Shift + A on macOS) to instantly open the administrative login portal (/admin/login).'
        ),
      ],
    },
  ],
});

const outputPath = path.resolve('Sai_Enterprises_Software_Engineering_Report.docx');
const brainPath = 'C:\\Users\\USER\\.gemini\\antigravity\\brain\\cd048800-692f-49d8-8f0b-252a9ae2b03e\\Sai_Enterprises_Software_Engineering_Report.docx';

Packer.toBuffer(doc)
  .then(buffer => {
    fs.writeFileSync(outputPath, buffer);
    console.log('Successfully generated Word Document at:', outputPath);
    fs.writeFileSync(brainPath, buffer);
    console.log('Copied Word Document to brain directory at:', brainPath);
  })
  .catch(err => {
    console.error('Error generating docx:', err);
    process.exit(1);
  });
