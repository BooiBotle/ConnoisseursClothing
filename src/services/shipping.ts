import { ShippingOption } from '../types';

export const FREE_SHIPPING_THRESHOLD = 1200; // in ZAR

export const SA_PROVINCES = [
  'Gauteng',
  'Western Cape',
  'KwaZulu-Natal',
  'Eastern Cape',
  'Free State',
  'Limpopo',
  'Mpumalanga',
  'North West',
  'Northern Cape'
] as const;

export const SHIPPING_OPTIONS: ShippingOption[] = [
  {
    id: 'ship-standard',
    name: 'Standard Nationwide Courier',
    description: 'Reliable door-to-door courier delivery anywhere in South Africa with live SMS/email tracking.',
    estimated_days: '3 – 5 business days',
    price: 120,
    free_threshold: FREE_SHIPPING_THRESHOLD
  },
  {
    id: 'ship-express',
    name: 'Express Overnight Courier',
    description: 'Priority overnight air express delivery to Gauteng, Cape Town, Durban, and major metropolitan centres.',
    estimated_days: '1 – 2 business days',
    price: 180
  },
  {
    id: 'ship-pargo',
    name: 'Pargo / Locker Pickup',
    description: 'Collect your parcel 24/7 from hundreds of convenient certified pickup points and smart lockers nationwide.',
    estimated_days: '2 – 4 business days',
    price: 85
  }
];

export function calculateShippingFee(optionId: string, subtotal: number): number {
  const option = SHIPPING_OPTIONS.find((s) => s.id === optionId) || SHIPPING_OPTIONS[0];
  if (option.free_threshold && subtotal >= option.free_threshold) {
    return 0;
  }
  return option.price;
}
