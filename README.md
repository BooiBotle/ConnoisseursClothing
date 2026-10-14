# THE CONNOISSEURS SHOW / VINTAGE CONNOISSEURS
### Official E-Commerce Merchandise Store

A premium, fully responsive React e-commerce merchandise platform designed for **The Connoisseurs Show** and **Vintage Connoisseurs**. Built at the intersection of vintage music culture, streetwear fashion, retro editorial design, and contemporary South African e-commerce.

---

## 1. Key Features

- **Brand Identity & Dual Logo Integration**:
  - Incorporates the circular badge **The Connoisseurs Show** with vinyl gramophone & soundwave elements.
  - Incorporates the distressed archival woodcut logo **Vintage Connoisseurs** for limited capsules and promotional sections.
  - High-resolution, transparent, non-distorted web assets and custom favicon.
- **South African Commerce Engine**:
  - Currency in South African Rand (`ZAR` / `R`).
  - Configurable nationwide door-to-door courier options (Standard Courier, Express Overnight Major Metros, Pargo Smart Lockers).
  - Free shipping progress threshold indicator (`R1,200.00`).
  - All 9 South African provinces supported during checkout.
  - 14-day exchange and returns policy compliant with the Consumer Protection Act (CPA).
  - Privacy policy compliant with the Protection of Personal Information Act (POPIA).
- **Payment Gateway Integrations**:
  - **PayFast**: Ready for live or sandbox integration (Merchant ID, Merchant Key, PassPhrase HMAC).
  - **Yoco**: Card processing setup with 3D Secure SA banking verification.
  - **Instant EFT / Direct Bank Transfer**: Complete FNB business account details with order number reference guidance.
- **Product & Inventory Management**:
  - Persistent shopping cart with slide-out drawer and dedicated cart review page.
  - Variant configurator per size (`XS`, `S`, `M`, `L`, `XL`, `XXL`, `One Size`) with individual inventory stock tracking.
  - Prevention of overselling beyond active stock limits.
  - Multi-tiered filtering: Category, Brand Label, Size, Price, Availability, Sale, and New Drops.
  - Size Guide Modal with garment measurements in centimetres and inches.
- **Customer & Administrator Portal**:
  - Order tracking portal (`/account`) where customers can look up order status without forced account creation.
  - Tax invoice summary with 5-stage fulfillment status tracker (`/order-confirmation/:orderNumber`).
  - Secure Admin Dashboard (`/admin`) to add products, adjust stock, configure sale prices, toggle featured drops, and update order fulfillment statuses.
- **Dual-Mode Persistence Architecture**:
  - Seamlessly integrates with **Supabase PostgreSQL** for production.
  - Includes a zero-configuration local persistent store with seed data, ensuring full functionality immediately even prior to database key provision.

---

## 2. Technology Stack

- **Frontend**: React 19 + TypeScript (TSX)
- **Build Tool**: Vite
- **Styling**: Tailwind CSS v4 with bespoke editorial tokens & typography
- **Routing**: React Router v7
- **Icons**: Lucide React
- **Database / Backend**: Supabase PostgreSQL + Edge Function readiness
- **State Management**: React Context with LocalStorage persistence

---

## 3. Project Structure

```text
├── public/
│   ├── brand/               # Transparent & light/dark brand logos & favicon
│   ├── products/            # High-resolution streetwear product photography
│   └── hero/                # High-fashion editorial campaign imagery
├── src/
│   ├── components/
│   │   ├── common/          # AnnouncementBar, Navbar, Footer, SearchModal
│   │   ├── home/            # HeroSection, FeaturedCollections, FeaturedDrops, BrandStory, PromoBanner
│   │   ├── shop/            # ProductCard, QuickViewModal, SizeGuideModal
│   │   └── cart/            # CartDrawer
│   ├── context/
│   │   ├── CartContext.tsx  # Persistent bag, promo codes, shipping calculations
│   │   └── AdminContext.tsx # Administrative session gate
│   ├── layouts/
│   │   └── RootLayout.tsx   # Global shell with header, footer & drawer
│   ├── pages/               # Home, Shop, Collections, ProductDetail, Cart, Checkout, OrderConfirmation, About, Contact, Policies, Admin
│   ├── services/
│   │   ├── db.ts            # Master database service (dual Supabase + LocalStorage)
│   │   ├── supabase.ts      # Supabase client initialization
│   │   ├── payment.ts       # PayFast, Yoco, and EFT payment gateways
│   │   └── shipping.ts      # South African shipping options & free threshold rules
│   ├── types/               # Full TypeScript schemas
│   └── utils/               # Formatters (ZAR currency, dates, slugs)
├── supabase/
│   └── schema.sql           # Complete Supabase database schema, RLS & migration
└── .env.example             # Environment variables configuration template
```

---

## 4. Local Development Setup

### Prerequisites
- Node.js (version 18 or higher)
- npm or pnpm

### Installation
1. Clone the repository and navigate into the project directory:
   ```bash
   cd OnlineStore
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Launch the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to:
   ```text
   http://localhost:5173
   ```

---

## 5. Supabase Production Database Setup

To link your live Supabase cloud database:

1. Create a project at [supabase.com](https://supabase.com).
2. Go to the **SQL Editor** in your Supabase dashboard.
3. Open `supabase/schema.sql` from this repository and run the SQL migration script. This script automatically creates:
   - `categories`, `products`, `product_images`, `product_variants`
   - `orders`, `order_items`, `newsletter_subscribers`, `contact_inquiries`
   - Row Level Security (RLS) policies
   - The atomic inventory deduction function `deduct_inventory_stock()`
4. Copy your project credentials from **Project Settings > API**:
   - Project URL
   - Project Anon/Public API Key
5. Add these credentials to your `.env` file:
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-public-key
   ```
The application will automatically detect the presence of the keys and route all catalogue, order, and subscriber traffic through your Supabase backend.

---

## 6. Payment Gateway Activation (South Africa)

### PayFast Setup:
1. Register a merchant account at [payfast.co.za](https://www.payfast.co.za).
2. Retrieve your **Merchant ID** and **Merchant Key** from your PayFast profile.
3. Set your secure **Passphrase** in PayFast under Settings > Integration.
4. Update your `.env` file:
   ```env
   VITE_PAYFAST_MERCHANT_ID=your_merchant_id
   VITE_PAYFAST_MERCHANT_KEY=your_merchant_key
   VITE_PAYFAST_PASSPHRASE=your_passphrase
   ```

### Yoco Setup:
1. Register at [yoco.com](https://www.yoco.com).
2. Under Developer Settings, copy your **Live Public Key** (`pk_live_...`).
3. Add to your `.env` file:
   ```env
   VITE_YOCO_PUBLIC_KEY=pk_live_your_key
   ```

---

## 7. Admin Dashboard Access

- **Route**: `/admin`
- **Demo Credentials**:
  - **Email**: `admin@theconnoisseurs.co.za`
  - **Passkey**: `connoisseur2026`

Authorised administrators can:
- Track sales revenue and pending orders in real-time.
- Add new merchandise garments with custom sizes, colorways, and stock levels.
- Edit pricing and mark sale promotions.
- Toggle featured items on the homepage drops section.
- Manage order fulfillment statuses (`Pending Payment` &rarr; `Paid` &rarr; `Processing` &rarr; `Shipped` &rarr; `Completed`).

---

## 8. Production Deployment

To build the production bundle for deployment (Vercel, Netlify, Cloudflare Pages, or AWS Amplify):

```bash
npm run build
```

This generates an optimized static build in the `dist/` directory ready for deployment.
