// interfaces/Subscription.ts

import { SubscriptionPlan } from '../enums/SubscriptionPlan';

export interface Subscription {
  id: string; // UUID as string
  user_id: string; // UUID as string
  plan: SubscriptionPlan;
  start_date: string; // ISO string
  end_date: string; // ISO string
  is_active: boolean;
  stripe_subscription_id?: string; // Optional
}
