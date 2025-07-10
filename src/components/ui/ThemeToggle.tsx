import React from 'react';
import { Switch } from '@heroui/react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

interface ThemeToggleProps {
  collapsed?: boolean;
}

export default function ThemeToggle({ collapsed = false }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors duration-200 ${
      collapsed ? 'justify-center' : ''
    }`}>
      {!collapsed && (
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Theme
        </span>
      )}
      
      <Switch
        isSelected={theme === 'dark'}
        onValueChange={toggleTheme}
        size="sm"
        color="primary"
        thumbIcon={({ isSelected, className }) =>
          isSelected ? (
            <Moon className={`${className} w-3 h-3`} strokeWidth={2} />
          ) : (
            <Sun className={`${className} w-3 h-3`} strokeWidth={2} />
          )
        }
        classNames={{
          base: "inline-flex flex-row-reverse w-full max-w-md items-center justify-between cursor-pointer rounded-lg gap-2 p-0 border-2 border-transparent",
          wrapper: "p-0 h-4 overflow-visible",
          thumb: "w-6 h-6 border-2 shadow-lg group-data-[hover=true]:border-primary group-data-[selected=true]:ml-6 rtl:group-data-[selected=true]:ml-0 rtl:group-data-[selected=true]:mr-6",
        }}
      >
        {!collapsed && (
          <div className="flex flex-col gap-1">
            <p className="text-medium">{theme === 'dark' ? 'Dark' : 'Light'} Mode</p>
            <p className="text-tiny text-default-400">
              {theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
            </p>
          </div>
        )}
      </Switch>
    </div>
  );
} 