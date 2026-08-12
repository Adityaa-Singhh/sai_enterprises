// ===== PRODUCT CATEGORIES =====
export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string; // lucide icon name
  productCount: number;
  image: string;
}

export const categories: Category[] = [
  {
    id: 'cat-1',
    name: 'Switches',
    slug: 'switches',
    description: 'Modular switches, toggle switches, and smart switches for every need',
    icon: 'ToggleRight',
    productCount: 45,
    image: '/images/categories/switches.jpg',
  },
  {
    id: 'cat-2',
    name: 'Sockets',
    slug: 'sockets',
    description: 'Power sockets, USB sockets, and multi-pin sockets',
    icon: 'Plug',
    productCount: 32,
    image: '/images/categories/sockets.jpg',
  },
  {
    id: 'cat-3',
    name: 'Wires',
    slug: 'wires',
    description: 'House wiring, flexible wires, and industrial grade cables',
    icon: 'Cable',
    productCount: 28,
    image: '/images/categories/wires.jpg',
  },
  {
    id: 'cat-4',
    name: 'Cables',
    slug: 'cables',
    description: 'Armoured cables, multi-core cables, and submersible cables',
    icon: 'Unplug',
    productCount: 22,
    image: '/images/categories/cables.jpg',
  },
  {
    id: 'cat-5',
    name: 'Lighting',
    slug: 'lighting',
    description: 'LED bulbs, panel lights, downlights, and decorative lighting',
    icon: 'Lightbulb',
    productCount: 56,
    image: '/images/categories/lighting.jpg',
  },
  {
    id: 'cat-6',
    name: 'MCB & Protection',
    slug: 'mcb-protection',
    description: 'MCBs, RCCBs, distribution boards, and surge protectors',
    icon: 'ShieldCheck',
    productCount: 38,
    image: '/images/categories/mcb.jpg',
  },
  {
    id: 'cat-7',
    name: 'Fans',
    slug: 'fans',
    description: 'Ceiling fans, exhaust fans, table fans, and BLDC fans',
    icon: 'Fan',
    productCount: 24,
    image: '/images/categories/fans.jpg',
  },
  {
    id: 'cat-8',
    name: 'Accessories',
    slug: 'accessories',
    description: 'Electrical tapes, junction boxes, conduits, and tools',
    icon: 'Wrench',
    productCount: 64,
    image: '/images/categories/accessories.jpg',
  },
  {
    id: 'cat-9',
    name: 'Industrial',
    slug: 'industrial',
    description: 'Heavy-duty switches, industrial plugs, and panel components',
    icon: 'Factory',
    productCount: 30,
    image: '/images/categories/industrial.jpg',
  },
];

// ===== BRANDS =====
export interface Brand {
  id: string;
  name: string;
  slug: string;
  logo: string;
  description: string;
  isAuthorized: boolean;
  categories: string[];
  tagline: string;
}

