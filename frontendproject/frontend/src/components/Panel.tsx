import { type ReactNode } from 'react'

interface PanelProps {
    title: string;
    children: ReactNode;
    className?: string;
    variant?: 'default' | 'primary' | 'secondary';
}

export function Panel({
  title,
  children,
  className = '',
  variant = 'default',
}: PanelProps) {
  // Optional: different background/colors based on variant
  const variantStyles = {
    default: 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700',
    primary: 'bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800',
    secondary: 'bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700',
  };

  return (
    <div
      className={`
        rounded-lg shadow-sm p-6
        ${variantStyles[variant]}
        ${className}
      `}
    >
      <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
        {title}
      </h2>
      <div className="text-gray-700 dark:text-gray-300">
        {children}
      </div>
    </div>
  );
}