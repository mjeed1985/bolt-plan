import React from 'react';
import { useTheme } from '@/contexts/ThemeProvider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Moon, Sun } from 'lucide-react';

const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <div className="flex items-center space-x-2" dir="ltr">
      <Sun className={`h-5 w-5 text-yellow-500 transition-all ${theme === 'dark' ? 'opacity-50' : 'opacity-100'}`} />
      <Switch
        id="theme-mode"
        checked={theme === 'dark'}
        onCheckedChange={toggleTheme}
        aria-label="Toggle dark mode"
      />
      <Moon className={`h-5 w-5 text-slate-400 transition-all ${theme === 'dark' ? 'opacity-100' : 'opacity-50'}`} />
      <Label htmlFor="theme-mode" className="text-foreground arabic-text mr-2 cursor-pointer">
        الوضع الداكن
      </Label>
    </div>
  );
};

export default ThemeToggle;