export const brands: Brand[] = [
  {
    id: 'brand-1',
    name: 'PMCona',
    slug: 'pmcona',
    logo: '/images/brands/pmcona.png',
    description: 'One of India\'s leading manufacturers of modular switches, sockets, and electrical accessories. Known for innovative designs and reliable quality.',
    isAuthorized: true,
    categories: ['Switches', 'Sockets', 'Accessories', 'MCB & Protection'],
    tagline: 'Innovation in Every Switch',
  },
  {
    id: 'brand-2',
    name: 'Havells',
    slug: 'havells',
    logo: '/images/brands/havells.png',
    description: 'A trusted name in electrical equipment with a wide range of products from wires to fans to industrial solutions.',
    isAuthorized: true,
    categories: ['Wires', 'Cables', 'Fans', 'Lighting', 'MCB & Protection'],
    tagline: 'Wires That Don\'t Catch Fire',
  },
  {
    id: 'brand-3',
    name: 'Polycab',
    slug: 'polycab',
    logo: '/images/brands/polycab.png',
    description: 'India\'s largest wires & cables manufacturer delivering safe and reliable products for residential and industrial use.',
    isAuthorized: true,
    categories: ['Wires', 'Cables', 'Fans', 'Lighting'],
    tagline: 'Expert in Wires & Cables',
  },
  {
    id: 'brand-4',
    name: 'Anchor by Panasonic',
    slug: 'anchor',
    logo: '/images/brands/anchor.png',
    description: 'Premium modular switches and sockets with Japanese technology and design excellence.',
    isAuthorized: true,
    categories: ['Switches', 'Sockets', 'Accessories'],
    tagline: 'Switch to Smarter Living',
  },
  {
    id: 'brand-5',
    name: 'Finolex',
    slug: 'finolex',
    logo: '/images/brands/finolex.png',
    description: 'Pioneers in cable manufacturing with over 60 years of expertise in high-quality electrical wires and cables.',
    isAuthorized: false,
    categories: ['Wires', 'Cables'],
    tagline: 'The Wire People',
  },
  {
    id: 'brand-6',
    name: 'Crompton',
    slug: 'crompton',
    logo: '/images/brands/crompton.png',
    description: 'A century-old brand known for reliable fans, lighting, and pumps with modern energy-efficient technology.',
    isAuthorized: false,
    categories: ['Fans', 'Lighting'],
    tagline: 'Lighting Lives, Stirring Air',
  },
];

// ===== PRODUCTS =====
export interface Product {
  id: string;
  name: string;
  slug: string;
  brand: string;
  brandSlug: string;
  category: string;
  categorySlug: string;
  description: string;
  shortDescription: string;
  specifications: { label: string; value: string }[];
  images: string[];
  isFeatured: boolean;
  isNew: boolean;
  inStock: boolean;
  tags: string[];
}

