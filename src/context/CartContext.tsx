import React, { createContext, useContext, useEffect, useState } from 'react';
import { CartItem, Product, ProductVariant } from '../types';
import { calculateShippingFee, FREE_SHIPPING_THRESHOLD, SHIPPING_OPTIONS } from '../services/shipping';

interface PromoCode {
  code: string;
  discountPercentage: number;
  description: string;
}

const AVAILABLE_PROMOS: Record<string, PromoCode> = {
  CONNOISSEUR10: {
    code: 'CONNOISSEUR10',
    discountPercentage: 10,
    description: '10% off for verified Connoisseurs'
  },
  VINTAGE15: {
    code: 'VINTAGE15',
    discountPercentage: 15,
    description: '15% off limited vintage drop'
  }
};

interface CartContextType {
  cart: CartItem[];
  isDrawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
  addToCart: (product: Product, variant: ProductVariant, quantity?: number) => { success: boolean; message: string };
  removeFromCart: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, newQuantity: number) => void;
  clearCart: () => void;
  totalItemsCount: number;
  subtotal: number;
  discountAmount: number;
  activePromo: PromoCode | null;
  applyPromoCode: (code: string) => { success: boolean; message: string };
  removePromoCode: () => void;
  selectedShippingId: string;
  setSelectedShippingId: (id: string) => void;
  shippingFee: number;
  finalTotal: number;
  freeShippingRemaining: number;
  freeShippingProgress: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'tcs_cart_items_v1';
const PROMO_STORAGE_KEY = 'tcs_active_promo_v1';

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedShippingId, setSelectedShippingId] = useState<string>(SHIPPING_OPTIONS[0].id);

  const [activePromo, setActivePromo] = useState<PromoCode | null>(() => {
    try {
      const stored = localStorage.getItem(PROMO_STORAGE_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch (e) {
      console.error('Failed to save cart to localStorage', e);
    }
  }, [cart]);

  useEffect(() => {
    try {
      if (activePromo) {
        localStorage.setItem(PROMO_STORAGE_KEY, JSON.stringify(activePromo));
      } else {
        localStorage.removeItem(PROMO_STORAGE_KEY);
      }
    } catch (e) {
      console.error('Failed to save promo', e);
    }
  }, [activePromo]);

  const openDrawer = () => setIsDrawerOpen(true);
  const closeDrawer = () => setIsDrawerOpen(false);

  const addToCart = (
    product: Product,
    variant: ProductVariant,
    quantity = 1
  ): { success: boolean; message: string } => {
    if (variant.available_stock <= 0) {
      return { success: false, message: 'This variant is currently sold out.' };
    }

    const cartItemId = `${product.id}-${variant.id}`;
    const effectivePrice = variant.price_override ?? product.sale_price ?? product.base_price;
    const heroImage = product.images[0]?.image_url || '/products/hoodie_vintage_black_front.jpg';

    let itemAddedSuccessfully = false;
    let message = '';

    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex((item) => item.id === cartItemId);

      if (existingIndex > -1) {
        const currentQty = prevCart[existingIndex].quantity;
        const requestedTotal = currentQty + quantity;

        if (requestedTotal > variant.available_stock) {
          message = `Cannot add more. Maximum available stock is ${variant.available_stock}.`;
          itemAddedSuccessfully = false;
          return prevCart;
        }

        const updated = [...prevCart];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: requestedTotal
        };
        itemAddedSuccessfully = true;
        message = `Updated quantity for ${product.name} (${variant.size}).`;
        return updated;
      } else {
        if (quantity > variant.available_stock) {
          message = `Cannot add. Maximum available stock is ${variant.available_stock}.`;
          itemAddedSuccessfully = false;
          return prevCart;
        }

        const newItem: CartItem = {
          id: cartItemId,
          product_id: product.id,
          variant_id: variant.id,
          product_name: product.name,
          product_slug: product.slug,
          image_url: heroImage,
          size: variant.size,
          colour: variant.colour,
          unit_price: effectivePrice,
          quantity: quantity,
          max_stock: variant.available_stock,
          sku: variant.sku
        };

        itemAddedSuccessfully = true;
        message = `Added ${product.name} (${variant.size}) to your bag.`;
        return [...prevCart, newItem];
      }
    });

    if (itemAddedSuccessfully) {
      setIsDrawerOpen(true);
    }

    return { success: itemAddedSuccessfully, message: message || 'Added to bag.' };
  };

  const removeFromCart = (cartItemId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== cartItemId));
  };

  const updateQuantity = (cartItemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }

    setCart((prev) =>
      prev.map((item) => {
        if (item.id === cartItemId) {
          const clamped = Math.min(newQuantity, item.max_stock);
          return { ...item, quantity: clamped };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setCart([]);
    setActivePromo(null);
  };

  const applyPromoCode = (code: string) => {
    const clean = code.trim().toUpperCase();
    const found = AVAILABLE_PROMOS[clean];
    if (found) {
      setActivePromo(found);
      return { success: true, message: `Promo applied: ${found.description}` };
    }
    return { success: false, message: 'Invalid discount code.' };
  };

  const removePromoCode = () => {
    setActivePromo(null);
  };

  // Calculations
  const totalItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce((sum, item) => sum + item.unit_price * item.quantity, 0);

  const discountAmount = activePromo
    ? Math.round((subtotal * activePromo.discountPercentage) / 100)
    : 0;

  const discountedSubtotal = Math.max(0, subtotal - discountAmount);

  const shippingFee = cart.length === 0 ? 0 : calculateShippingFee(selectedShippingId, discountedSubtotal);
  const finalTotal = discountedSubtotal + shippingFee;

  const freeShippingRemaining = Math.max(0, FREE_SHIPPING_THRESHOLD - discountedSubtotal);
  const freeShippingProgress = Math.min(100, Math.round((discountedSubtotal / FREE_SHIPPING_THRESHOLD) * 100));

  return (
    <CartContext.Provider
      value={{
        cart,
        isDrawerOpen,
        openDrawer,
        closeDrawer,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItemsCount,
        subtotal,
        discountAmount,
        activePromo,
        applyPromoCode,
        removePromoCode,
        selectedShippingId,
        setSelectedShippingId,
        shippingFee,
        finalTotal,
        freeShippingRemaining,
        freeShippingProgress
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
