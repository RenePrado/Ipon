import { useState, useEffect } from "react";

export function useTheme() {
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    document.documentElement.classList.add('theme-transitioning');
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    setTimeout(() => {
      document.documentElement.classList.remove('theme-transitioning');
    }, 300);
  };

  return { theme, toggleTheme };
}
