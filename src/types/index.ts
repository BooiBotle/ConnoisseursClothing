export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image_url: string;
}

export interface ProductVariant {
  id: string;
  product_id: string;
  size: 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL' | 'One Size';
  colour: string;
  sku: string;
  price_override?: number | null;
  available_stock: number;
  active: boolean;
}

export interface ProductImage {
  id: string;
  product_id: string;
  image_url: string;
  alt_text: string;
  display_order: number;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  brand_collection: 'The Connoisseurs Show' | 'Vintage Connoisseurs' | 'Collab Edition';
  category_id: string;
  category?: Category;
  description: string;
  details?: string[];
  fabric_composition?: string;
  base_price: number; // in South African Rand (ZAR)
  sale_price?: number | null;
  featured: boolean;
  is_new_drop: boolean;
  is_limited_edition: boolean;
  published: boolean;
  created_at: string;
  images: ProductImage[];
  variants: ProductVariant[];
}

export interface CartItem {
  id: string; // generated unique key e.g. `${productId}-${variantId}`
  product_id: string;
  variant_id: string;
  product_name: string;
  product_slug: string;
  image_url: string;
  size: string;
  colour: string;
  unit_price: number;
  quantity: number;
  max_stock: number;
  sku: string;
}

export type OrderStatus =
  | 'Pending Payment'
  | 'Paid'
  | 'Processing'
  | 'Shipped'
  | 'Completed'
  | 'Cancelled'
  | 'Refunded';

export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'cancelled';

export interface CustomerInfo {
  full_name: string;
  email: string;
  phone: string;
}

export interface ShippingAddress {
  address_line1: string;
  address_line2?: string;
  suburb: string;
  city: string;
  province:
    | 'Gauteng'
    | 'Western Cape'
    | 'KwaZulu-Natal'
    | 'Eastern Cape'
    | 'Free State'
    | 'Limpopo'
    | 'Mpumalanga'
    | 'North West'
    | 'Northern Cape';
  postal_code: string;
  country: string; // South Africa
  delivery_instructions?: string;
}

export interface ShippingOption {
  id: string;
  name: string;
  description: string;
  estimated_days: string;
  price: number;
  free_threshold?: number;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  product_name_snapshot: string;
  variant_id: string;
  sku_snapshot: string;
  size: string;
  colour: string;
  quantity: number;
  unit_price: number;
  line_total: number;
}

export interface Order {
  id: string;
  order_number: string;
  customer: CustomerInfo;
  shipping_address: ShippingAddress;
  shipping_method: string;
  subtotal: number;
  shipping_fee: number;
  discount_amount: number;
  final_total: number;
  payment_method: 'payfast' | 'yoco' | 'eft_instant' | 'manual_eft';
  payment_status: PaymentStatus;
  order_status: OrderStatus;
  payment_reference?: string;
  created_at: string;
  updated_at: string;
  items: OrderItem[];
}

export interface NewsletterSubscriber {
  id: string;
  email: string;
  consent: boolean;
  status: 'active' | 'unsubscribed';
  created_at: string;
}

export interface FilterOptions {
  categorySlug?: string;
  brand?: string;
  size?: string;
  colour?: string;
  minPrice?: number;
  maxPrice?: number;
  inStockOnly?: boolean;
  onSaleOnly?: boolean;
  newDropsOnly?: boolean;
  searchQuery?: string;
  sortBy?: 'featured' | 'newest' | 'price_asc' | 'price_desc' | 'alphabetical';
}
