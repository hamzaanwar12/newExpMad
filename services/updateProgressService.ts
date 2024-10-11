import { supabase } from "@/supabase/supabase"; // Ensure you have initialized supabase client

export const updateLessonProgress = async (
  userId: string,
  lessonId: string
) => {
  try {
    const { data, error } = await supabase
      .from('progress')
      .update({ is_completed: true, last_accessed: new Date().toISOString() })
      .eq('user_id', userId)
      .eq('lesson_id', lessonId)
      .select();
      
    if (error) {
      throw error;
    }
    
    return data;
  } catch (error: any) {
    throw new Error(error.message || "Failed to update progress.");
  }
};