export const products: Product[] = [
  {
    id: 'prod-1',
    name: 'PMCona 6A One Way Switch',
    slug: 'pmcona-6a-one-way-switch',
    brand: 'PMCona',
    brandSlug: 'pmcona',
    category: 'Switches',
    categorySlug: 'switches',
    description: 'Premium modular one-way switch with elegant design and durable mechanism. Features antimicrobial coating and a rated life of 100,000 operations. Perfect for modern residential and commercial interiors.',
    shortDescription: 'Premium modular one-way switch with elegant design',
    specifications: [
      { label: 'Rating', value: '6A, 250V' },
      { label: 'Module Size', value: '1 Module' },
      { label: 'Material', value: 'Polycarbonate' },
      { label: 'Color', value: 'White' },
      { label: 'Warranty', value: '10 Years' },
      { label: 'Certification', value: 'ISI Marked' },
    ],
    images: ['/images/products/switch-1.jpg', '/images/products/switch-1b.jpg'],
    isFeatured: true,
    isNew: false,
    inStock: true,
    tags: ['modular', 'switch', '6A', 'one-way'],
  },
  {
    id: 'prod-2',
    name: 'PMCona 16A Socket with Shutter',
    slug: 'pmcona-16a-socket-shutter',
    brand: 'PMCona',
    brandSlug: 'pmcona',
    category: 'Sockets',
    categorySlug: 'sockets',
    description: 'Heavy-duty 16A socket with child-safe shutters and robust construction. Designed for high-power appliances like air conditioners, geysers, and heaters.',
    shortDescription: 'Heavy-duty 16A socket with child-safe shutters',
    specifications: [
      { label: 'Rating', value: '16A, 250V' },
      { label: 'Module Size', value: '2 Module' },
      { label: 'Material', value: 'Polycarbonate' },
      { label: 'Shutter', value: 'Yes, Child-Safe' },
      { label: 'Warranty', value: '10 Years' },
    ],
    images: ['/images/products/socket-1.jpg'],
    isFeatured: true,
    isNew: true,
    inStock: true,
    tags: ['socket', '16A', 'shutter', 'safety'],
  },
  {
    id: 'prod-3',
    name: 'Polycab Optima Plus 1.5 sq mm Wire',
    slug: 'polycab-optima-plus-wire',
    brand: 'Polycab',
    brandSlug: 'polycab',
    category: 'Wires',
    categorySlug: 'wires',
    description: 'High-quality HRFR (Heat Resistant Flame Retardant) house wire with 90m coil length. Suitable for domestic electrical wiring with superior insulation and conductivity.',
    shortDescription: 'HRFR house wire — 1.5 sq mm, 90m coil',
    specifications: [
      { label: 'Size', value: '1.5 sq mm' },
      { label: 'Length', value: '90 meters' },
      { label: 'Type', value: 'HRFR' },
      { label: 'Voltage', value: '1100V' },
      { label: 'Conductor', value: 'Electrolytic Copper' },
      { label: 'Certification', value: 'ISI, ROHS' },
    ],
    images: ['/images/products/wire-1.jpg'],
    isFeatured: true,
    isNew: false,
    inStock: true,
    tags: ['wire', '1.5mm', 'copper', 'HRFR'],
  },
  {
    id: 'prod-4',
    name: 'Havells 32A MCB Single Pole',
    slug: 'havells-32a-mcb-single-pole',
    brand: 'Havells',
    brandSlug: 'havells',
    category: 'MCB & Protection',
    categorySlug: 'mcb-protection',
    description: 'Miniature Circuit Breaker with C-curve tripping characteristic. Provides reliable short circuit and overload protection for residential and commercial installations.',
    shortDescription: 'C-curve MCB for short circuit & overload protection',
    specifications: [
      { label: 'Rating', value: '32A' },
      { label: 'Poles', value: 'Single Pole' },
      { label: 'Curve', value: 'C Curve' },
      { label: 'Breaking Capacity', value: '10kA' },
      { label: 'Standard', value: 'IS/IEC 60898' },
    ],
    images: ['/images/products/mcb-1.jpg'],
    isFeatured: true,
    isNew: false,
    inStock: true,
    tags: ['MCB', '32A', 'protection', 'single-pole'],
  },
  {
    id: 'prod-5',
    name: 'Crompton Energion HS 1200mm BLDC Fan',
    slug: 'crompton-energion-bldc-fan',
    brand: 'Crompton',
    brandSlug: 'crompton',
    category: 'Fans',
    categorySlug: 'fans',
    description: 'Ultra-energy-efficient BLDC ceiling fan consuming only 35W. Features remote control, sleep mode, timer, and high air delivery. 5-star rated for maximum savings.',
    shortDescription: 'Ultra-efficient BLDC ceiling fan — just 35W',
    specifications: [
      { label: 'Sweep', value: '1200mm' },
      { label: 'Power', value: '35W' },
      { label: 'RPM', value: '330' },
      { label: 'Air Delivery', value: '230 CMM' },
      { label: 'Star Rating', value: '5 Star' },
      { label: 'Remote', value: 'Yes' },
    ],
    images: ['/images/products/fan-1.jpg'],
    isFeatured: true,
    isNew: true,
    inStock: true,
    tags: ['fan', 'BLDC', 'energy-saving', 'ceiling'],
  },
  {
    id: 'prod-6',
    name: 'Havells 12W LED Panel Light',
    slug: 'havells-12w-led-panel',
    brand: 'Havells',
    brandSlug: 'havells',
    category: 'Lighting',
    categorySlug: 'lighting',
    description: 'Slim LED panel light with edge-lit technology for uniform glow. Flicker-free operation, surge-proof, and energy-efficient. Perfect for false ceilings in homes and offices.',
    shortDescription: 'Slim edge-lit LED panel — flicker-free, 12W',
    specifications: [
      { label: 'Wattage', value: '12W' },
      { label: 'Shape', value: 'Round' },
      { label: 'Color Temp', value: '6500K (Cool Daylight)' },
      { label: 'Lumens', value: '1080 lm' },
      { label: 'Cutout', value: '150mm' },
      { label: 'Warranty', value: '2 Years' },
    ],
    images: ['/images/products/panel-1.jpg'],
    isFeatured: true,
    isNew: false,
    inStock: true,
    tags: ['LED', 'panel', 'ceiling', 'lighting'],
  },
  {
    id: 'prod-7',
    name: 'PMCona 8 Way TPN Distribution Board',
    slug: 'pmcona-8way-tpn-db',
    brand: 'PMCona',
    brandSlug: 'pmcona',
    category: 'MCB & Protection',
    categorySlug: 'mcb-protection',
    description: 'Premium 8-way TPN distribution board with door and DIN rail. Designed for organized and safe electrical distribution in residential and commercial buildings.',
    shortDescription: '8-way TPN distribution board with door',
    specifications: [
      { label: 'Ways', value: '8' },
      { label: 'Type', value: 'TPN (Triple Pole + Neutral)' },
      { label: 'Material', value: 'Metal with Powder Coating' },
      { label: 'DIN Rail', value: 'Included' },
      { label: 'IP Rating', value: 'IP43' },
    ],
    images: ['/images/products/db-1.jpg'],
    isFeatured: false,
    isNew: false,
    inStock: true,
    tags: ['distribution board', 'TPN', 'MCB box'],
  },
  {
    id: 'prod-8',
    name: 'Finolex 4 sq mm FR-LSH Wire',
    slug: 'finolex-4sqmm-fr-lsh',
    brand: 'Finolex',
    brandSlug: 'finolex',
    category: 'Wires',
    categorySlug: 'wires',
    description: 'Flame retardant, low smoke, halogen-free wire suitable for residential and commercial wiring. Extra safety with reduced toxic fume emission.',
    shortDescription: 'FR-LSH wire — 4 sq mm for safe wiring',
    specifications: [
      { label: 'Size', value: '4 sq mm' },
      { label: 'Length', value: '90 meters' },
      { label: 'Type', value: 'FR-LSH' },
      { label: 'Voltage', value: '1100V' },
      { label: 'Conductor', value: '99.97% Pure Copper' },
    ],
    images: ['/images/products/wire-2.jpg'],
    isFeatured: false,
    isNew: false,
    inStock: true,
    tags: ['wire', '4mm', 'FR-LSH', 'fire-safe'],
  },
  {
    id: 'prod-9',
    name: 'Anchor Roma 20A Switch',
    slug: 'anchor-roma-20a-switch',
    brand: 'Anchor by Panasonic',
    brandSlug: 'anchor',
    category: 'Switches',
    categorySlug: 'switches',
    description: 'High-rating 20A modular switch ideal for heavy electrical appliances. Features silver contacts for better conductivity and longer life.',
    shortDescription: '20A modular switch for heavy appliances',
    specifications: [
      { label: 'Rating', value: '20A, 250V' },
      { label: 'Module Size', value: '1 Module' },
      { label: 'Contact', value: 'Silver Alloy' },
      { label: 'Series', value: 'Roma' },
      { label: 'Warranty', value: '7 Years' },
    ],
    images: ['/images/products/switch-2.jpg'],
    isFeatured: false,
    isNew: true,
    inStock: true,
    tags: ['switch', '20A', 'heavy-duty', 'modular'],
  },
  {
    id: 'prod-10',
    name: 'Havells Lumeno 15W LED Bulb',
    slug: 'havells-lumeno-15w-led',
    brand: 'Havells',
    brandSlug: 'havells',
    category: 'Lighting',
    categorySlug: 'lighting',
    description: 'High-lumen LED bulb with wide beam angle. Surge-proof and energy-efficient with instant full brightness. B22 base for Indian fittings.',
    shortDescription: 'Bright 15W LED bulb — surge-proof, B22',
    specifications: [
      { label: 'Wattage', value: '15W' },
      { label: 'Base', value: 'B22' },
      { label: 'Lumens', value: '1500 lm' },
      { label: 'Color Temp', value: '6500K' },
      { label: 'Life', value: '25000 Hours' },
      { label: 'Warranty', value: '2 Years' },
    ],
    images: ['/images/products/bulb-1.jpg'],
    isFeatured: false,
    isNew: false,
    inStock: true,
    tags: ['LED', 'bulb', 'B22', '15W'],
  },
  {
    id: 'prod-11',
    name: 'Polycab 3C x 2.5 sq mm Armoured Cable',
    slug: 'polycab-3c-armoured-cable',
    brand: 'Polycab',
    brandSlug: 'polycab',
    category: 'Cables',
    categorySlug: 'cables',
    description: 'Galvanized steel wire armoured cable for underground and outdoor installations. 3-core, PVC insulated with superior mechanical protection.',
    shortDescription: '3-core armoured cable for underground use',
    specifications: [
      { label: 'Cores', value: '3' },
      { label: 'Size', value: '2.5 sq mm' },
      { label: 'Armour', value: 'Galvanized Steel Wire' },
      { label: 'Insulation', value: 'PVC' },
      { label: 'Voltage', value: '1.1 kV' },
    ],
    images: ['/images/products/cable-1.jpg'],
    isFeatured: false,
    isNew: false,
    inStock: true,
    tags: ['cable', 'armoured', 'underground', '3-core'],
  },
  {
    id: 'prod-12',
    name: 'PMCona Electrical Tape (Pack of 10)',
    slug: 'pmcona-electrical-tape-pack',
    brand: 'PMCona',
    brandSlug: 'pmcona',
    category: 'Accessories',
    categorySlug: 'accessories',
    description: 'High-quality PVC electrical insulation tape with strong adhesive. Flame retardant and suitable for all types of electrical insulation work.',
    shortDescription: 'PVC insulation tape — flame retardant, 10 pack',
    specifications: [
      { label: 'Width', value: '18mm' },
      { label: 'Length', value: '8 meters per roll' },
      { label: 'Material', value: 'PVC' },
      { label: 'Pack', value: '10 Rolls' },
      { label: 'Flame Retardant', value: 'Yes' },
    ],
    images: ['/images/products/tape-1.jpg'],
    isFeatured: false,
    isNew: false,
    inStock: true,
    tags: ['tape', 'insulation', 'accessories'],
  },
];

