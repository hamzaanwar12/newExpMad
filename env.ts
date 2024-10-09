// env.ts
import { z } from "zod";

// Define your environment variable schema
const schema = z.object({
  EXPO_PUBLIC_SUPABASE_URL: z.string().url(),
  EXPO_PRIVATE_SUPABASE_API_KEY: z.string().min(1),
});

// Validate and parse environment variables
const Env = schema.parse({
  EXPO_PUBLIC_SUPABASE_URL: process.env.EXPO_PUBLIC_SUPABASE_URL,
  EXPO_PRIVATE_SUPABASE_API_KEY: process.env.EXPO_PRIVATE_SUPABASE_API_KEY,
});

console.log(Env)

// Export the validated environment variables
export { Env };
