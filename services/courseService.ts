// src/services/courseService.ts

import { supabase } from '../supabase/supabase';
import { CourseWithLessons } from '../types/interfaces/CourseWithLessons';
import {  CourseLesson } from '../types/interfaces/Lesson';

export const fetchAllCoursesWithLessons = async (): Promise<CourseWithLessons[]> => {
  const { data, error } = await supabase.rpc('fetch_all_courses_with_lessons');

  if (error) {
    throw new Error(error.message);
  }

  if (!data) {
    return [];
  }

  const coursesWithLessons: CourseWithLessons[] = data.map((course: any) => ({
    course_id: course.course_id,
    course_title: course.course_title,
    course_description: course.course_description,
    is_free: course.is_free,
    price: course.price,
    course_duration: course.course_duration,
    difficulty_level: course.difficulty_level,
    banner_image_url: course.banner_image_url,
    course_created_at: course.course_created_at,
    course_updated_at: course.course_updated_at,
    instructor_name: course.instructor_name,
    lessons: course.lessons.map((lesson: any) => ({
      lesson_id: lesson.lesson_id,
      lesson_title: lesson.lesson_title,
      lesson_content: lesson.lesson_content,
      lesson_order: lesson.lesson_order,
      lesson_duration: lesson.lesson_duration,
      lesson_created_at: lesson.lesson_created_at,
      lesson_updated_at: lesson.lesson_updated_at,
    })),
  }));

  return coursesWithLessons;
};
