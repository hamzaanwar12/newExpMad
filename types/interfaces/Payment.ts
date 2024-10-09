// interfaces/Payment.ts

import { PaymentStatus } from '../enums/PaymentStatus';
import { Currency } from '../enums/Currency';

export interface Payment {
  id: string; // UUID as string
  user_id: string; // UUID as string
  amount: number;
  currency: Currency;
  status: PaymentStatus;
  payment_method: string;
  stripe_payment_intent_id?: string; // Optional
  created_at: string; // ISO string
}
