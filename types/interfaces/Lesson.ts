// interfaces/Lesson.ts

export interface Lesson {
    id: string; // UUID as string
    course_id: string; // UUID as string
    title: string;
    content?: string; // Optional
    order: number;
    duration?: number; // in minutes; Optional
    created_at: string; // ISO string
    updated_at: string; // ISO string
  }
  


  // src/interfaces/Lesson.ts

export interface CourseLesson {
  lesson_id: string; // UUID as string
  lesson_title: string;
  lesson_content?: string;
  lesson_order: number;
  lesson_duration?: number; // in minutes
  lesson_created_at: string; // ISO string
  lesson_updated_at: string; // ISO string
}
