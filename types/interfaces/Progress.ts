// interfaces/Progress.ts

export interface Progress {
    id: string; // UUID as string
    user_id: string; // UUID as string
    lesson_id: string; // UUID as string
    is_completed: boolean;
    last_accessed: string; // ISO string
  }
  