// ===== TESTIMONIALS =====
export interface Testimonial {
  id: string;
  name: string;
  role: string;
  rating: number;
  review: string;
  date: string;
}

export const testimonials: Testimonial[] = [
  {
    id: 'test-1',
    name: 'Rajesh Kumar',
    role: 'Homeowner',
    rating: 5,
    review: 'Excellent shop! I got all the switches and sockets for my new home from VoltEdge. The owner personally helped me choose the right products. Very genuine and fair pricing.',
    date: '2 weeks ago',
  },
  {
    id: 'test-2',
    name: 'Suresh Electricals',
    role: 'Electrician',
    rating: 5,
    review: 'I have been buying all my electrical supplies from VoltEdge for over 3 years. They always have stock, give good rates for bulk orders, and the quality is always genuine.',
    date: '1 month ago',
  },
  {
    id: 'test-3',
    name: 'Priya Sharma',
    role: 'Interior Designer',
    rating: 5,
    review: 'As an interior designer, I need reliable suppliers who understand modular products. VoltEdge has an impressive range of switches and sockets from top brands. Highly recommended!',
    date: '3 weeks ago',
  },
  {
    id: 'test-4',
    name: 'Manoj Constructions',
    role: 'Contractor',
    rating: 4,
    review: 'We regularly source wires, cables, and MCBs from VoltEdge for our construction projects. Competitive pricing and they always deliver on time. Good business relationship.',
    date: '1 month ago',
  },
  {
    id: 'test-5',
    name: 'Anita Patel',
    role: 'Homeowner',
    rating: 5,
    review: 'Very professional shop. They explained the difference between various wire grades and helped me pick the safest option for my home. Will definitely come back.',
    date: '2 months ago',
  },
  {
    id: 'test-6',
    name: 'SK Traders',
    role: 'Business Owner',
    rating: 5,
    review: 'Best electrical shop in the area. They are authorized dealers for multiple brands which gives us confidence about genuine products. WhatsApp ordering is very convenient.',
    date: '3 weeks ago',
  },
];

