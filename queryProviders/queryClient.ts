// src/queryClient.ts

import { QueryClient } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Define default query options here
      refetchOnWindowFocus: false, // Disable refetch on window focus for React Native
      retry: 1, // Number of retry attempts on failure
      staleTime: 1000 * 60 * 5, // Data considered fresh for 5 minutes
    },
  },
});

export default queryClient;
