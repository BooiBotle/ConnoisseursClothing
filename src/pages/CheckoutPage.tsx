import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ShieldCheck,
  Truck,
  CreditCard,
  Building,
  Lock,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  Info
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { dbService } from '../services/db';
import { formatZAR } from '../utils/formatters';
import {
  PAYMENT_GATEWAYS,
  PAYFAST_CONFIG,
  YOCO_CONFIG,
  BANKING_DETAILS,
  paymentService
} from '../services/payment';
import { SA_PROVINCES, SHIPPING_OPTIONS } from '../services/shipping';
import { CustomerInfo, Order, ShippingAddress } from '../types';

export const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    cart,
    subtotal,
    discountAmount,
    shippingFee,
    finalTotal,
    selectedShippingId,
    setSelectedShippingId,
    clearCart
  } = useCart();

  // Customer state
  const [customer, setCustomer] = useState<CustomerInfo>({
    full_name: '',
    email: '',
    phone: ''
  });

  // Shipping address state
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    address_line1: '',
    address_line2: '',
    suburb: '',
    city: '',
    province: 'Gauteng',
    postal_code: '',
    country: 'South Africa',
    delivery_instructions: ''
  });

  // Payment gateway selection
  const [selectedGateway, setSelectedGateway] = useState<'payfast' | 'yoco' | 'eft_instant' | 'manual_eft'>('payfast');

  // Processing state
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-[#050505] text-[#F5F2EC] py-24 flex items-center justify-center px-4">
        <div className="max-w-md text-center">
          <h2 className="font-display text-3xl uppercase tracking-wider text-white mb-3">
            NO ITEMS TO CHECK OUT
          </h2>
          <p className="text-xs text-white/50 mb-6">
            Your bag is currently empty. Please add items to your cart before proceeding to checkout.
          </p>
          <Link
            to="/shop"
            className="px-6 py-3 bg-white text-black font-display text-sm uppercase tracking-widest font-bold"
          >
            RETURN TO SHOP
          </Link>
        </div>
      </div>
    );
  }

  const validateForm = (): boolean => {
    if (!customer.full_name.trim()) {
      setErrorMsg('Please enter your full name.');
      return false;
    }
    if (!customer.email.trim() || !customer.email.includes('@')) {
      setErrorMsg('Please enter a valid email address for order notifications.');
      return false;
    }
    if (!customer.phone.trim() || customer.phone.length < 9) {
      setErrorMsg('Please enter a valid South African contact number for courier delivery.');
      return false;
    }
    if (!shippingAddress.address_line1.trim()) {
      setErrorMsg('Please enter your delivery street address.');
      return false;
    }
    if (!shippingAddress.suburb.trim()) {
      setErrorMsg('Please enter your suburb or area.');
      return false;
    }
    if (!shippingAddress.city.trim()) {
      setErrorMsg('Please enter your city or town.');
      return false;
    }
    if (!shippingAddress.postal_code.trim()) {
      setErrorMsg('Please enter your 4-digit postal code.');
      return false;
    }
    setErrorMsg(null);
    return true;
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsProcessing(true);
    setErrorMsg(null);

    try {
      const selectedShipping = SHIPPING_OPTIONS.find((s) => s.id === selectedShippingId) || SHIPPING_OPTIONS[0];

      // Prepare order record
      const orderPayload: Omit<Order, 'id' | 'order_number' | 'created_at' | 'updated_at'> = {
        customer,
        shipping_address: shippingAddress,
        shipping_method: selectedShipping.name,
        subtotal,
        shipping_fee: shippingFee,
        discount_amount: discountAmount,
        final_total: finalTotal,
        payment_method: selectedGateway,
        payment_status: selectedGateway === 'manual_eft' ? 'pending' : 'pending',
        order_status: selectedGateway === 'manual_eft' ? 'Pending Payment' : 'Pending Payment',
        items: cart.map((item) => ({
          id: `item-${Date.now()}-${item.variant_id}`,
          order_id: '',
          product_id: item.product_id,
          product_name_snapshot: item.product_name,
          variant_id: item.variant_id,
          sku_snapshot: item.sku,
          size: item.size,
          colour: item.colour,
          quantity: item.quantity,
          unit_price: item.unit_price,
          line_total: item.unit_price * item.quantity
        }))
      };

      // 1. Create order in Database service (persists locally and to Supabase if keys provided)
      const newOrder = await dbService.createOrder(orderPayload);

      // 2. Handle Payment Gateway Processing
      if (selectedGateway === 'manual_eft') {
        // Direct EFT remains Pending Payment until store owner verifies bank deposit
        clearCart();
        setIsProcessing(false);
        navigate(`/order-confirmation/${newOrder.order_number}?status=pending_eft`);
        return;
      }

      // For PayFast / Yoco / Instant EFT
      // Simulate/trigger verified secure sandbox transaction
      const payResult = await paymentService.processSimulatedPayment(
        newOrder,
        selectedGateway === 'eft_instant' ? 'eft_instant' : selectedGateway
      );

      if (payResult.success) {
        // Update order status idempotently on backend
        await dbService.updateOrderStatus(newOrder.id, 'Paid', 'completed');
        clearCart();
        setIsProcessing(false);
        navigate(`/order-confirmation/${newOrder.order_number}?status=paid&txn=${payResult.transactionId}`);
      } else {
        setIsProcessing(false);
        setErrorMsg('Payment verification was not completed. Please try again.');
      }
    } catch (err: any) {
      setIsProcessing(false);
      setErrorMsg(err?.message || 'An unexpected error occurred during checkout.');
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-[#F5F2EC] py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Checkout Header */}
        <div className="border-b border-white/10 pb-6 mb-10 flex items-center justify-between">
          <div>
            <span className="text-[11px] uppercase tracking-[0.25em] text-[#777777] font-mono block mb-1">
              ENCRYPTED 256-BIT SECURE CHECKOUT
            </span>
            <h1 className="font-display text-3xl sm:text-4xl text-white uppercase tracking-wider font-extrabold">
              COMPLETE YOUR MERCHANDISE ORDER
            </h1>
          </div>
          <div className="hidden sm:flex items-center space-x-2 text-xs font-mono text-emerald-400">
            <Lock className="w-4 h-4" />
            <span>SSL Secured</span>
          </div>
        </div>

        {errorMsg && (
          <div className="mb-8 p-4 bg-rose-950/80 border border-rose-500/50 rounded-xs text-xs font-mono text-rose-300 flex items-center space-x-2 animate-in fade-in">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmitOrder}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            {/* Left Column: Form Fields (7 cols) */}
            <div className="lg:col-span-7 space-y-8">
              {/* Section 1: Customer Contact Information */}
              <div className="bg-[#121212] border border-white/10 rounded-xs p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <h2 className="font-display text-lg uppercase tracking-wider text-white font-bold">
                    1. CUSTOMER INFORMATION
                  </h2>
                  <span className="text-[11px] font-mono text-white/40">Guest Checkout Supported</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-xs uppercase font-mono text-white/70 mb-1.5">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={customer.full_name}
                      onChange={(e) => setCustomer({ ...customer, full_name: e.target.value })}
                      placeholder="e.g. Sibusiso Mokoena"
                      className="w-full bg-[#181818] border border-white/15 px-3 py-2.5 text-xs text-white rounded-xs focus:outline-none focus:border-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase font-mono text-white/70 mb-1.5">
                      Email Address * (For Order Tracking)
                    </label>
                    <input
                      type="email"
                      required
                      value={customer.email}
                      onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
                      placeholder="sibusiso@example.co.za"
                      className="w-full bg-[#181818] border border-white/15 px-3 py-2.5 text-xs text-white rounded-xs focus:outline-none focus:border-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase font-mono text-white/70 mb-1.5">
                      Phone Number * (For Courier SMS Updates)
                    </label>
                    <input
                      type="tel"
                      required
                      value={customer.phone}
                      onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                      placeholder="082 123 4567"
                      className="w-full bg-[#181818] border border-white/15 px-3 py-2.5 text-xs text-white rounded-xs focus:outline-none focus:border-white"
                    />
                  </div>
                </div>
              </div>

              {/* Section 2: South African Delivery Address */}
              <div className="bg-[#121212] border border-white/10 rounded-xs p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <h2 className="font-display text-lg uppercase tracking-wider text-white font-bold">
                    2. SOUTH AFRICAN DELIVERY ADDRESS
                  </h2>
                  <span className="text-[11px] font-mono text-white/40">Nationwide Door-to-Door</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-xs uppercase font-mono text-white/70 mb-1.5">
                      Street Address *
                    </label>
                    <input
                      type="text"
                      required
                      value={shippingAddress.address_line1}
                      onChange={(e) =>
                        setShippingAddress({ ...shippingAddress, address_line1: e.target.value })
                      }
                      placeholder="e.g. 42 Vilakazi Street or 15 Bree Street"
                      className="w-full bg-[#181818] border border-white/15 px-3 py-2.5 text-xs text-white rounded-xs focus:outline-none focus:border-white"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs uppercase font-mono text-white/70 mb-1.5">
                      Apartment, Suite, Unit, Complex (Optional)
                    </label>
                    <input
                      type="text"
                      value={shippingAddress.address_line2}
                      onChange={(e) =>
                        setShippingAddress({ ...shippingAddress, address_line2: e.target.value })
                      }
                      placeholder="Unit 14, The Lofts"
                      className="w-full bg-[#181818] border border-white/15 px-3 py-2.5 text-xs text-white rounded-xs focus:outline-none focus:border-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase font-mono text-white/70 mb-1.5">
                      Suburb / Area *
                    </label>
                    <input
                      type="text"
                      required
                      value={shippingAddress.suburb}
                      onChange={(e) =>
                        setShippingAddress({ ...shippingAddress, suburb: e.target.value })
                      }
                      placeholder="e.g. Rosebank / Green Point"
                      className="w-full bg-[#181818] border border-white/15 px-3 py-2.5 text-xs text-white rounded-xs focus:outline-none focus:border-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase font-mono text-white/70 mb-1.5">
                      City / Town *
                    </label>
                    <input
                      type="text"
                      required
                      value={shippingAddress.city}
                      onChange={(e) =>
                        setShippingAddress({ ...shippingAddress, city: e.target.value })
                      }
                      placeholder="e.g. Johannesburg / Cape Town / Durban"
                      className="w-full bg-[#181818] border border-white/15 px-3 py-2.5 text-xs text-white rounded-xs focus:outline-none focus:border-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase font-mono text-white/70 mb-1.5">
                      Province *
                    </label>
                    <select
                      value={shippingAddress.province}
                      onChange={(e) =>
                        setShippingAddress({
                          ...shippingAddress,
                          province: e.target.value as ShippingAddress['province']
                        })
                      }
                      className="w-full bg-[#181818] border border-white/15 px-3 py-2.5 text-xs text-white rounded-xs focus:outline-none focus:border-white"
                    >
                      {SA_PROVINCES.map((prov) => (
                        <option key={prov} value={prov}>
                          {prov}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs uppercase font-mono text-white/70 mb-1.5">
                      Postal Code *
                    </label>
                    <input
                      type="text"
                      required
                      value={shippingAddress.postal_code}
                      onChange={(e) =>
                        setShippingAddress({ ...shippingAddress, postal_code: e.target.value })
                      }
                      placeholder="e.g. 2196 or 8001"
                      className="w-full bg-[#181818] border border-white/15 px-3 py-2.5 text-xs text-white rounded-xs focus:outline-none focus:border-white"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs uppercase font-mono text-white/70 mb-1.5">
                      Delivery Instructions for Courier Driver (Optional)
                    </label>
                    <textarea
                      rows={2}
                      value={shippingAddress.delivery_instructions}
                      onChange={(e) =>
                        setShippingAddress({
                          ...shippingAddress,
                          delivery_instructions: e.target.value
                        })
                      }
                      placeholder="e.g. Leave at security gate, call on arrival..."
                      className="w-full bg-[#181818] border border-white/15 px-3 py-2 text-xs text-white rounded-xs focus:outline-none focus:border-white"
                    />
                  </div>
                </div>
              </div>

              {/* Section 3: Delivery Courier Choice */}
              <div className="bg-[#121212] border border-white/10 rounded-xs p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <h2 className="font-display text-lg uppercase tracking-wider text-white font-bold">
                    3. SELECT DELIVERY COURIER
                  </h2>
                </div>

                <div className="space-y-3">
                  {SHIPPING_OPTIONS.map((opt) => (
                    <label
                      key={opt.id}
                      className={`flex items-start justify-between p-3.5 rounded-xs border text-xs cursor-pointer transition-colors ${
                        selectedShippingId === opt.id
                          ? 'bg-white/10 border-white text-white'
                          : 'bg-white/2 border-white/10 text-neutral-400 hover:border-white/30'
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <input
                          type="radio"
                          name="shipping_method_checkout"
                          checked={selectedShippingId === opt.id}
                          onChange={() => setSelectedShippingId(opt.id)}
                          className="mt-1 text-white bg-transparent focus:ring-0"
                        />
                        <div>
                          <div className="font-bold text-white text-sm">{opt.name}</div>
                          <div className="text-white/60 text-xs mt-0.5">{opt.description}</div>
                          <div className="text-[11px] font-mono text-white/40 mt-1">
                            Estimated: {opt.estimated_days}
                          </div>
                        </div>
                      </div>
                      <div className="font-mono text-sm font-bold text-white text-right">
                        {opt.free_threshold && subtotal >= opt.free_threshold ? (
                          <span className="text-emerald-400">FREE</span>
                        ) : (
                          formatZAR(opt.price)
                        )}
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Section 4: South African Payment Gateway */}
              <div className="bg-[#121212] border border-white/10 rounded-xs p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <h2 className="font-display text-lg uppercase tracking-wider text-white font-bold">
                    4. PAYMENT METHOD
                  </h2>
                  <span className="text-[11px] font-mono text-emerald-400 flex items-center space-x-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>3D-Secure SA Banking</span>
                  </span>
                </div>

                <div className="space-y-3">
                  {PAYMENT_GATEWAYS.map((gateway) => (
                    <div
                      key={gateway.provider}
                      className={`p-4 rounded-xs border transition-colors ${
                        selectedGateway === gateway.provider
                          ? 'bg-white/10 border-white'
                          : 'bg-white/2 border-white/10 hover:border-white/20'
                      }`}
                    >
                      <label className="flex items-start justify-between cursor-pointer">
                        <div className="flex items-start space-x-3">
                          <input
                            type="radio"
                            name="payment_gateway"
                            checked={selectedGateway === gateway.provider}
                            onChange={() => setSelectedGateway(gateway.provider)}
                            className="mt-1 text-white bg-transparent focus:ring-0"
                          />
                          <div>
                            <div className="flex items-center space-x-2">
                              <span className="font-bold text-white text-sm">{gateway.name}</span>
                              {gateway.isSandbox && (
                                <span className="px-1.5 py-0.5 text-[9px] font-mono uppercase bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded">
                                  TEST SANDBOX
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-white/60 mt-1 leading-relaxed">
                              {gateway.description}
                            </p>
                          </div>
                        </div>
                      </label>

                      {/* Expandable Gateway Info */}
                      {selectedGateway === gateway.provider && gateway.provider === 'payfast' && (
                        <div className="mt-3 pt-3 border-t border-white/10 text-[11px] font-mono text-white/70 space-y-1 bg-black/40 p-3 rounded">
                          <div className="flex items-center space-x-1.5 text-amber-300 mb-1">
                            <Info className="w-3.5 h-3.5" />
                            <span>PayFast Sandbox Integration Active</span>
                          </div>
                          <p>Merchant ID: {PAYFAST_CONFIG.merchantId}</p>
                          <p>Supported: Capitec Pay, FNB, Standard Bank, Absa, Nedbank &amp; Cards.</p>
                        </div>
                      )}

                      {selectedGateway === gateway.provider && gateway.provider === 'yoco' && (
                        <div className="mt-3 pt-3 border-t border-white/10 text-[11px] font-mono text-white/70 space-y-1 bg-black/40 p-3 rounded">
                          <div className="flex items-center space-x-1.5 text-emerald-300 mb-1">
                            <CreditCard className="w-3.5 h-3.5" />
                            <span>Yoco Card Processing (Visa &amp; Mastercard)</span>
                          </div>
                          <p>Public Key: {YOCO_CONFIG.publicKey.substring(0, 16)}...</p>
                          <p>Protected by South African 3D Secure OTP verification.</p>
                        </div>
                      )}

                      {selectedGateway === gateway.provider && gateway.provider === 'manual_eft' && (
                        <div className="mt-3 pt-3 border-t border-white/10 text-xs text-white/80 space-y-2 bg-black/40 p-4 rounded font-mono">
                          <div className="flex items-center space-x-1.5 text-white font-bold">
                            <Building className="w-4 h-4 text-white/70" />
                            <span>Official Banking Details:</span>
                          </div>
                          <div className="grid grid-cols-2 gap-1 text-[11px] text-white/70 pt-1">
                            <span>Bank:</span>
                            <span className="text-white">{BANKING_DETAILS.bankName}</span>
                            <span>Account Name:</span>
                            <span className="text-white">{BANKING_DETAILS.accountName}</span>
                            <span>Account Number:</span>
                            <span className="text-white">{BANKING_DETAILS.accountNumber}</span>
                            <span>Branch Code:</span>
                            <span className="text-white">{BANKING_DETAILS.branchCode}</span>
                          </div>
                          <p className="text-[10px] text-amber-300/80 pt-1">
                            * {BANKING_DETAILS.referenceGuide}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Order Summary & Confirmation (5 cols) */}
            <div className="lg:col-span-5">
              <div className="sticky top-24 bg-[#121212] border border-white/10 rounded-xs p-6 space-y-6 shadow-2xl">
                <h2 className="font-display tracking-widest text-xl uppercase font-bold text-white border-b border-white/10 pb-3">
                  ORDER OVERVIEW ({cart.length} ITEMS)
                </h2>

                {/* Items Mini List */}
                <div className="max-h-64 overflow-y-auto divide-y divide-white/5 pr-1">
                  {cart.map((item) => (
                    <div key={item.id} className="py-3 flex items-center space-x-3">
                      <img
                        src={item.image_url}
                        alt=""
                        className="w-12 h-14 object-cover rounded-xs bg-[#181818] flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-semibold text-white uppercase truncate">
                          {item.product_name}
                        </h4>
                        <div className="text-[11px] font-mono text-white/50">
                          Qty: {item.quantity} • Size: {item.size} • {item.colour}
                        </div>
                      </div>
                      <div className="text-xs font-mono font-bold text-white">
                        {formatZAR(item.unit_price * item.quantity)}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Financial Summary */}
                <div className="space-y-2 pt-4 border-t border-white/10 text-xs">
                  <div className="flex justify-between text-white/70">
                    <span>Merchandise Subtotal</span>
                    <span className="font-mono text-white">{formatZAR(subtotal)}</span>
                  </div>

                  {discountAmount > 0 && (
                    <div className="flex justify-between text-emerald-400">
                      <span>Discount Applied</span>
                      <span className="font-mono">-{formatZAR(discountAmount)}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-white/70">
                    <span>Shipping Fee</span>
                    <span className="font-mono text-white">
                      {shippingFee === 0 ? <strong className="text-emerald-400">FREE</strong> : formatZAR(shippingFee)}
                    </span>
                  </div>

                  <div className="flex justify-between text-white text-lg font-bold pt-3 border-t border-white/10">
                    <span>Total Amount Payable</span>
                    <span className="font-mono text-xl">{formatZAR(finalTotal)}</span>
                  </div>
                  <div className="text-[10px] text-white/40 font-mono">
                    Includes 15% South African VAT.
                  </div>
                </div>

                {/* Submit Action */}
                <div className="space-y-3 pt-2">
                  <button
                    type="submit"
                    disabled={isProcessing}
                    className="w-full py-4 bg-white text-black font-display tracking-widest text-lg font-bold uppercase hover:bg-neutral-200 transition-all hover-lift rounded-xs flex items-center justify-center space-x-2 disabled:opacity-40"
                  >
                    {isProcessing ? (
                      <span className="animate-pulse">AUTHORIZING PAYMENT...</span>
                    ) : (
                      <>
                        <span>AUTHORIZE &amp; PLACE ORDER</span>
                        <ArrowRight className="w-5 h-5" />
                      </>
                    )}
                  </button>

                  <div className="flex items-center justify-center space-x-2 text-[10px] text-white/40 font-mono pt-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>No card details stored on our servers.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
