import { useContext, useCallback } from 'react';
import { ThemeContext } from '@/contexts/ThemeContext';

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  
  // Add a memoized setTheme function to prevent unnecessary re-renders
  const setTheme = useCallback(context.setTheme, [context.setTheme]);
  
  return { 
    theme: context.theme,
    setTheme
  };
};

export default useTheme;