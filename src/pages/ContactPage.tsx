import React, { useState } from 'react';
import { Mail, Clock, MapPin, Send, CheckCircle2, AlertCircle, MessageSquare } from 'lucide-react';
import { dbService } from '../services/db';

export const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'Order Enquiry',
    order_number: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusFeedback, setStatusFeedback] = useState<{ success: boolean; message: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setStatusFeedback({ success: false, message: 'Please complete all required fields.' });
      return;
    }

    setIsSubmitting(true);
    setStatusFeedback(null);

    const res = await dbService.submitContactInquiry(formData);
    setIsSubmitting(false);
    setStatusFeedback(res);

    if (res.success) {
      setFormData({
        name: '',
        email: '',
        subject: 'Order Enquiry',
        order_number: '',
        message: ''
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-[#F5F2EC] py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-3 mb-16 max-w-2xl mx-auto">
          <span className="text-[11px] uppercase tracking-[0.25em] text-[#777777] font-mono block">
            CLIENT CONCIERGE
          </span>
          <h1 className="font-display text-4xl sm:text-6xl uppercase tracking-wider text-white font-extrabold">
            CONTACT THE CONNOISSEURS
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 font-sans leading-relaxed">
            Have questions regarding upcoming merchandise drops, garment sizing, tracking your order, or wholesale inquiries? Send us an inquiry below.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Contact Details & Business Hours (5 cols) */}
          <div className="lg:col-span-5 space-y-8">
            <div className="bg-[#121212] border border-white/10 p-6 sm:p-8 rounded-xs space-y-6">
              <h3 className="font-display text-xl uppercase tracking-wider text-white font-bold border-b border-white/10 pb-3">
                CUSTOMER CARE CHANNELS
              </h3>

              <div className="space-y-4 text-xs font-mono">
                <div className="flex items-start space-x-3">
                  <Mail className="w-4 h-4 text-white/70 mt-0.5" />
                  <div>
                    <span className="text-white/40 block text-[10px] uppercase">Direct Email</span>
                    <span className="text-white font-bold">support@theconnoisseurs.co.za</span>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Clock className="w-4 h-4 text-white/70 mt-0.5" />
                  <div>
                    <span className="text-white/40 block text-[10px] uppercase">Operational Hours</span>
                    <span className="text-white">Monday – Friday: 09:00 – 17:00 (SAST)</span>
                    <span className="text-white/40 block text-[10px]">Excluding South African Public Holidays</span>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <MapPin className="w-4 h-4 text-white/70 mt-0.5" />
                  <div>
                    <span className="text-white/40 block text-[10px] uppercase">Dispatch Centre</span>
                    <span className="text-white">Cape Town &amp; Johannesburg Hubs</span>
                    <span className="text-white/40 block text-[10px]">Nationwide Door-to-Door Delivery</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick FAQ info */}
            <div className="bg-[#121212] border border-white/10 p-6 rounded-xs space-y-3 text-xs">
              <div className="flex items-center space-x-2 text-white font-bold uppercase font-mono">
                <MessageSquare className="w-4 h-4 text-white/70" />
                <span>FREQUENTLY ASKED QUESTIONS</span>
              </div>
              <div className="space-y-2 text-neutral-400 font-sans">
                <p>
                  <strong>How long does shipping take?</strong> Nationwide door-to-door courier takes 3–5 business days, and express takes 1–2 business days.
                </p>
                <p>
                  <strong>Can I exchange sizes?</strong> Yes, we provide 14-day exchanges for unworn items with tags intact.
                </p>
              </div>
            </div>
          </div>

          {/* Contact Inquiry Form (7 cols) */}
          <div className="lg:col-span-7">
            <div className="bg-[#121212] border border-white/10 p-6 sm:p-8 rounded-xs space-y-6 shadow-2xl">
              <h3 className="font-display text-xl uppercase tracking-wider text-white font-bold border-b border-white/10 pb-3">
                SEND AN OFFICIAL INQUIRY
              </h3>

              {statusFeedback && (
                <div
                  className={`p-4 rounded-xs text-xs font-mono flex items-center space-x-2 ${
                    statusFeedback.success
                      ? 'bg-emerald-950/80 border border-emerald-500/40 text-emerald-300'
                      : 'bg-rose-950/80 border border-rose-500/40 text-rose-300'
                  }`}
                >
                  {statusFeedback.success ? (
                    <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                  ) : (
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  )}
                  <span>{statusFeedback.message}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4 text-xs font-mono">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white/70 mb-1">Your Full Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Lerato Ndlovu"
                      className="w-full bg-[#181818] border border-white/15 px-3 py-2.5 text-white rounded-xs focus:outline-none focus:border-white"
                    />
                  </div>

                  <div>
                    <label className="block text-white/70 mb-1">Your Email Address *</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="lerato@example.co.za"
                      className="w-full bg-[#181818] border border-white/15 px-3 py-2.5 text-white rounded-xs focus:outline-none focus:border-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white/70 mb-1">Inquiry Subject</label>
                    <select
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full bg-[#181818] border border-white/15 px-3 py-2.5 text-white rounded-xs focus:outline-none focus:border-white"
                    >
                      <option value="Order Enquiry">Order Tracking &amp; Delivery</option>
                      <option value="Size & Fit Assistance">Garment Sizing Guidance</option>
                      <option value="Exchanges & Returns">14-Day Exchanges &amp; Returns</option>
                      <option value="Collaboration / Media">Press / Cultural Collaboration</option>
                      <option value="Other">General Inquiry</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-white/70 mb-1">Order Reference # (Optional)</label>
                    <input
                      type="text"
                      value={formData.order_number}
                      onChange={(e) => setFormData({ ...formData, order_number: e.target.value })}
                      placeholder="e.g. TCS-2026-1042"
                      className="w-full bg-[#181818] border border-white/15 px-3 py-2.5 text-white rounded-xs focus:outline-none focus:border-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-white/70 mb-1">Message *</label>
                  <textarea
                    rows={5}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Provide details regarding your inquiry..."
                    className="w-full bg-[#181818] border border-white/15 px-3 py-2.5 text-white rounded-xs focus:outline-none focus:border-white leading-relaxed"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 bg-white text-black font-display tracking-widest text-base font-bold uppercase hover:bg-neutral-200 transition-colors rounded-xs flex items-center justify-center space-x-2 disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  <span>{isSubmitting ? 'DISPATCHING INQUIRY...' : 'SUBMIT INQUIRY'}</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
