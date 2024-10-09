import { supabase } from "../supabase/supabase";

export const enrollForFree = async (
  userId: string | null,
  courseId: string | null
): Promise<string> => {
  console.log("Enrolling user with ID:", userId);
  console.log("Enrolling in course with ID:", courseId);
  // Check if userId or courseId is null
  if (!userId || !courseId) {
    throw new Error("User ID and Course ID must not be null.");
  }

  const { data, error } = await supabase.rpc("enroll_user_in_course", {
    p_user_id: userId, // use the exact names as in the function
    p_course_id: courseId,
  });

  if (error) {
    throw new Error(error.message);
  }

  return data; // Return the success message from the RPC function
};
