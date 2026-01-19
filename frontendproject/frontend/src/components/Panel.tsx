// Panel.tsx
import { type ReactNode } from 'react';

interface PanelProps {
  title: string;
  children: ReactNode;
  className?: string;
}

export function Panel({ title, children, className = '' }: PanelProps) {
  return (
    <div
      className={`
        bg-white dark:bg-gray-800 
        rounded-lg shadow-md border border-gray-200 dark:border-gray-700
        overflow-hidden
        ${className}
      `}
    >
      <div className="bg-blue-600 h-2 w-full" /> {/* thin colored top bar – optional but looks nice */}
      <div className="p-5 md:p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
          {title}
        </h2>
        {children}
      </div>
    </div>
  );
}