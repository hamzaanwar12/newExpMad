import { supabase } from "../supabase/supabase";

export const updateLessonProgress = async (
  userId: string | null,
  lessonId: string | null,
  isCompleted: boolean,
  lastAccessed: string // Should be a valid ISO timestamp string
): Promise<void> => {
  console.log("Updating progress for lesson ID:", lessonId);
  console.log("For user with ID:", userId);

  // Check if userId or lessonId is null
  if (!userId || !lessonId) {
    throw new Error("User ID and Lesson ID must not be null.");
  }

  // Call the RPC function "update_lesson_progress"
  const { data, error } = await supabase.rpc("update_lesson_progress", {
    p_user_id: userId,        // Exact parameter names as in the function
    p_lesson_id: lessonId,
    p_is_completed: isCompleted,
    p_last_accessed: lastAccessed
  });

  if (error) {
    throw new Error(error.message);
  }

  return data; // Optionally return data, if any
};
