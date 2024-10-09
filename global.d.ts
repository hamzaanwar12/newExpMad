declare namespace NodeJS {
    interface ProcessEnv {
      EXPO_PUBLIC_SUPABASE_URL: string;
      EXPO_PRIVATE_SUPABASE_API_KEY: string;
      NODE_ENV: 'development' | 'production';
    }
  }
  