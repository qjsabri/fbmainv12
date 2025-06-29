import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { APP_CONFIG } from '@/lib/constants';
import { handleError } from '@/lib/utils';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: APP_CONFIG.CACHE_TIME,
      gcTime: APP_CONFIG.CACHE_TIME * 2,
      retry: 3,
      refetchOnWindowFocus: false,
      onError: (error) => handleError(error, 'query'),
    },
    mutations: {
      retry: 1,
      onError: (error) => handleError(error, 'mutation'),
    },
  },
});

interface QueryProviderProps {
  children: React.ReactNode;
}

export const QueryProvider: React.FC<QueryProviderProps> = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

export default QueryProvider;