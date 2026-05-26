import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';

export function ThemeToggle() {
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('system');

  useEffect(() => {
    // Read the current theme from localStorage or document class
    const storedTheme = localStorage.getItem('lumea-theme');
    if (storedTheme === 'dark' || storedTheme === 'light') {
      setTheme(storedTheme as 'light' | 'dark');
    } else {
      setTheme('system');
    }
  }, []);

  const toggleTheme = () => {
    const isDark = document.documentElement.classList.contains('dark');
    const nextTheme = isDark ? 'light' : 'dark';
    
    if (nextTheme === 'dark') {
      document.documentElement.classList.add('dark');
      localStorage.setItem('lumea-theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('lumea-theme', 'light');
    }
    
    setTheme(nextTheme);
  };

  return (
    <button
      onClick={toggleTheme}
      className="flex items-center justify-center w-8 h-8 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-500 dark:text-zinc-400 rounded-lg transition-colors border border-zinc-200 dark:border-zinc-700"
      title="Toggle Theme"
      aria-label="Toggle Theme"
    >
      {theme === 'dark' ? <Moon size={16} /> : <Sun size={16} />}
    </button>
  );
}
