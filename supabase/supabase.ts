

import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient } from '@supabase/supabase-js'

const supabasePublicUrl = process.env.EXPO_PUBLIC_SUPABASE_URL
const supabaseAPIKey = process.env.EXPO_PUBLIC_SUPABASE_API_KEY

export const supabase = createClient(supabasePublicUrl, supabaseAPIKey,{
  auth: {
    storage: AsyncStorage,
    localStorage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})











