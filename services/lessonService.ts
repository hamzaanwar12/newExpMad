import { supabase } from "../supabase/supabase";

export const fetchLessonWithProgress = async (
  userId: string | null,
  lessonId: string | null
): Promise<any> => {
  console.log("Fetching lesson with ID:", lessonId);
  console.log("For user with ID:", userId);

  // Check if userId or lessonId is null
  if (!userId || !lessonId) {
    throw new Error("User ID and Lesson ID must not be null.");
  }

  // Call the RPC function "fetch_lesson_with_progress"
  const { data, error } = await supabase.rpc("fetch_lesson_with_progress", {
    p_user_id: userId,  // Exact parameter names as in the function
    p_lesson_id: lessonId
  });

  if (error) {
    throw new Error(error.message);
  }

  return data; // Return the JSON result from the RPC function
};
