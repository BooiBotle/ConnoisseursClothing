import {
  Category,
  FilterOptions,
  NewsletterSubscriber,
  Order,
  OrderStatus,
  PaymentStatus,
  Product
} from '../types';
import { isSupabaseConfigured, supabase } from './supabase';

const SEED_CATEGORIES: Category[] = [
  {
    id: 'cat-hoodies',
    name: 'Hoodies & Sweatshirts',
    slug: 'hoodies-sweatshirts',
    description: 'Heavyweight boxy cuts, luxury French terry cotton, and archival music culture prints.',
    image_url: '/products/hoodie_vintage_black_front.jpg'
  },
  {
    id: 'cat-tees',
    name: 'T-Shirts & Tops',
    slug: 't-shirts',
    description: '280gsm combed cotton vintage oversized t-shirts with retro gramophone graphics.',
    image_url: '/products/tee_connoisseurs_cream_front.jpg'
  },
  {
    id: 'cat-caps',
    name: 'Caps & Headwear',
    slug: 'caps-headwear',
    description: 'Vintage washed dad caps, embroidered crests, and antique brass strapbacks.',
    image_url: '/products/cap_vintage_black.jpg'
  },
  {
    id: 'cat-limited',
    name: 'Limited Drops',
    slug: 'limited-edition',
    description: 'Numbered collectors merchandise, exclusive colorways, and rare run garments.',
    image_url: '/hero/hero_streetwear_editorial.jpg'
  },
  {
    id: 'cat-accessories',
    name: 'Accessories',
    slug: 'accessories',
    description: 'Canvas record totes, vinyl slipmats, stickers, and everyday lifestyle carry.',
    image_url: '/products/cap_vintage_strap_detail.jpg'
  }
];

