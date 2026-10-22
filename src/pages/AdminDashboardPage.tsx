import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Package,
  ShoppingBag,
  TrendingUp,
  AlertTriangle,
  Plus,
  Trash2,
  Edit2,
  Eye,
  CheckCircle2,
  Clock,
  Search,
  Lock,
  LogOut,
  Sliders,
  DollarSign,
  Truck,
  RefreshCw
} from 'lucide-react';
import { useAdmin } from '../context/AdminContext';
import { dbService } from '../services/db';
import { formatZAR, formatDate, slugify } from '../utils/formatters';
import { Order, OrderStatus, Product, ProductVariant } from '../types';
import { isSupabaseConfigured } from '../services/supabase';
import { getAssetPath } from '../utils/assets';

export const AdminDashboardPage: React.FC = () => {
  const { isAdminAuthenticated, adminUser, login, logout } = useAdmin();

  // Login form state
  const [emailInput, setEmailInput] = useState('admin@theconnoisseurs.co.za');
  const [passInput, setPassInput] = useState('connoisseur2026');
  const [loginError, setLoginError] = useState<string | null>(null);

  // Dashboard active tab
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'orders' | 'settings'>('overview');

  // Data state
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    pendingOrders: 0,
    lowStockCount: 0
  });
  const [loading, setLoading] = useState(true);

  // Search & Filters in Admin
  const [orderFilterStatus, setOrderFilterStatus] = useState<string>('all');
  const [orderSearchQuery, setOrderSearchQuery] = useState('');
  const [productSearchQuery, setProductSearchQuery] = useState('');

  // Add Product Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    brand_collection: 'The Connoisseurs Show' as Product['brand_collection'],
    category_id: 'cat-hoodies',
    description: '',
    fabric_composition: '',
    base_price: 450,
    sale_price: '',
    featured: false,
    is_new_drop: true,
    is_limited_edition: false,
    image_url: getAssetPath('products/hoodie_vintage_black_front.jpg'),
    sizes: ['S', 'M', 'L', 'XL'],
    colour: 'Vintage Washed Black',
    initialStock: 15
  });

  const loadData = async () => {
    setLoading(true);
    const [pList, oList, sData] = await Promise.all([
      dbService.getProducts(),
      dbService.getAllOrders(),
      dbService.getDashboardStats()
    ]);
    setProducts(pList);
    setOrders(oList);
    setStats(sData);
    setLoading(false);
  };

  useEffect(() => {
    if (isAdminAuthenticated) {
      loadData();
    }
  }, [isAdminAuthenticated]);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = login(emailInput, passInput);
    if (!success) {
      setLoginError('Invalid administrator credentials.');
    } else {
      setLoginError(null);
    }
  };

  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    await dbService.updateOrderStatus(orderId, newStatus);
    await loadData();
  };

  const handleToggleFeatured = async (product: Product) => {
    await dbService.updateProduct(product.id, { featured: !product.featured });
    await loadData();
  };

  const handleDeleteProduct = async (productId: string) => {
    if (window.confirm('Are you sure you want to remove this product from the catalogue?')) {
      await dbService.deleteProduct(productId);
      await loadData();
    }
  };

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProduct.name.trim()) return;

    const slug = slugify(newProduct.name);
    const salePriceNum = newProduct.sale_price ? parseFloat(newProduct.sale_price) : null;

    const variants: ProductVariant[] = newProduct.sizes.map((sz, idx) => ({
      id: `var-${Date.now()}-${idx}`,
      product_id: '',
      size: sz as ProductVariant['size'],
      colour: newProduct.colour,
      sku: `TCS-${sz}-${Date.now().toString().slice(-4)}`,
      available_stock: Number(newProduct.initialStock),
      active: true
    }));

    await dbService.addProduct({
      name: newProduct.name,
      slug: slug,
      brand_collection: newProduct.brand_collection,
      category_id: newProduct.category_id,
      description: newProduct.description,
      fabric_composition: newProduct.fabric_composition,
      base_price: Number(newProduct.base_price),
      sale_price: salePriceNum,
      featured: newProduct.featured,
      is_new_drop: newProduct.is_new_drop,
      is_limited_edition: newProduct.is_limited_edition,
      published: true,
      images: [
        {
          id: `img-${Date.now()}`,
          product_id: '',
          image_url: newProduct.image_url,
          alt_text: newProduct.name,
          display_order: 1
        }
      ],
      variants: variants
    });

    setIsAddModalOpen(false);
    await loadData();
  };

  // If not authenticated, show secure admin login
  if (!isAdminAuthenticated) {
    return (
      <div className="min-h-screen bg-[#050505] text-[#F5F2EC] flex items-center justify-center py-16 px-4">
        <div className="max-w-md w-full bg-[#121212] border border-white/10 rounded-xs p-8 shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 mx-auto flex items-center justify-center text-white/80">
              <Lock className="w-6 h-6" />
            </div>
            <h1 className="font-display text-2xl uppercase tracking-wider text-white font-bold">
              CONNOISSEURS STORE ADMIN
            </h1>
            <p className="text-xs text-white/50 font-sans">
              Enter authorized administrator credentials to manage products, drops, inventory, and orders.
            </p>
          </div>

          {loginError && (
            <div className="p-3 bg-rose-950/80 border border-rose-500/50 rounded-xs text-xs font-mono text-rose-300">
              {loginError}
            </div>
          )}

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs uppercase font-mono text-white/70 mb-1">
                Admin Email
              </label>
              <input
                type="email"
                required
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                className="w-full bg-[#181818] border border-white/15 px-3 py-2 text-xs text-white rounded-xs focus:outline-none focus:border-white"
              />
            </div>

            <div>
              <label className="block text-xs uppercase font-mono text-white/70 mb-1">
                Curator Passkey
              </label>
              <input
                type="password"
                required
                value={passInput}
                onChange={(e) => setPassInput(e.target.value)}
                className="w-full bg-[#181818] border border-white/15 px-3 py-2 text-xs text-white rounded-xs focus:outline-none focus:border-white"
              />
            </div>

            <div className="p-3 bg-white/5 border border-white/10 rounded-xs text-[11px] font-mono text-white/60 space-y-1">
              <div>Default Demo Credentials:</div>
              <div>User: <strong className="text-white">admin@theconnoisseurs.co.za</strong></div>
              <div>Pass: <strong className="text-white">connoisseur2026</strong></div>
            </div>

            <button
              type="submit"
              className="w-full px-4 py-3 bg-white text-black font-display text-sm uppercase tracking-widest font-bold rounded-xs hover:bg-neutral-200 transition-colors"
            >
              Access Dashboard
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Filtered orders
  const filteredOrders = orders.filter((o) => {
    const matchesStatus = orderFilterStatus === 'all' || o.order_status === orderFilterStatus;
    const matchesSearch =
      !orderSearchQuery ||
      o.order_number.toLowerCase().includes(orderSearchQuery.toLowerCase()) ||
      o.customer.full_name.toLowerCase().includes(orderSearchQuery.toLowerCase()) ||
      o.customer.email.toLowerCase().includes(orderSearchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  // Filtered products
  const filteredProducts = products.filter((p) => {
    return (
      !productSearchQuery ||
      p.name.toLowerCase().includes(productSearchQuery.toLowerCase()) ||
      p.brand_collection.toLowerCase().includes(productSearchQuery.toLowerCase())
    );
  });

  return (
    <div className="min-h-screen bg-[#050505] text-[#F5F2EC] py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Top Header */}
        <div className="bg-[#121212] border border-white/10 rounded-xs p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <img
              src={getAssetPath('brand/connoisseurs_show_light.png')}
              alt="Logo"
              className="h-10 w-auto"
            />
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="font-display text-2xl uppercase tracking-wider text-white font-bold">
                  STORE MANAGEMENT DASHBOARD
                </h1>
                <span className="px-2 py-0.5 text-[10px] font-mono bg-white/10 border border-white/20 text-white rounded">
                  {adminUser?.role}
                </span>
              </div>
              <div className="flex items-center space-x-3 text-xs font-mono text-white/50 mt-0.5">
                <span>{adminUser?.email}</span>
                <span>•</span>
                <span className="flex items-center space-x-1 text-emerald-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  <span>{isSupabaseConfigured ? 'Supabase Connected' : 'Local Storage Mode'}</span>
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={loadData}
              className="px-3 py-2 bg-white/5 hover:bg-white/10 text-white text-xs font-mono rounded-xs border border-white/10 flex items-center space-x-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Refresh</span>
            </button>
            <button
              onClick={logout}
              className="px-3 py-2 bg-white text-black text-xs font-mono rounded-xs border border-white/10 flex items-center space-x-1.5"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-2 border-b border-white/10 pb-2 text-xs font-mono">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 rounded-xs uppercase tracking-wider font-bold transition-colors ${
              activeTab === 'overview' ? 'bg-white text-black' : 'text-white/60 hover:text-white bg-white/5'
            }`}
          >
            Overview &amp; Metrics
          </button>
          <button
            onClick={() => setActiveTab('products')}
            className={`px-4 py-2 rounded-xs uppercase tracking-wider font-bold transition-colors ${
              activeTab === 'products' ? 'bg-white text-black' : 'text-white/60 hover:text-white bg-white/5'
            }`}
          >
            Products &amp; Stock ({products.length})
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2 rounded-xs uppercase tracking-wider font-bold transition-colors ${
              activeTab === 'orders' ? 'bg-white text-black' : 'text-white/60 hover:text-white bg-white/5'
            }`}
          >
            Orders &amp; Dispatch ({orders.length})
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`px-4 py-2 rounded-xs uppercase tracking-wider font-bold transition-colors ${
              activeTab === 'settings' ? 'bg-white text-black' : 'text-white/60 hover:text-white bg-white/5'
            }`}
          >
            Gateways &amp; Settings
          </button>
        </div>

        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-[#121212] border border-white/10 p-5 rounded-xs space-y-2">
                <span className="text-[10px] uppercase font-mono tracking-widest text-white/50 block">
                  TOTAL REVENUE (VERIFIED)
                </span>
                <div className="font-mono text-2xl font-bold text-emerald-400">
                  {formatZAR(stats.totalRevenue)}
                </div>
                <span className="text-[11px] text-white/40 font-mono">From confirmed orders</span>
              </div>

              <div className="bg-[#121212] border border-white/10 p-5 rounded-xs space-y-2">
                <span className="text-[10px] uppercase font-mono tracking-widest text-white/50 block">
                  TOTAL ORDERS PLACED
                </span>
                <div className="font-mono text-2xl font-bold text-white">
                  {stats.totalOrders}
                </div>
                <span className="text-[11px] text-white/40 font-mono">Across all provinces</span>
              </div>

              <div className="bg-[#121212] border border-white/10 p-5 rounded-xs space-y-2">
                <span className="text-[10px] uppercase font-mono tracking-widest text-white/50 block">
                  PENDING ACTION
                </span>
                <div className="font-mono text-2xl font-bold text-amber-400">
                  {stats.pendingOrders}
                </div>
                <span className="text-[11px] text-white/40 font-mono">Awaiting verification / EFT</span>
              </div>

              <div className="bg-[#121212] border border-white/10 p-5 rounded-xs space-y-2">
                <span className="text-[10px] uppercase font-mono tracking-widest text-white/50 block">
                  LOW STOCK ALERTS
                </span>
                <div className="font-mono text-2xl font-bold text-rose-400">
                  {stats.lowStockCount}
                </div>
                <span className="text-[11px] text-white/40 font-mono">Variants &lt;= 5 units</span>
              </div>
            </div>

            {/* Recent Orders Overview */}
            <div className="bg-[#121212] border border-white/10 rounded-xs p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <h3 className="font-display text-lg uppercase tracking-wider text-white font-bold">
                  RECENT STORE ORDERS
                </h3>
                <button
                  onClick={() => setActiveTab('orders')}
                  className="text-xs uppercase font-mono text-white/60 hover:text-white"
                >
                  View All Orders &rarr;
                </button>
              </div>

              {orders.length === 0 ? (
                <div className="py-8 text-center text-xs text-white/40 font-mono">
                  No orders recorded yet. As customers shop, their records will appear here.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs font-mono divide-y divide-white/10">
                    <thead>
                      <tr className="text-white/40 uppercase">
                        <th className="py-2 px-3">Order Number</th>
                        <th className="py-2 px-3">Customer</th>
                        <th className="py-2 px-3">Province</th>
                        <th className="py-2 px-3">Total</th>
                        <th className="py-2 px-3">Status</th>
                        <th className="py-2 px-3">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-white/80">
                      {orders.slice(0, 5).map((o) => (
                        <tr key={o.id}>
                          <td className="py-3 px-3 font-bold text-white">{o.order_number}</td>
                          <td className="py-3 px-3">{o.customer.full_name}</td>
                          <td className="py-3 px-3">{o.shipping_address.province}</td>
                          <td className="py-3 px-3 font-bold">{formatZAR(o.final_total)}</td>
                          <td className="py-3 px-3">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] ${
                                o.order_status === 'Paid'
                                  ? 'bg-emerald-500/20 text-emerald-300'
                                  : 'bg-amber-500/20 text-amber-300'
                              }`}
                            >
                              {o.order_status}
                            </span>
                          </td>
                          <td className="py-3 px-3 text-white/40">{formatDate(o.created_at)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: PRODUCTS MANAGER */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 text-white/40 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={productSearchQuery}
                  onChange={(e) => setProductSearchQuery(e.target.value)}
                  placeholder="Filter products..."
                  className="w-full bg-[#121212] border border-white/15 pl-9 pr-3 py-2 text-xs text-white rounded-xs focus:outline-none"
                />
              </div>

              <button
                type="button"
                onClick={() => setIsAddModalOpen(true)}
                className="w-full sm:w-auto px-4 py-2.5 bg-white text-black font-display tracking-widest text-xs uppercase font-bold hover:bg-neutral-200 transition-colors rounded-xs flex items-center justify-center space-x-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>ADD NEW MERCHANDISE</span>
              </button>
            </div>

            <div className="bg-[#121212] border border-white/10 rounded-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono divide-y divide-white/10">
                  <thead className="bg-white/5">
                    <tr className="text-white/50 uppercase">
                      <th className="py-3 px-4">Garment</th>
                      <th className="py-3 px-4">Brand Label</th>
                      <th className="py-3 px-4">Base Price</th>
                      <th className="py-3 px-4">Sale Price</th>
                      <th className="py-3 px-4">Total Stock</th>
                      <th className="py-3 px-4">Featured</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-white/80">
                    {filteredProducts.map((p) => {
                      const stockCount = p.variants.reduce((sum, v) => sum + v.available_stock, 0);
                      return (
                        <tr key={p.id} className="hover:bg-white/2">
                          <td className="py-3 px-4 flex items-center space-x-3">
                            <img
                              src={p.images[0]?.image_url}
                              alt=""
                              className="w-10 h-12 object-cover rounded-xs bg-[#1c1c1c] flex-shrink-0"
                            />
                            <div>
                              <div className="font-bold text-white">{p.name}</div>
                              <div className="text-[10px] text-white/40">slug: {p.slug}</div>
                            </div>
                          </td>
                          <td className="py-3 px-4">{p.brand_collection}</td>
                          <td className="py-3 px-4">{formatZAR(p.base_price)}</td>
                          <td className="py-3 px-4">
                            {p.sale_price ? formatZAR(p.sale_price) : '—'}
                          </td>
                          <td className="py-3 px-4">
                            <span
                              className={`font-bold ${
                                stockCount <= 5 ? 'text-rose-400' : 'text-white'
                              }`}
                            >
                              {stockCount} units
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <button
                              onClick={() => handleToggleFeatured(p)}
                              className={`px-2 py-0.5 rounded text-[10px] ${
                                p.featured
                                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                                  : 'bg-white/5 text-white/40'
                              }`}
                            >
                              {p.featured ? 'FEATURED' : 'No'}
                            </button>
                          </td>
                          <td className="py-3 px-4 text-right space-x-2">
                            <Link
                              to={`/product/${p.slug}`}
                              className="inline-block p-1 text-white/60 hover:text-white"
                              title="View on store"
                            >
                              <Eye className="w-4 h-4" />
                            </Link>
                            <button
                              onClick={() => handleDeleteProduct(p.id)}
                              className="p-1 text-white/40 hover:text-rose-400"
                              title="Delete product"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: ORDERS MANAGER */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 text-white/40 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={orderSearchQuery}
                  onChange={(e) => setOrderSearchQuery(e.target.value)}
                  placeholder="Search by order # or customer..."
                  className="w-full bg-[#121212] border border-white/15 pl-9 pr-3 py-2 text-xs text-white rounded-xs focus:outline-none"
                />
              </div>

              <div className="flex items-center space-x-2 text-xs font-mono">
                <span className="text-white/40">Status:</span>
                <select
                  value={orderFilterStatus}
                  onChange={(e) => setOrderFilterStatus(e.target.value)}
                  className="bg-[#121212] border border-white/15 text-white text-xs px-3 py-1.5 rounded-xs"
                >
                  <option value="all">All Statuses</option>
                  <option value="Pending Payment">Pending Payment</option>
                  <option value="Paid">Paid</option>
                  <option value="Processing">Processing</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            <div className="bg-[#121212] border border-white/10 rounded-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono divide-y divide-white/10">
                  <thead className="bg-white/5">
                    <tr className="text-white/50 uppercase">
                      <th className="py-3 px-4">Order #</th>
                      <th className="py-3 px-4">Customer Details</th>
                      <th className="py-3 px-4">Destination</th>
                      <th className="py-3 px-4">Items</th>
                      <th className="py-3 px-4">Total</th>
                      <th className="py-3 px-4">Update Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-white/80">
                    {filteredOrders.map((o) => (
                      <tr key={o.id} className="hover:bg-white/2">
                        <td className="py-3 px-4">
                          <span className="font-bold text-white block">{o.order_number}</span>
                          <span className="text-[10px] text-white/40">{formatDate(o.created_at)}</span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-medium text-white">{o.customer.full_name}</div>
                          <div className="text-[11px] text-white/50">{o.customer.email}</div>
                          <div className="text-[11px] text-white/40">{o.customer.phone}</div>
                        </td>
                        <td className="py-3 px-4">
                          <div>{o.shipping_address.city}, {o.shipping_address.province}</div>
                          <div className="text-[10px] text-white/40">{o.shipping_method}</div>
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-bold">{o.items.length} garments</span>
                        </td>
                        <td className="py-3 px-4 font-bold text-white">
                          {formatZAR(o.final_total)}
                        </td>
                        <td className="py-3 px-4">
                          <select
                            value={o.order_status}
                            onChange={(e) => handleStatusChange(o.id, e.target.value as OrderStatus)}
                            className="bg-[#1c1c1c] border border-white/15 text-xs text-white px-2 py-1 rounded"
                          >
                            <option value="Pending Payment">Pending Payment</option>
                            <option value="Paid">Paid</option>
                            <option value="Processing">Processing</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Completed">Completed</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: SETTINGS & GATEWAYS */}
        {activeTab === 'settings' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* PayFast Activation Guide */}
            <div className="bg-[#121212] border border-white/10 rounded-xs p-6 space-y-4">
              <h3 className="font-display text-lg uppercase tracking-wider text-white font-bold">
                PAYFAST PRODUCTION ACTIVATION
              </h3>
              <p className="text-xs text-white/60 leading-relaxed font-sans">
                To accept live South African payments via Credit Card, Debit Card, Instant EFT and Zapper:
              </p>
              <ol className="list-decimal pl-4 space-y-2 text-xs font-mono text-white/80">
                <li>Register a verified merchant account at <a href="https://www.payfast.co.za" target="_blank" rel="noreferrer" className="text-white underline">payfast.co.za</a></li>
                <li>Obtain your <strong>Merchant ID</strong> and <strong>Merchant Key</strong> from the dashboard settings.</li>
                <li>Set a secure <strong>Passphrase</strong> under Settings &gt; Integration.</li>
                <li>Add the variables into your production environment file (<code>.env</code>):
                  <pre className="bg-black/60 p-2 rounded text-[11px] text-emerald-300 mt-1">
VITE_PAYFAST_MERCHANT_ID=your_id
VITE_PAYFAST_MERCHANT_KEY=your_key
VITE_PAYFAST_PASSPHRASE=your_passphrase
                  </pre>
                </li>
              </ol>
            </div>

            {/* Yoco Activation Guide */}
            <div className="bg-[#121212] border border-white/10 rounded-xs p-6 space-y-4">
              <h3 className="font-display text-lg uppercase tracking-wider text-white font-bold">
                YOCO CARD GATEWAY ACTIVATION
              </h3>
              <p className="text-xs text-white/60 leading-relaxed font-sans">
                For card payments with 3D-Secure South African banking OTP:
              </p>
              <ol className="list-decimal pl-4 space-y-2 text-xs font-mono text-white/80">
                <li>Register at <a href="https://www.yoco.com" target="_blank" rel="noreferrer" className="text-white underline">yoco.com</a></li>
                <li>Navigate to Developer Settings and copy your <strong>Live Public Key</strong> (starts with <code>pk_live_...</code>).</li>
                <li>Add to your environment file:
                  <pre className="bg-black/60 p-2 rounded text-[11px] text-emerald-300 mt-1">
VITE_YOCO_PUBLIC_KEY=pk_live_...
                  </pre>
                </li>
              </ol>
            </div>
          </div>
        )}
      </div>

      {/* Add Product Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/85 backdrop-blur-sm" onClick={() => setIsAddModalOpen(false)} />
          <div className="relative w-full max-w-xl bg-[#141414] border border-white/15 rounded-xs p-6 max-h-[90vh] overflow-y-auto z-10 space-y-4">
            <h3 className="font-display text-xl uppercase tracking-wider text-white font-bold">
              ADD NEW MERCHANDISE ITEM
            </h3>

            <form onSubmit={handleCreateProduct} className="space-y-4 text-xs font-mono">
              <div>
                <label className="block text-white/70 mb-1">Garment Name *</label>
                <input
                  type="text"
                  required
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  placeholder="e.g. Frequency Architects Heavyweight Hoodie"
                  className="w-full bg-[#1c1c1c] border border-white/15 px-3 py-2 text-white rounded-xs focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-white/70 mb-1">Brand Label</label>
                  <select
                    value={newProduct.brand_collection}
                    onChange={(e) =>
                      setNewProduct({
                        ...newProduct,
                        brand_collection: e.target.value as Product['brand_collection']
                      })
                    }
                    className="w-full bg-[#1c1c1c] border border-white/15 px-3 py-2 text-white rounded-xs"
                  >
                    <option value="The Connoisseurs Show">The Connoisseurs Show</option>
                    <option value="Vintage Connoisseurs">Vintage Connoisseurs</option>
                    <option value="Collab Edition">Collab Edition</option>
                  </select>
                </div>

                <div>
                  <label className="block text-white/70 mb-1">Category</label>
                  <select
                    value={newProduct.category_id}
                    onChange={(e) => setNewProduct({ ...newProduct, category_id: e.target.value })}
                    className="w-full bg-[#1c1c1c] border border-white/15 px-3 py-2 text-white rounded-xs"
                  >
                    <option value="cat-hoodies">Hoodies &amp; Sweatshirts</option>
                    <option value="cat-tees">T-Shirts &amp; Tops</option>
                    <option value="cat-caps">Caps &amp; Headwear</option>
                    <option value="cat-limited">Limited Drops</option>
                    <option value="cat-accessories">Accessories</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-white/70 mb-1">Base Price (ZAR) *</label>
                  <input
                    type="number"
                    required
                    value={newProduct.base_price}
                    onChange={(e) => setNewProduct({ ...newProduct, base_price: Number(e.target.value) })}
                    className="w-full bg-[#1c1c1c] border border-white/15 px-3 py-2 text-white rounded-xs"
                  />
                </div>

                <div>
                  <label className="block text-white/70 mb-1">Sale Price (Optional)</label>
                  <input
                    type="number"
                    value={newProduct.sale_price}
                    onChange={(e) => setNewProduct({ ...newProduct, sale_price: e.target.value })}
                    placeholder="Leave empty if none"
                    className="w-full bg-[#1c1c1c] border border-white/15 px-3 py-2 text-white rounded-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-white/70 mb-1">Fabric &amp; Description</label>
                <textarea
                  rows={3}
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                  placeholder="Describe the silhouette, music culture inspiration, and textile details..."
                  className="w-full bg-[#1c1c1c] border border-white/15 px-3 py-2 text-white rounded-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-white/70 mb-1">Stock Per Variant</label>
                  <input
                    type="number"
                    value={newProduct.initialStock}
                    onChange={(e) => setNewProduct({ ...newProduct, initialStock: Number(e.target.value) })}
                    className="w-full bg-[#1c1c1c] border border-white/15 px-3 py-2 text-white rounded-xs"
                  />
                </div>

                <div>
                  <label className="block text-white/70 mb-1">Product Image URL</label>
                  <input
                    type="text"
                    value={newProduct.image_url}
                    onChange={(e) => setNewProduct({ ...newProduct, image_url: e.target.value })}
                    className="w-full bg-[#1c1c1c] border border-white/15 px-3 py-2 text-white rounded-xs"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-4 pt-2">
                <label className="flex items-center space-x-2 text-white/80 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newProduct.featured}
                    onChange={(e) => setNewProduct({ ...newProduct, featured: e.target.checked })}
                  />
                  <span>Featured Drop</span>
                </label>
                <label className="flex items-center space-x-2 text-white/80 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newProduct.is_limited_edition}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, is_limited_edition: e.target.checked })
                    }
                  />
                  <span>Limited Edition</span>
                </label>
              </div>

              <div className="pt-4 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 bg-white/10 text-white rounded-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-white text-black font-bold uppercase rounded-xs"
                >
                  Save Garment to Catalogue
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
