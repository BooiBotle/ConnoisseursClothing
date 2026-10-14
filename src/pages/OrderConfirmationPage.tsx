import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import {
  CheckCircle2,
  Clock,
  Package,
  Truck,
  ShieldCheck,
  Printer,
  ArrowRight,
  MapPin,
  Mail,
  Phone,
  AlertCircle
} from 'lucide-react';
import { Order, OrderStatus } from '../types';
import { dbService } from '../services/db';
import { formatZAR, formatDate } from '../utils/formatters';
import { BANKING_DETAILS } from '../services/payment';

export const OrderConfirmationPage: React.FC = () => {
  const { orderNumber } = useParams<{ orderNumber: string }>();
  const [searchParams] = useSearchParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  const txnParam = searchParams.get('txn');
  const statusParam = searchParams.get('status');

  useEffect(() => {
    if (!orderNumber) return;
    setLoading(true);

    dbService.getOrderByNumber(orderNumber).then((found) => {
      setOrder(found);
      setLoading(false);
    });
  }, [orderNumber]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="text-white/40 font-mono text-xs uppercase tracking-widest animate-pulse">
          Retrieving Order Invoice...
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-[#050505] py-24 text-center px-4">
        <div className="max-w-md mx-auto">
          <AlertCircle className="w-12 h-12 text-rose-400 mx-auto mb-4" />
          <h2 className="font-display text-3xl uppercase tracking-wider text-white mb-2">
            ORDER NOT FOUND
          </h2>
          <p className="text-xs text-white/50 mb-8 font-sans">
            We could not find an order matching reference &ldquo;{orderNumber}&rdquo;. Please verify the order number in your confirmation email.
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

  const isPaid = order.payment_status === 'completed' || order.order_status === 'Paid';
  const isEftPending = order.payment_method === 'manual_eft' && order.order_status === 'Pending Payment';

  // Status progression steps
  const steps: { label: string; statusKey: OrderStatus }[] = [
    { label: 'Order Placed', statusKey: 'Pending Payment' },
    { label: 'Payment Confirmed', statusKey: 'Paid' },
    { label: 'In Production / Packaged', statusKey: 'Processing' },
    { label: 'Out for Courier Delivery', statusKey: 'Shipped' },
    { label: 'Delivered', statusKey: 'Completed' }
  ];

  const getStepIndex = (status: OrderStatus) => {
    switch (status) {
      case 'Pending Payment':
        return 0;
      case 'Paid':
        return 1;
      case 'Processing':
        return 2;
      case 'Shipped':
        return 3;
      case 'Completed':
        return 4;
      default:
        return 1;
    }
  };

  const currentStep = getStepIndex(order.order_status);

  return (
    <div className="min-h-screen bg-[#050505] text-[#F5F2EC] py-12 sm:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Status Notification Banner */}
        <div className="bg-[#121212] border border-white/10 rounded-xs p-8 text-center space-y-4 mb-10 shadow-2xl">
          <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 mx-auto flex items-center justify-center text-emerald-400">
            {isPaid ? <CheckCircle2 className="w-8 h-8" /> : <Clock className="w-8 h-8 text-amber-400" />}
          </div>

          <div className="space-y-1">
            <span className="text-[11px] font-mono uppercase tracking-[0.25em] text-[#777777]">
              OFFICIAL CONNOISSEURS ORDER RECEIPT
            </span>
            <h1 className="font-display text-3xl sm:text-4xl text-white uppercase tracking-wider font-extrabold">
              {isPaid
                ? 'THANK YOU FOR YOUR ORDER'
                : isEftPending
                ? 'ORDER RESERVED — PENDING BANK TRANSFER'
                : 'ORDER REGISTERED'}
            </h1>
            <p className="text-xs sm:text-sm text-neutral-300 font-mono">
              Order Reference: <strong className="text-white text-base">{order.order_number}</strong>
            </p>
          </div>

          <p className="text-xs text-white/60 max-w-lg mx-auto font-sans leading-relaxed">
            {isPaid
              ? `A confirmation email has been dispatched to ${order.customer.email}. Your merchandise has been registered for packaging and courier pickup.`
              : `Your items have been temporarily held. Please complete the bank transfer using your order number as the reference to finalize dispatch.`}
          </p>

          {txnParam && (
            <div className="inline-block px-3 py-1 rounded bg-white/5 border border-white/10 text-[11px] font-mono text-emerald-300">
              Gateway Transaction ID: {txnParam}
            </div>
          )}

          {/* Action buttons */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-mono uppercase rounded-xs transition-colors flex items-center space-x-2"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Tax Invoice</span>
            </button>
            <Link
              to="/account"
              className="px-4 py-2 bg-white text-black text-xs font-mono uppercase font-bold rounded-xs hover:bg-neutral-200 transition-colors"
            >
              Track in Customer Portal
            </Link>
          </div>
        </div>

        {/* Order Status Stepper */}
        <div className="bg-[#121212] border border-white/10 rounded-xs p-6 mb-10">
          <h3 className="font-display text-sm uppercase tracking-wider text-white font-bold mb-6">
            CURRENT ORDER STATUS: <span className="text-emerald-400">{order.order_status.toUpperCase()}</span>
          </h3>

          <div className="relative flex flex-col sm:flex-row justify-between gap-4">
            {steps.map((st, i) => {
              const isComplete = i <= currentStep;
              const isCurrent = i === currentStep;
              return (
                <div key={st.label} className="flex-1 flex sm:flex-col items-center sm:text-center gap-3 relative">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-mono text-xs font-bold transition-colors ${
                      isComplete
                        ? 'bg-emerald-400 text-black'
                        : 'bg-white/10 text-white/40 border border-white/15'
                    } ${isCurrent ? 'ring-2 ring-emerald-400/50' : ''}`}
                  >
                    {i + 1}
                  </div>
                  <span
                    className={`text-[11px] uppercase font-mono tracking-wider ${
                      isComplete ? 'text-white font-bold' : 'text-white/40'
                    }`}
                  >
                    {st.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Direct Bank Transfer Details if Manual EFT */}
        {isEftPending && (
          <div className="bg-[#181818] border border-amber-500/30 rounded-xs p-6 mb-10 space-y-3 font-mono text-xs">
            <h4 className="text-amber-300 font-bold uppercase text-sm">
              PLEASE COMPLETE YOUR BANK TRANSFER:
            </h4>
            <p className="text-white/70">
              Transfer exactly <strong>{formatZAR(order.final_total)}</strong> to our account below:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 bg-black/40 p-4 rounded text-white/80">
              <div>Bank: <strong>{BANKING_DETAILS.bankName}</strong></div>
              <div>Account Name: <strong>{BANKING_DETAILS.accountName}</strong></div>
              <div>Account Number: <strong>{BANKING_DETAILS.accountNumber}</strong></div>
              <div>Branch Code: <strong>{BANKING_DETAILS.branchCode}</strong></div>
              <div className="sm:col-span-2 text-amber-300 pt-1">
                Reference: <strong>{order.order_number}</strong>
              </div>
            </div>
            <p className="text-[11px] text-white/50">
              Email proof of payment to payments@theconnoisseurs.co.za to expedite processing.
            </p>
          </div>
        )}

        {/* Invoice Breakdown Details */}
        <div className="bg-[#121212] border border-white/10 rounded-xs p-6 sm:p-8 space-y-8 shadow-2xl">
          {/* Header Metadata */}
          <div className="flex flex-col sm:flex-row justify-between pb-6 border-b border-white/10 gap-4">
            <div>
              <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest block">
                ORDER NUMBER
              </span>
              <span className="font-mono text-lg font-bold text-white">{order.order_number}</span>
              <div className="text-xs text-white/50 font-mono mt-0.5">
                Placed on: {formatDate(order.created_at)}
              </div>
            </div>

            <div className="sm:text-right">
              <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest block">
                PAYMENT STATUS
              </span>
              <span
                className={`font-mono text-sm font-bold uppercase ${
                  isPaid ? 'text-emerald-400' : 'text-amber-400'
                }`}
              >
                {order.payment_status.toUpperCase()} ({order.payment_method.toUpperCase()})
              </span>
            </div>
          </div>

          {/* Delivery & Customer Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pb-6 border-b border-white/10 text-xs">
            <div className="space-y-2">
              <span className="text-[11px] font-mono uppercase tracking-wider text-white/50 block font-bold">
                CUSTOMER DETAILS
              </span>
              <p className="text-white font-medium">{order.customer.full_name}</p>
              <div className="flex items-center space-x-2 text-white/60">
                <Mail className="w-3.5 h-3.5" />
                <span>{order.customer.email}</span>
              </div>
              <div className="flex items-center space-x-2 text-white/60">
                <Phone className="w-3.5 h-3.5" />
                <span>{order.customer.phone}</span>
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-[11px] font-mono uppercase tracking-wider text-white/50 block font-bold">
                DELIVERY DESTINATION
              </span>
              <div className="text-white/80 leading-relaxed font-sans">
                <p>{order.shipping_address.address_line1}</p>
                {order.shipping_address.address_line2 && (
                  <p>{order.shipping_address.address_line2}</p>
                )}
                <p>
                  {order.shipping_address.suburb}, {order.shipping_address.city}
                </p>
                <p>
                  {order.shipping_address.province}, {order.shipping_address.postal_code}
                </p>
                <p className="text-[11px] text-white/40 font-mono mt-1">
                  Courier: {order.shipping_method}
                </p>
              </div>
            </div>
          </div>

          {/* Ordered Line Items Table */}
          <div className="space-y-4">
            <span className="text-[11px] font-mono uppercase tracking-wider text-white/50 block font-bold">
              ORDERED MERCHANDISE ({order.items.length})
            </span>

            <div className="divide-y divide-white/5">
              {order.items.map((item) => (
                <div key={item.id} className="py-3 flex items-center justify-between text-xs">
                  <div>
                    <h4 className="font-semibold text-white uppercase">{item.product_name_snapshot}</h4>
                    <span className="text-[11px] font-mono text-white/50">
                      Size: {item.size} • {item.colour} • Qty: {item.quantity}
                    </span>
                  </div>
                  <div className="font-mono font-bold text-white">
                    {formatZAR(item.line_total)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pricing Summary */}
          <div className="border-t border-white/10 pt-4 space-y-2 text-xs font-mono max-w-xs ml-auto">
            <div className="flex justify-between text-white/70">
              <span>Subtotal:</span>
              <span className="text-white">{formatZAR(order.subtotal)}</span>
            </div>
            {order.discount_amount > 0 && (
              <div className="flex justify-between text-emerald-400">
                <span>Discount:</span>
                <span>-{formatZAR(order.discount_amount)}</span>
              </div>
            )}
            <div className="flex justify-between text-white/70">
              <span>Delivery Fee:</span>
              <span className="text-white">
                {order.shipping_fee === 0 ? 'FREE' : formatZAR(order.shipping_fee)}
              </span>
            </div>
            <div className="flex justify-between text-white text-base font-bold pt-2 border-t border-white/10">
              <span>Total Paid:</span>
              <span>{formatZAR(order.final_total)}</span>
            </div>
          </div>
        </div>

        {/* Back Link */}
        <div className="mt-8 text-center">
          <Link
            to="/shop"
            className="text-xs font-mono uppercase tracking-widest text-white/60 hover:text-white underline underline-offset-4"
          >
            &larr; Return to Online Store
          </Link>
        </div>
      </div>
    </div>
  );
};