const SEED_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    name: 'Vintage Connoisseurs Heavyweight Boxy Hoodie',
    slug: 'vintage-connoisseurs-heavyweight-hoodie',
    brand_collection: 'Vintage Connoisseurs',
    category_id: 'cat-hoodies',
    description:
      'The quintessential streetwear statement. Cut from ultra-heavyweight 450gsm French Terry fleece, this silhouette features an authentic distressed gramophone graphic on the chest and an intricate circular Frequency Architects soundwave layout across the back.',
    fabric_composition: '100% French Terry Cotton, 450 GSM',
    details: [
      'Relaxed dropped-shoulder boxy silhouette',
      'Double-lined structured hood (no drawstrings)',
      'Distressed woodcut vintage gramophone front print',
      'Full-back Frequency Architects soundwave typography',
      'Pre-shrunk and garment dyed for a timeless vintage feel',
      'Custom woven inside neck label & collector tag'
    ],
    base_price: 850,
    sale_price: 750,
    featured: true,
    is_new_drop: true,
    is_limited_edition: false,
    published: true,
    created_at: '2026-10-01T10:00:00Z',
    images: [
      {
        id: 'img-1a',
        product_id: 'prod-1',
        image_url: '/products/hoodie_vintage_black_front.jpg',
        alt_text: 'Vintage Connoisseurs Heavyweight Hoodie Front',
        display_order: 1
      },
      {
        id: 'img-1b',
        product_id: 'prod-1',
        image_url: '/products/hoodie_vintage_black_back.jpg',
        alt_text: 'Vintage Connoisseurs Heavyweight Hoodie Back',
        display_order: 2
      },
      {
        id: 'img-1c',
        product_id: 'prod-1',
        image_url: '/products/hoodie_vintage_black_detail.jpg',
        alt_text: 'Hoodie Chest Print Detail',
        display_order: 3
      }
    ],
    variants: [
      { id: 'var-1-s', product_id: 'prod-1', size: 'S', colour: 'Vintage Washed Black', sku: 'VC-HD-BLK-S', available_stock: 8, active: true },
      { id: 'var-1-m', product_id: 'prod-1', size: 'M', colour: 'Vintage Washed Black', sku: 'VC-HD-BLK-M', available_stock: 14, active: true },
      { id: 'var-1-l', product_id: 'prod-1', size: 'L', colour: 'Vintage Washed Black', sku: 'VC-HD-BLK-L', available_stock: 12, active: true },
      { id: 'var-1-xl', product_id: 'prod-1', size: 'XL', colour: 'Vintage Washed Black', sku: 'VC-HD-BLK-XL', available_stock: 6, active: true },
      { id: 'var-1-xxl', product_id: 'prod-1', size: 'XXL', colour: 'Vintage Washed Black', sku: 'VC-HD-BLK-XXL', available_stock: 3, active: true }
    ]
  },
  {
    id: 'prod-2',
    name: 'The Connoisseurs Show Archival Off-White Tee',
    slug: 'the-connoisseurs-show-archival-off-white-tee',
    brand_collection: 'The Connoisseurs Show',
    category_id: 'cat-tees',
    description:
      'Engineered for true music connoisseurs. This heavyweight 280gsm combed cotton tee features an oversized drape, snug thick ribbed neckline, and our signature archive gramophone emblem printed with breathable water-based inks.',
    fabric_composition: '100% Combed Heavy Cotton, 280 GSM',
    details: [
      'Heavyweight boxy cut with dropped shoulders',
      'Thick 1-inch (2.5cm) high-density ribbed collar',
      'Front circular archival Connoisseurs gramophone artwork',
      'Breathable water-based screenprint that softens with every wash',
      'Ethically crafted in South Africa'
    ],
    base_price: 450,
    sale_price: null,
    featured: true,
    is_new_drop: true,
    is_limited_edition: false,
    published: true,
    created_at: '2026-10-02T11:00:00Z',
    images: [
      {
        id: 'img-2a',
        product_id: 'prod-2',
        image_url: '/products/tee_connoisseurs_cream_front.jpg',
        alt_text: 'The Connoisseurs Show Off-White Tee Front',
        display_order: 1
      },
      {
        id: 'img-2b',
        product_id: 'prod-2',
        image_url: '/products/tee_connoisseurs_cream_detail.jpg',
        alt_text: 'The Connoisseurs Show Off-White Tee Graphic Detail',
        display_order: 2
      }
    ],
    variants: [
      { id: 'var-2-s', product_id: 'prod-2', size: 'S', colour: 'Warm Off-White', sku: 'TCS-TEE-OFW-S', available_stock: 10, active: true },
      { id: 'var-2-m', product_id: 'prod-2', size: 'M', colour: 'Warm Off-White', sku: 'TCS-TEE-OFW-M', available_stock: 22, active: true },
      { id: 'var-2-l', product_id: 'prod-2', size: 'L', colour: 'Warm Off-White', sku: 'TCS-TEE-OFW-L', available_stock: 18, active: true },
      { id: 'var-2-xl', product_id: 'prod-2', size: 'XL', colour: 'Warm Off-White', sku: 'TCS-TEE-OFW-XL', available_stock: 9, active: true },
      { id: 'var-2-xxl', product_id: 'prod-2', size: 'XXL', colour: 'Warm Off-White', sku: 'TCS-TEE-OFW-XXL', available_stock: 4, active: true }
    ]
  },
  {
    id: 'prod-3',
    name: 'Music Connoisseurs Collectors Club Acid-Washed Tee',
    slug: 'music-connoisseurs-collectors-club-tee',
    brand_collection: 'The Connoisseurs Show',
    category_id: 'cat-tees',
    description:
      'Inspired by crate-digging vinyl culture and late-night broadcast sessions. Features a distressed analog cassette and vinyl turntable motif on mineral-washed charcoal cotton for that lived-in vintage feel.',
    fabric_composition: '100% Cotton, Mineral Acid-Washed, 240 GSM',
    details: [
      'Authentic mineral wash finish (each tee is uniquely textured)',
      'Retro "Music Connoisseurs - Collectors Club" typography',
      'Reinforced shoulder-to-shoulder taping for durability',
      'Medium-relaxed fit suitable for everyday wear'
    ],
    base_price: 450,
    sale_price: 395,
    featured: true,
    is_new_drop: false,
    is_limited_edition: true,
    published: true,
    created_at: '2026-09-28T09:00:00Z',
    images: [
      {
        id: 'img-3a',
        product_id: 'prod-3',
        image_url: '/products/tee_connoisseurs_black_model.jpg',
        alt_text: 'Music Connoisseurs Acid Wash Tee Editorial View',
        display_order: 1
      },
      {
        id: 'img-3b',
        product_id: 'prod-3',
        image_url: '/products/tee_connoisseurs_cream_front.jpg',
        alt_text: 'Music Connoisseurs Graphic Reference',
        display_order: 2
      }
    ],
    variants: [
      { id: 'var-3-s', product_id: 'prod-3', size: 'S', colour: 'Acid Washed Charcoal', sku: 'TCS-MCC-ACD-S', available_stock: 5, active: true },
      { id: 'var-3-m', product_id: 'prod-3', size: 'M', colour: 'Acid Washed Charcoal', sku: 'TCS-MCC-ACD-M', available_stock: 12, active: true },
      { id: 'var-3-l', product_id: 'prod-3', size: 'L', colour: 'Acid Washed Charcoal', sku: 'TCS-MCC-ACD-L', available_stock: 15, active: true },
      { id: 'var-3-xl', product_id: 'prod-3', size: 'XL', colour: 'Acid Washed Charcoal', sku: 'TCS-MCC-ACD-XL', available_stock: 7, active: true },
      { id: 'var-3-xxl', product_id: 'prod-3', size: 'XXL', colour: 'Acid Washed Charcoal', sku: 'TCS-MCC-ACD-XXL', available_stock: 2, active: true }
    ]
  },
  {
    id: 'prod-4',
    name: 'Vintage Connoisseurs Embroidered Low-Profile Dad Cap',
    slug: 'vintage-connoisseurs-embroidered-dad-cap',
    brand_collection: 'Vintage Connoisseurs',
    category_id: 'cat-caps',
    description:
      'A refined headwear piece constructed from washed 100% cotton chino twill. Finished with our high-density embroidered gramophone emblem on the crown and an adjustable leather strapback with an engraved antique brass closure.',
    fabric_composition: '100% Washed Cotton Chino Twill',
    details: [
      'Unstructured 6-panel low-profile crown',
      'Pre-curved brim with tonal stitching',
      'Full embroidery circular music badge',
      'Genuine dark leather strap with antique brass slider',
      'Interior taped seams with branded woven label'
    ],
    base_price: 350,
    sale_price: null,
    featured: true,
    is_new_drop: true,
    is_limited_edition: false,
    published: true,
    created_at: '2026-10-04T12:00:00Z',
    images: [
      {
        id: 'img-4a',
        product_id: 'prod-4',
        image_url: '/products/cap_vintage_black.jpg',
        alt_text: 'Vintage Connoisseurs Embroidered Dad Cap',
        display_order: 1
      },
      {
        id: 'img-4b',
        product_id: 'prod-4',
        image_url: '/products/cap_vintage_strap_detail.jpg',
        alt_text: 'Cap Leather Strap and Brass Buckle Detail',
        display_order: 2
      }
    ],
    variants: [
      { id: 'var-4-os', product_id: 'prod-4', size: 'One Size', colour: 'Washed Charcoal Black', sku: 'VC-CAP-WBLK-OS', available_stock: 35, active: true }
    ]
  },
  {
    id: 'prod-5',
    name: 'Culture & Rhythm Editorial Oversized Hoodie',
    slug: 'culture-rhythm-editorial-hoodie',
    brand_collection: 'The Connoisseurs Show',
    category_id: 'cat-limited',
    description:
      'Part of our limited release capsule. Combines an ultra-heavyweight brushed interior fleece with clean analog soundwave typography across the spine and an understated front tonal insignia.',
    fabric_composition: '100% Organic Heavyweight Cotton Fleece, 460 GSM',
    details: [
      'Exclusive limited edition drop (only 100 units crafted)',
      'Heavy ribbing at cuffs and hem to hold boxy structure',
      'Seamless kangaroo front pocket',
      'Each garment individually stamped with drop authenticity certificate'
    ],
    base_price: 950,
    sale_price: 890,
    featured: true,
    is_new_drop: true,
    is_limited_edition: true,
    published: true,
    created_at: '2026-10-05T14:00:00Z',
    images: [
      {
        id: 'img-5a',
        product_id: 'prod-5',
        image_url: '/hero/hero_streetwear_editorial.jpg',
        alt_text: 'Culture and Rhythm Editorial Shoot',
        display_order: 1
      },
      {
        id: 'img-5b',
        product_id: 'prod-5',
        image_url: '/products/hoodie_vintage_black_back.jpg',
        alt_text: 'Hoodie Soundwave Back View',
        display_order: 2
      }
    ],
    variants: [
      { id: 'var-5-s', product_id: 'prod-5', size: 'S', colour: 'Pitch Black', sku: 'TCS-LTD-CRE-S', available_stock: 4, active: true },
      { id: 'var-5-m', product_id: 'prod-5', size: 'M', colour: 'Pitch Black', sku: 'TCS-LTD-CRE-M', available_stock: 9, active: true },
      { id: 'var-5-l', product_id: 'prod-5', size: 'L', colour: 'Pitch Black', sku: 'TCS-LTD-CRE-L', available_stock: 7, active: true },
      { id: 'var-5-xl', product_id: 'prod-5', size: 'XL', colour: 'Pitch Black', sku: 'TCS-LTD-CRE-XL', available_stock: 3, active: true },
      { id: 'var-5-xxl', product_id: 'prod-5', size: 'XXL', colour: 'Pitch Black', sku: 'TCS-LTD-CRE-XXL', available_stock: 2, active: true }
    ]
  },
  {
    id: 'prod-6',
    name: 'Vintage Connoisseurs 16oz Vinyl Record Tote Bag',
    slug: 'vintage-connoisseurs-heavy-canvas-tote',
    brand_collection: 'Vintage Connoisseurs',
    category_id: 'cat-accessories',
    description:
      'Purpose-built for vinyl collectors, crate diggers, and daily connoisseurs. Made from 16oz untreated heavyweight ecru canvas with reinforced handles that hold up to 15 standard 12" LP records with ease.',
    fabric_composition: '100% Unbleached Heavyweight Cotton Canvas, 16oz',
    details: [
      'Gusseted bottom dimensions specifically sized for 12" vinyl records',
      'Heavy cross-stitched webbing handles',
      'Interior drop pocket for keys, cards, and phone',
      'Dual-sided vintage connoisseurs woodcut graphic print'
    ],
    base_price: 280,
    sale_price: null,
    featured: false,
    is_new_drop: false,
    is_limited_edition: false,
    published: true,
    created_at: '2026-09-20T10:00:00Z',
    images: [
      {
        id: 'img-6a',
        product_id: 'prod-6',
        image_url: '/products/tee_connoisseurs_cream_detail.jpg',
        alt_text: 'Heavyweight Canvas Record Tote',
        display_order: 1
      }
    ],
    variants: [
      { id: 'var-6-os', product_id: 'prod-6', size: 'One Size', colour: 'Natural Ecru / Black Ink', sku: 'VC-TOTE-ECRU-OS', available_stock: 45, active: true }
    ]
  }
];

