// interfaces/User.ts

import { UserRole } from '../enums/UserRole';

export interface User {
  id: string; // UUID as string
  username: string;
  email: string;
  password_hash: string; // Consider omitting this in frontend contexts for security
  full_name: string;
  role: UserRole;
  profile_picture_url?: string; // Optional
  bio?: string; // Optional
  is_subscribed: boolean;
  stripe_customer_id?: string; // Optional
  created_at: string; // ISO string
  updated_at: string; // ISO string
}
