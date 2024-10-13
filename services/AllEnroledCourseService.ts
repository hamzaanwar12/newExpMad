import { supabase } from '../supabase/supabase';
// src/types/interfaces/EnrolledCoursesResponse.ts

export interface EnrolledCourse {
    course_id: string;
    course_title: string;
    course_description: string;
    instructor_name: string;
    course_duration: string;
    banner_image_url: string;
    lesson_length: number;
    price?: number; // Price can be optional
  }
  
  export interface EnrolledCoursesResponse {
    not_started: EnrolledCourse[];
    in_progress: EnrolledCourse[];
    completed: EnrolledCourse[];
  }
// src/services/enrollmentService.ts

export const fetchEnrolledCourses = async (user_uuid: string): Promise<EnrolledCoursesResponse> => {
  const { data, error } = await supabase.rpc('fetch_enrolled_courses', { user_uuid });

  if (error) {
    throw new Error(error.message);
  }

  if (!data) {
    return { not_started: [], in_progress: [], completed: [] };
  }

  return {
    not_started: data.not_started,
    in_progress: data.in_progress,
    completed: data.completed,
  };
};
