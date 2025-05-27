// components/ThemeProvider.tsx (or app/[theme]/components/ThemeProvider.tsx)
'use client';
import { createContext, useContext } from 'react';
import { ThemeConfig } from '@/lib/themes';

const ThemeContext = createContext<ThemeConfig | null>(null);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  theme: ThemeConfig;
  children: React.ReactNode;
}

export default function ThemeProvider({ theme, children }: ThemeProviderProps) {
  console.log('ThemeProvider received theme:', theme.name);
  
  return (
    <ThemeContext.Provider value={theme}>
      <div 
        className="theme-wrapper"
        style={{
          '--primary': theme.colors.primary,
          '--secondary': theme.colors.secondary,
          '--background': theme.colors.background,
          '--text': theme.colors.text,
          '--accent': theme.colors.accent,
        } as React.CSSProperties}
        data-theme={theme.id}
      >
        {children}
      </div>
    </ThemeContext.Provider>
  );
}

// 'use client';

// import { ThemeConfig } from '@/lib/themes';
// import { createContext, useContext } from 'react';

// const ThemeContext = createContext<ThemeConfig | null>(null);

// export const useTheme = () => {
//   const context = useContext(ThemeContext);
//   if (!context) {
//     throw new Error('useTheme must be used within a ThemeProvider');
//   }
//   return context;
// };

// interface ThemeProviderProps {
//   theme: ThemeConfig;
//   children: React.ReactNode;
// }

// export default function ThemeProvider({ theme, children }: ThemeProviderProps) {
//   return (
//     <ThemeContext.Provider value={theme}>
//       {children}
//     </ThemeContext.Provider>
//   );
// }
