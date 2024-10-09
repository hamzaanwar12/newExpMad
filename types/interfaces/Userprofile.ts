// interfaces/UserProfile.ts

import { UserRole } from '../enums/UserRole';

export interface UserProfile {
  id: string;
  username: string;
  email: string;
  full_name: string;
  role: UserRole;
  profile_picture_url?: string;
  bio?: string;
  is_subscribed: boolean;
  stripe_customer_id?: string;
  created_at: string;
  updated_at: string;
}
