// src/services/subscriptionService.ts

import { supabase } from "../supabase/supabase";

// Define a Subscription type based on the structure of your subscription table
export interface Subscription {
  id: string;
  user_id: string;
  plan: string;
  start_date: string;
  end_date: string;
  is_active: boolean;
  stripe_subscription_id: string;
  created_at: string;
}

// Define a function to add a subscription by calling the `add_subscription` RPC
export const addSubscription = async (
  userId: string,
  plan: 'monthly' | 'yearly', // Ensure the plan is either 'monthly' or 'yearly'
  stripeSubscriptionId: string
): Promise<Subscription> => {
  const { data, error } = await supabase.rpc("add_subscription", {
    p_user_id: userId,
    p_plan: plan,
    p_stripe_subscription_id: stripeSubscriptionId,
  });

  if (error) {
    console.error("Error adding subscription:", error);
    throw new Error(error.message);
  }

  if (!data || data.length === 0) {
    throw new Error("Failed to add subscription");
  }

  // Assuming the RPC returns a single subscription record
  return data[0] as Subscription;
};
