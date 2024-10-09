// interfaces/Enrollment.ts

import { CompletionStatus } from '../enums/CompletionStatus';

export interface Enrollment {
  id: string; // UUID as string
  user_id: string; // UUID as string
  course_id: string; // UUID as string
  enrollment_date: string; // ISO string
  completion_status: CompletionStatus;
  last_accessed_lesson_id?: string; // UUID as string; Optional
}
