// src/services/courseService.ts

import { supabase } from '../supabase/supabase';
import { CoursesResponse } from '@/components/courses/CourseCard';

export const fetchPaginatedCourses = async (
  page: number = 1
): Promise<CoursesResponse> => {
  const { data, error } = await supabase.rpc('fetch_paginated_courses', { page });

  if (error) {
    throw new Error(error.message);
  }

  if (!data) {
    return { basic: [], intermediate: [], advanced: [] };
  }

  return {
    basic: data.basic || [],
    intermediate: data.intermediate || [],
    advanced: data.advanced || [],
  };
};
