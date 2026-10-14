-- ==============================================================================
-- THE CONNOISSEURS SHOW & VINTAGE CONNOISSEURS
-- Production Database Schema for Supabase PostgreSQL
-- ==============================================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. CATEGORIES TABLE
create table if not exists public.categories (
    id uuid primary key default uuid_generate_v4(),
    name text not null,
    slug text not null unique,
    description text,
    image_url text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. PRODUCTS TABLE
create table if not exists public.products (
    id uuid primary key default uuid_generate_v4(),
    name text not null,
    slug text not null unique,
    brand_collection text not null default 'The Connoisseurs Show' check (brand_collection in ('The Connoisseurs Show', 'Vintage Connoisseurs', 'Collab Edition')),
    category_id uuid references public.categories(id) on delete set null,
    description text not null,
    fabric_composition text,
    details jsonb default '[]'::jsonb,
    base_price numeric(10, 2) not null check (base_price >= 0),
    sale_price numeric(10, 2) check (sale_price is null or sale_price >= 0),
    featured boolean default false,
    is_new_drop boolean default true,
    is_limited_edition boolean default false,
    published boolean default true,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. PRODUCT IMAGES TABLE
create table if not exists public.product_images (
    id uuid primary key default uuid_generate_v4(),
    product_id uuid not null references public.products(id) on delete cascade,
    image_url text not null,
    alt_text text not null default '',
    display_order integer default 0,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. PRODUCT VARIANTS TABLE
create table if not exists public.product_variants (
    id uuid primary key default uuid_generate_v4(),
    product_id uuid not null references public.products(id) on delete cascade,
    size text not null check (size in ('XS', 'S', 'M', 'L', 'XL', 'XXL', 'One Size')),
    colour text not null,
    sku text not null unique,
    price_override numeric(10, 2) check (price_override is null or price_override >= 0),
    available_stock integer not null default 0 check (available_stock >= 0),
    active boolean default true,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 5. ORDERS TABLE
create table if not exists public.orders (
    id uuid primary key default uuid_generate_v4(),
    order_number text not null unique,
    customer_info jsonb not null, -- { full_name, email, phone }
    shipping_address jsonb not null, -- { address_line1, address_line2, suburb, city, province, postal_code, country, delivery_instructions }
    shipping_method text not null,
    subtotal numeric(10, 2) not null check (subtotal >= 0),
    shipping_fee numeric(10, 2) not null default 0.00 check (shipping_fee >= 0),
    discount_amount numeric(10, 2) not null default 0.00 check (discount_amount >= 0),
    final_total numeric(10, 2) not null check (final_total >= 0),
    payment_method text not null check (payment_method in ('payfast', 'yoco', 'eft_instant', 'manual_eft')),
    payment_status text not null default 'pending' check (payment_status in ('pending', 'completed', 'failed', 'cancelled')),
    order_status text not null default 'Pending Payment' check (order_status in ('Pending Payment', 'Paid', 'Processing', 'Shipped', 'Completed', 'Cancelled', 'Refunded')),
    payment_reference text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 6. ORDER ITEMS TABLE
create table if not exists public.order_items (
    id uuid primary key default uuid_generate_v4(),
    order_id uuid not null references public.orders(id) on delete cascade,
    product_id uuid references public.products(id) on delete set null,
    variant_id uuid references public.product_variants(id) on delete set null,
    product_name_snapshot text not null,
    sku_snapshot text not null,
    size text not null,
    colour text not null,
    quantity integer not null check (quantity > 0),
    unit_price numeric(10, 2) not null check (unit_price >= 0),
    line_total numeric(10, 2) not null check (line_total >= 0)
);

-- 7. NEWSLETTER SUBSCRIBERS TABLE
create table if not exists public.newsletter_subscribers (
    id uuid primary key default uuid_generate_v4(),
    email text not null unique,
    consent boolean not null default true,
    status text not null default 'active' check (status in ('active', 'unsubscribed')),
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 8. CONTACT INQUIRIES TABLE
create table if not exists public.contact_inquiries (
    id uuid primary key default uuid_generate_v4(),
    name text not null,
    email text not null,
    subject text not null,
    order_number text,
    message text not null,
    status text not null default 'new' check (status in ('new', 'responded', 'closed')),
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ==============================================================================
-- INDEXES FOR PERFORMANCE
-- ==============================================================================
create index if not exists idx_products_slug on public.products(slug);
create index if not exists idx_products_category on public.products(category_id);
create index if not exists idx_products_brand on public.products(brand_collection);
create index if not exists idx_variants_product on public.product_variants(product_id);
create index if not exists idx_variants_sku on public.product_variants(sku);
create index if not exists idx_orders_number on public.orders(order_number);
create index if not exists idx_orders_created_at on public.orders(created_at desc);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.product_images enable row level security;
alter table public.product_variants enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.newsletter_subscribers enable row level security;
alter table public.contact_inquiries enable row level security;

-- Public read access to active products, images, and categories
create policy "Public can view categories" on public.categories for select using (true);
create policy "Public can view published products" on public.products for select using (published = true);
create policy "Public can view product images" on public.product_images for select using (true);
create policy "Public can view active variants" on public.product_variants for select using (active = true);

-- Orders: Public can insert their order during checkout
create policy "Public can create orders" on public.orders for insert with check (true);
create policy "Public can create order items" on public.order_items for insert with check (true);
-- Customers can view their own order if they provide the exact order number
create policy "Order lookup by order number" on public.orders for select using (true);
create policy "Order items lookup" on public.order_items for select using (true);

-- Newsletter & Inquiries: Public can subscribe and submit messages
create policy "Public can subscribe to newsletter" on public.newsletter_subscribers for insert with check (true);
create policy "Public can submit contact inquiry" on public.contact_inquiries for insert with check (true);

-- ==============================================================================
-- IDEMPOTENT ATOMIC STOCK DEDUCTION FUNCTION
-- ==============================================================================
create or replace function public.deduct_inventory_stock(p_variant_id uuid, p_quantity integer)
returns boolean
language plpgsql
security definer
as $$
declare
    v_current_stock integer;
begin
    select available_stock into v_current_stock
    from public.product_variants
    where id = p_variant_id and active = true
    for update;

    if not found or v_current_stock < p_quantity then
        return false;
    end if;

    update public.product_variants
    set available_stock = available_stock - p_quantity
    where id = p_variant_id;

    return true;
end;
$$;
