import { Order } from '../types';

export interface PaymentGatewayConfig {
  provider: 'payfast' | 'yoco' | 'eft_instant' | 'manual_eft';
  name: string;
  description: string;
  logoBadge?: string;
  isSandbox: boolean;
}

export const PAYMENT_GATEWAYS: PaymentGatewayConfig[] = [
  {
    provider: 'payfast',
    name: 'PayFast by Network',
    description: 'Credit Card, Debit Card, Instant EFT (Capitec, FNB, Standard Bank, Nedbank, Absa), Masterpass & Zapper.',
    isSandbox: true
  },
  {
    provider: 'yoco',
    name: 'Yoco Gateway',
    description: 'Instant Card payments (Visa & Mastercard) with 3D-Secure South African banking protection.',
    isSandbox: true
  },
  {
    provider: 'eft_instant',
    name: 'Instant EFT (Ozow / SiD)',
    description: 'Automated bank-to-bank electronic transfer with immediate order verification.',
    isSandbox: true
  },
  {
    provider: 'manual_eft',
    name: 'Direct Bank Deposit / EFT',
    description: 'Pay directly into our South African business bank account using your order number as reference.',
    isSandbox: false
  }
];

// PayFast Sandbox Defaults (Officially provided by PayFast for development)
export const PAYFAST_CONFIG = {
  merchantId: import.meta.env.VITE_PAYFAST_MERCHANT_ID || '10000100',
  merchantKey: import.meta.env.VITE_PAYFAST_MERCHANT_KEY || '46f0cd694580a',
  passPhrase: import.meta.env.VITE_PAYFAST_PASSPHRASE || 'jt7NOE43FZPn',
  sandboxUrl: 'https://sandbox.payfast.co.za/eng/process',
  productionUrl: 'https://www.payfast.co.za/eng/process',
  isSandbox: !import.meta.env.VITE_PAYFAST_MERCHANT_ID
};

// Yoco Test Defaults
export const YOCO_CONFIG = {
  publicKey: import.meta.env.VITE_YOCO_PUBLIC_KEY || 'pk_test_ed3c54a67bgkdkg7',
  isSandbox: !import.meta.env.VITE_YOCO_PUBLIC_KEY
};

export const BANKING_DETAILS = {
  bankName: 'First National Bank (FNB)',
  accountName: 'The Connoisseurs Show (Pty) Ltd',
  accountNumber: '62899443210',
  branchCode: '250655',
  accountType: 'Business Cheque Account',
  swiftCode: 'FIRNZAJJ',
  referenceGuide: 'Use your Order Number (e.g. TCS-2026-XXXX) as your payment reference.'
};

export const paymentService = {
  /**
   * Generates a PayFast form parameter payload for redirect
   */
  generatePayFastPayload(order: Order, returnBaseUrl: string) {
    const returnUrl = `${returnBaseUrl}/order-confirmation/${order.order_number}?status=paid&gateway=payfast`;
    const cancelUrl = `${returnBaseUrl}/checkout?status=cancelled&order=${order.order_number}`;
    const notifyUrl = `${returnBaseUrl}/api/webhooks/payfast`;

    return {
      merchant_id: PAYFAST_CONFIG.merchantId,
      merchant_key: PAYFAST_CONFIG.merchantKey,
      return_url: returnUrl,
      cancel_url: cancelUrl,
      notify_url: notifyUrl,
      name_first: order.customer.full_name.split(' ')[0] || 'Connoisseur',
      name_last: order.customer.full_name.split(' ').slice(1).join(' ') || 'Customer',
      email_address: order.customer.email,
      cell_number: order.customer.phone,
      m_payment_id: order.id,
      amount: order.final_total.toFixed(2),
      item_name: `The Connoisseurs Order ${order.order_number}`,
      item_description: `Official Merchandise: ${order.items.length} item(s)`,
      custom_str1: order.order_number
    };
  },

  /**
   * Simulates/Verifies server-side webhook payment callback
   */
  async processSimulatedPayment(
    order: Order,
    gateway: 'payfast' | 'yoco' | 'eft_instant'
  ): Promise<{ success: boolean; transactionId: string; message: string }> {
    // In production, an AWS Lambda / Supabase Edge Function handles the signed HMAC-MD5 / SHA256 webhook
    await new Promise((resolve) => setTimeout(resolve, 1400));

    const transactionId = `${gateway.toUpperCase()}_TXN_${Math.random().toString(36).substring(2, 9).toUpperCase()}`;

    return {
      success: true,
      transactionId,
      message: `Payment authorized via ${gateway.toUpperCase()} sandbox gateway.`
    };
  }
};