// ===== FAQs =====
export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export const faqs: FAQ[] = [
  {
    id: 'faq-1',
    question: 'What electrical products do you sell?',
    answer: 'We offer a complete range of electrical products including modular switches, sockets, wires, cables, MCBs, distribution boards, LED lighting, fans, and electrical accessories. We stock both residential and industrial products from multiple trusted brands.',
    category: 'Products',
  },
  {
    id: 'faq-2',
    question: 'Are you an authorized dealer for these brands?',
    answer: 'Yes, VoltEdge is an authorized dealer and distributor for PMCona and several other leading electrical brands. All products we sell are 100% genuine with manufacturer warranty.',
    category: 'Brands',
  },
  {
    id: 'faq-3',
    question: 'Do you provide quotations for bulk orders?',
    answer: 'Absolutely! We provide competitive quotations for bulk and project-based orders. Contact us via WhatsApp or phone with your requirements and we will share a detailed quotation within 24 hours.',
    category: 'Orders',
  },
  {
    id: 'faq-4',
    question: 'What are your store timings?',
    answer: 'Our store is open Monday to Saturday from 9:00 AM to 8:00 PM. We are closed on Sundays and public holidays. For urgent requirements, you can reach us on WhatsApp.',
    category: 'Store',
  },
  {
    id: 'faq-5',
    question: 'Do you offer delivery?',
    answer: 'Yes, we offer local delivery for orders within the city. For large orders, we can arrange transport. Contact us for delivery charges and timelines based on your location.',
    category: 'Delivery',
  },
  {
    id: 'faq-6',
    question: 'Do the products come with warranty?',
    answer: 'All branded products come with the manufacturer\'s standard warranty. Warranty periods vary by product and brand — typically 1 to 10 years. We provide proper bills for warranty claims.',
    category: 'Warranty',
  },
  {
    id: 'faq-7',
    question: 'Can I return or exchange a product?',
    answer: 'Unused and unopened products can be returned or exchanged within 7 days of purchase with the original bill. Custom-cut wires and cables cannot be returned. Please contact us for specific return queries.',
    category: 'Returns',
  },
  {
    id: 'faq-8',
    question: 'Do you provide electrician recommendations?',
    answer: 'While we do not directly employ electricians, we can recommend trusted local electricians and contractors based on your project requirements. Many electricians are regular customers and we can connect you.',
    category: 'Services',
  },
  {
    id: 'faq-9',
    question: 'How can I check product availability?',
    answer: 'The fastest way to check availability is to send us a WhatsApp message with the product name or photo. We will confirm stock and pricing within minutes during business hours.',
    category: 'Products',
  },
  {
    id: 'faq-10',
    question: 'Do you offer special rates for electricians and contractors?',
    answer: 'Yes, we offer special trade pricing for electricians, contractors, and regular customers. Visit our store or contact us to discuss trade account benefits.',
    category: 'Orders',
  },
];

