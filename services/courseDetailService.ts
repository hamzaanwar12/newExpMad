// src/services/courseService.ts

import { supabase } from "../supabase/supabase";

// src/types/interfaces/CourseResponse.ts

export interface LessonProgress {
    lesson_id: string;
    lesson_title: string;
    lesson_content: string;
    lesson_order: number;
    lesson_duration: number;
    lesson_created_at: string;
    lesson_updated_at: string;
    is_completed: boolean;
  }
  
  export interface CourseDetail {
    course_id: string;
    course_title: string;
    course_description: string;
    is_free: boolean;
    price: number;
    course_duration: number;
    difficulty_level: string;
    banner_image_url: string;
    course_created_at: string;
    course_updated_at: string;
    instructor_name: string;
    is_enrolled: boolean;
    completion_status: string;
    course_progress: number;
    lessons: LessonProgress[];
  }
  

export const fetchCourseById = async (
  courseId: string,
  userId: string
): Promise<CourseDetail> => {
  const { data, error } = await supabase.rpc("fetch_course_by_id", {
    input_course_id: courseId,
    input_user_id: userId,
  });

  if (error) {
    console.error("Error fetching course:", error);
    throw new Error(error.message);
  }

  if (!data || data.length === 0) {
    throw new Error("Course not found");
  }

  // Assuming data is an array with a single object
  return data[0] as CourseDetail;
};
