import { useEffect } from 'react';
import { ThemeProvider as CustomThemeProvider } from '@/contexts/ThemeContext';

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <CustomThemeProvider>{children}</CustomThemeProvider>;
};

export default ThemeProvider;