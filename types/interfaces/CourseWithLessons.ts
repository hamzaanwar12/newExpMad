// src/interfaces/CourseWithLessons.ts

import { CourseLesson } from "./Lesson";
export interface CourseWithLessons {
  course_id: string;
  course_title: string;
  course_description?: string;
  is_free: boolean;
  price?: number;
  course_duration?: number; // in hours
  difficulty_level?: "basic" | "intermediate" | "advanced";
  banner_image_url?: string;
  course_created_at: string; // ISO string
  course_updated_at: string; // ISO string
  instructor_name: string;
  lessons: CourseLesson[]; // Array of Lesson objects
}