// ===== GALLERY =====
export interface GalleryImage {
  id: string;
  src: string;
  alt: string;
  category: 'store' | 'products' | 'brands' | 'interior' | 'exterior';
}

export const galleryImages: GalleryImage[] = [
  { id: 'gal-1', src: '/images/gallery/store-front.jpg', alt: 'VoltEdge Store Front', category: 'exterior' },
  { id: 'gal-2', src: '/images/gallery/interior-1.jpg', alt: 'Store Interior — Wire Section', category: 'interior' },
  { id: 'gal-3', src: '/images/gallery/products-display.jpg', alt: 'Product Display Wall', category: 'products' },
  { id: 'gal-4', src: '/images/gallery/brand-wall.jpg', alt: 'Brand Display Area', category: 'brands' },
  { id: 'gal-5', src: '/images/gallery/switches-rack.jpg', alt: 'Switches Collection', category: 'products' },
  { id: 'gal-6', src: '/images/gallery/wires-section.jpg', alt: 'Wires & Cables Section', category: 'products' },
  { id: 'gal-7', src: '/images/gallery/interior-2.jpg', alt: 'Store Interior — Lighting Display', category: 'interior' },
  { id: 'gal-8', src: '/images/gallery/exterior-side.jpg', alt: 'Store Side View', category: 'exterior' },
  { id: 'gal-9', src: '/images/gallery/counter.jpg', alt: 'Billing Counter', category: 'interior' },
  { id: 'gal-10', src: '/images/gallery/fans-display.jpg', alt: 'Fans Display', category: 'products' },
  { id: 'gal-11', src: '/images/gallery/mcb-section.jpg', alt: 'MCB & Distribution Boards', category: 'products' },
  { id: 'gal-12', src: '/images/gallery/brand-pmcona.jpg', alt: 'PMCona Authorized Dealer Board', category: 'brands' },
];

