import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

const DarkModeToggle = () => {
  const { theme, setTheme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const currentTheme = theme === 'system' ? systemTheme : theme;
  const isDark = currentTheme === 'dark';

  const toggleTheme = () => {
    setTheme(isDark ? 'light' : 'dark');
  };

  return (
    <button
      onClick={toggleTheme}
      className="fixed top-24 right-4 md:right-8 z-[1000] w-10 h-10 md:w-12 md:h-12 bg-primary hover:bg-primary/90 text-white rounded-full shadow-lg hover:scale-105 transition-all duration-300 flex items-center justify-center"
      aria-label={isDark ? 'Ativar modo claro' : 'Ativar modo escuro'}
      title={isDark ? 'Modo claro' : 'Modo escuro'}
    >
      {isDark ? (
        <Sun className="w-4 h-4 md:w-5 md:h-5" />
      ) : (
        <Moon className="w-4 h-4 md:w-5 md:h-5" />
      )}
    </button>
  );
};

export default DarkModeToggle;