const LOCAL_STORAGE_KEYS = {
  PRODUCTS: 'tcs_products_v1',
  CATEGORIES: 'tcs_categories_v1',
  ORDERS: 'tcs_orders_v1',
  SUBSCRIBERS: 'tcs_subscribers_v1'
};

function getLocalData<T>(key: string, defaultValue: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return defaultValue;
    return JSON.parse(raw);
  } catch {
    return defaultValue;
  }
}

function setLocalData<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error('LocalStorage write error:', err);
  }
}

// Database Service Module
export const dbService = {
  async getCategories(): Promise<Category[]> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.from('categories').select('*').order('name');
        if (!error && data && data.length > 0) return data;
      } catch (e) {
        console.warn('Falling back to local categories:', e);
      }
    }
    const stored = getLocalData<Category[]>(LOCAL_STORAGE_KEYS.CATEGORIES, SEED_CATEGORIES);
    return stored;
  },

  async getProducts(filters?: FilterOptions): Promise<Product[]> {
    let products: Product[] = [];
    if (isSupabaseConfigured && supabase) {
      try {
        let query = supabase
          .from('products')
          .select(`
            *,
            images:product_images(*),
            variants:product_variants(*)
          `)
          .eq('published', true);

        if (filters?.categorySlug) {
          // get category ID first
          const { data: cat } = await supabase.from('categories').select('*').eq('slug', filters.categorySlug).single();
          if (cat) query = query.eq('category_id', cat.id);
        }

        const { data, error } = await query;
        if (!error && data && data.length > 0) {
          products = data;
        } else {
          products = getLocalData<Product[]>(LOCAL_STORAGE_KEYS.PRODUCTS, SEED_PRODUCTS);
        }
      } catch {
        products = getLocalData<Product[]>(LOCAL_STORAGE_KEYS.PRODUCTS, SEED_PRODUCTS);
      }
    } else {
      products = getLocalData<Product[]>(LOCAL_STORAGE_KEYS.PRODUCTS, SEED_PRODUCTS);
    }

    // Attach category to products
    const categories = await this.getCategories();
    products = products.map((p) => ({
      ...p,
      category: categories.find((c) => c.id === p.category_id)
    }));

    // Client-side filtering logic
    if (filters) {
      if (filters.categorySlug) {
        const cat = categories.find((c) => c.slug === filters.categorySlug);
        if (cat) {
          products = products.filter((p) => p.category_id === cat.id);
        }
      }

      if (filters.brand) {
        products = products.filter((p) => p.brand_collection === filters.brand);
      }

      if (filters.searchQuery && filters.searchQuery.trim()) {
        const q = filters.searchQuery.toLowerCase().trim();
        products = products.filter(
          (p) =>
            p.name.toLowerCase().includes(q) ||
            p.description.toLowerCase().includes(q) ||
            p.brand_collection.toLowerCase().includes(q) ||
            p.category?.name.toLowerCase().includes(q)
        );
      }

      if (filters.size) {
        products = products.filter((p) => p.variants.some((v) => v.size === filters.size && v.available_stock > 0));
      }

      if (filters.colour) {
        const cLower = filters.colour.toLowerCase();
        products = products.filter((p) => p.variants.some((v) => v.colour.toLowerCase().includes(cLower)));
      }

      if (filters.minPrice !== undefined) {
        products = products.filter((p) => {
          const effective = p.sale_price ?? p.base_price;
          return effective >= filters.minPrice!;
        });
      }

      if (filters.maxPrice !== undefined) {
        products = products.filter((p) => {
          const effective = p.sale_price ?? p.base_price;
          return effective <= filters.maxPrice!;
        });
      }

      if (filters.inStockOnly) {
        products = products.filter((p) => p.variants.some((v) => v.available_stock > 0));
      }

      if (filters.onSaleOnly) {
        products = products.filter((p) => p.sale_price !== null && p.sale_price !== undefined);
      }

      if (filters.newDropsOnly) {
        products = products.filter((p) => p.is_new_drop);
      }

      // Sorting
      if (filters.sortBy) {
        if (filters.sortBy === 'price_asc') {
          products.sort((a, b) => (a.sale_price ?? a.base_price) - (b.sale_price ?? b.base_price));
        } else if (filters.sortBy === 'price_desc') {
          products.sort((a, b) => (b.sale_price ?? b.base_price) - (a.sale_price ?? a.base_price));
        } else if (filters.sortBy === 'alphabetical') {
          products.sort((a, b) => a.name.localeCompare(b.name));
        } else if (filters.sortBy === 'newest') {
          products.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        }
      }
    }

    return products;
  },

  async getProductBySlug(slug: string): Promise<Product | null> {
    const products = await this.getProducts();
    const found = products.find((p) => p.slug === slug);
    return found || null;
  },

  async getFeaturedProducts(): Promise<Product[]> {
    const products = await this.getProducts();
    return products.filter((p) => p.featured);
  },

  async createOrder(
    orderData: Omit<Order, 'id' | 'order_number' | 'created_at' | 'updated_at'>
  ): Promise<Order> {
    const timestamp = new Date().toISOString();
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const orderNumber = `TCS-${new Date().getFullYear()}-${randomSuffix}`;
    const newOrderId = `ord-${Date.now()}`;

    const newOrder: Order = {
      ...orderData,
      id: newOrderId,
      order_number: orderNumber,
      created_at: timestamp,
      updated_at: timestamp
    };

    // Deduct stock from local storage products
    const products = getLocalData<Product[]>(LOCAL_STORAGE_KEYS.PRODUCTS, SEED_PRODUCTS);
    newOrder.items.forEach((item) => {
      const prod = products.find((p) => p.id === item.product_id);
      if (prod) {
        const variant = prod.variants.find((v) => v.id === item.variant_id);
        if (variant) {
          variant.available_stock = Math.max(0, variant.available_stock - item.quantity);
        }
      }
    });
    setLocalData(LOCAL_STORAGE_KEYS.PRODUCTS, products);

    // Persist order locally
    const orders = getLocalData<Order[]>(LOCAL_STORAGE_KEYS.ORDERS, []);
    orders.unshift(newOrder);
    setLocalData(LOCAL_STORAGE_KEYS.ORDERS, orders);

    // If Supabase is configured, also persist remotely
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('orders').insert({
          order_number: orderNumber,
          customer_info: newOrder.customer,
          shipping_address: newOrder.shipping_address,
          shipping_method: newOrder.shipping_method,
          subtotal: newOrder.subtotal,
          shipping_fee: newOrder.shipping_fee,
          discount_amount: newOrder.discount_amount,
          final_total: newOrder.final_total,
          payment_method: newOrder.payment_method,
          payment_status: newOrder.payment_status,
          order_status: newOrder.order_status,
          payment_reference: newOrder.payment_reference
        });
      } catch (err) {
        console.warn('Failed to sync order to Supabase:', err);
      }
    }

    return newOrder;
  },

  async getOrderByNumber(orderNumber: string): Promise<Order | null> {
    const orders = getLocalData<Order[]>(LOCAL_STORAGE_KEYS.ORDERS, []);
    const found = orders.find((o) => o.order_number.toUpperCase() === orderNumber.toUpperCase());
    if (found) return found;

    if (isSupabaseConfigured && supabase) {
      try {
        const { data } = await supabase.from('orders').select('*').eq('order_number', orderNumber).single();
        if (data) return data as Order;
      } catch {
        // ignore
      }
    }
    return null;
  },

  async getAllOrders(): Promise<Order[]> {
    return getLocalData<Order[]>(LOCAL_STORAGE_KEYS.ORDERS, []);
  },

  async updateOrderStatus(
    orderId: string,
    orderStatus: OrderStatus,
    paymentStatus?: PaymentStatus
  ): Promise<Order | null> {
    const orders = getLocalData<Order[]>(LOCAL_STORAGE_KEYS.ORDERS, []);
    const idx = orders.findIndex((o) => o.id === orderId || o.order_number === orderId);
    if (idx === -1) return null;

    orders[idx].order_status = orderStatus;
    if (paymentStatus) {
      orders[idx].payment_status = paymentStatus;
    }
    orders[idx].updated_at = new Date().toISOString();

    setLocalData(LOCAL_STORAGE_KEYS.ORDERS, orders);
    return orders[idx];
  },

  async updateProduct(id: string, updates: Partial<Product>): Promise<Product | null> {
    const products = getLocalData<Product[]>(LOCAL_STORAGE_KEYS.PRODUCTS, SEED_PRODUCTS);
    const idx = products.findIndex((p) => p.id === id);
    if (idx === -1) return null;

    products[idx] = { ...products[idx], ...updates };
    setLocalData(LOCAL_STORAGE_KEYS.PRODUCTS, products);
    return products[idx];
  },

  async addProduct(product: Omit<Product, 'id' | 'created_at'>): Promise<Product> {
    const products = getLocalData<Product[]>(LOCAL_STORAGE_KEYS.PRODUCTS, SEED_PRODUCTS);
    const newProduct: Product = {
      ...product,
      id: `prod-${Date.now()}`,
      created_at: new Date().toISOString()
    };
    products.unshift(newProduct);
    setLocalData(LOCAL_STORAGE_KEYS.PRODUCTS, products);
    return newProduct;
  },

  async deleteProduct(id: string): Promise<boolean> {
    const products = getLocalData<Product[]>(LOCAL_STORAGE_KEYS.PRODUCTS, SEED_PRODUCTS);
    const filtered = products.filter((p) => p.id !== id);
    setLocalData(LOCAL_STORAGE_KEYS.PRODUCTS, filtered);
    return true;
  },

  async subscribeNewsletter(email: string): Promise<{ success: boolean; message: string }> {
    if (!email || !email.includes('@')) {
      return { success: false, message: 'Please provide a valid email address.' };
    }
    const subs = getLocalData<NewsletterSubscriber[]>(LOCAL_STORAGE_KEYS.SUBSCRIBERS, []);
    if (subs.some((s) => s.email.toLowerCase() === email.toLowerCase())) {
      return { success: true, message: 'You are already subscribed to The Connoisseurs Drops.' };
    }

    subs.push({
      id: `sub-${Date.now()}`,
      email: email.toLowerCase(),
      consent: true,
      status: 'active',
      created_at: new Date().toISOString()
    });
    setLocalData(LOCAL_STORAGE_KEYS.SUBSCRIBERS, subs);

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('newsletter_subscribers').insert({ email: email.toLowerCase(), consent: true });
      } catch {
        // silent
      }
    }

    return { success: true, message: 'Welcome to the Connoisseurs Circle. Check your inbox for updates.' };
  },

  async submitContactInquiry(inquiry: {
    name: string;
    email: string;
    subject: string;
    order_number?: string;
    message: string;
  }): Promise<{ success: boolean; message: string }> {
    if (!inquiry.name || !inquiry.email || !inquiry.message) {
      return { success: false, message: 'Please fill in all required fields.' };
    }
    return {
      success: true,
      message: 'Thank you for reaching out. A Connoisseurs customer care specialist will respond within 24 hours.'
    };
  },

  async getDashboardStats() {
    const orders = await this.getAllOrders();
    const products = await this.getProducts();

    const totalRevenue = orders
      .filter((o) => o.payment_status === 'completed' || o.order_status === 'Paid')
      .reduce((sum, o) => sum + o.final_total, 0);

    const pendingOrders = orders.filter((o) => o.order_status === 'Pending Payment').length;
    
    let lowStockCount = 0;
    products.forEach((p) => {
      p.variants.forEach((v) => {
        if (v.available_stock > 0 && v.available_stock <= 5) {
          lowStockCount++;
        }
      });
    });

    return {
      totalRevenue,
      totalOrders: orders.length,
      pendingOrders,
      lowStockCount
    };
  }
};