// ===== BUSINESS INFO =====
// ===== BUSINESS INFO =====
export const businessInfo = {
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
  hours: {
    weekdays: '9:00 AM — 8:00 PM',
    saturday: '9:00 AM — 8:00 PM',
    sunday: 'Closed',
  },
  experience: '15+',
  productsCount: '500+',
  brandsCount: '20+',
  customersServed: '5000+',
  social: {
    instagram: 'https://instagram.com/saienterprises',
    facebook: 'https://facebook.com/saienterprises',
    google: 'https://g.co/saienterprises',
  },
};

// ===== WHY CHOOSE US =====
export interface Feature {
  icon: string;
  title: string;
  description: string;
}

export const whyChooseUs: Feature[] = [
  {
    icon: 'ShieldCheck',
    title: 'Genuine Products',
    description: 'Every product is sourced directly from authorized brand channels. No duplicates, no counterfeits.',
  },
  {
    icon: 'Award',
    title: 'Authorized Dealer',
    description: 'Official dealership for PMCona and other top brands — giving you manufacturer-backed assurance.',
  },
  {
    icon: 'Package',
    title: 'Wide Product Range',
    description: 'From modular switches to industrial cables — find everything for your electrical project under one roof.',
  },
  {
    icon: 'Users',
    title: 'Expert Guidance',
    description: 'Our experienced team helps you choose the right products for your specific electrical requirements.',
  },
  {
    icon: 'IndianRupee',
    title: 'Competitive Pricing',
    description: 'Best market rates for retail and bulk orders. Special trade pricing for electricians and contractors.',
  },
  {
    icon: 'MessageSquare',
    title: 'Quick Response',
    description: 'Reach us on WhatsApp for instant availability checks, quotes, and order confirmations.',
  },
];

// Helper
export function getWhatsAppUrl(message?: string): string {
  const msg = message || businessInfo.whatsappMessage;
  return `https://wa.me/${businessInfo.whatsappRaw}?text=${encodeURIComponent(msg)}`;
}

export function getPhoneUrl(): string {
  return `tel:+${businessInfo.phoneRaw}`;
}

export function getProductEnquiryUrl(productName: string): string {
  return getWhatsAppUrl(`Hi! I'd like to enquire about: ${productName}. Is it available?`);
}

export function getQuoteUrl(): string {
  return getWhatsAppUrl('Hi Sai Enterprises! I would like to request a quotation. Here are my requirements:\n\n');
}
