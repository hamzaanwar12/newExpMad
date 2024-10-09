// interfaces/CourseWithInstructor.ts

import { Course } from './Course';
import { User } from './User';

export interface CourseWithInstructor extends Course {
  instructor: Pick<User, 'id' | 'username' | 'full_name' | 'profile_picture_url'>;
}
