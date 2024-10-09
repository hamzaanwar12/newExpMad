// interfaces/Course.ts

import { DifficultyLevel } from '../enums/DifficultyLevel';

export interface Course {
  id: string; // UUID as string
  title: string;
  description?: string; // Optional
  instructor_id: string; // UUID as string
  is_free: boolean;
  price?: number; // Optional; nullable in database
  duration?: number; // in hours; Optional
  difficulty_level?: DifficultyLevel; // Optional
  banner_image_url?: string; // Optional
  created_at: string; // ISO string
  updated_at: string; // ISO string
}
