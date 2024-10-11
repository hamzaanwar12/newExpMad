import { supabase } from "@/supabase/supabase";


export const fetchLessonWithProgress = async (
    userId: string | null,
    lessonId: string | null
  ): Promise<any> => {
    console.log("Fetching lesson with ID:", lessonId);
    console.log("For user with ID:", userId);
  
    if (!userId || !lessonId) {
      throw new Error("User ID and Lesson ID must not be null.");
    }
  
    const { data, error } = await supabase.rpc("fetch_lesson_with_progress", {
      p_user_id: userId,
      p_lesson_id: lessonId
    });
  
    if (error) {
      throw new Error(error.message);
    }
  
    console.log("RPC function result:", data);
    return data;
  };
  