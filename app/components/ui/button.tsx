import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'solid' | 'outline';
  size?: 'sm' | 'md' | 'lg' | 'icon';
}

const baseClasses =
  'inline-flex items-center justify-center border border-transparent font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500';

const sizeClasses = {
  sm: 'px-2.5 py-1.5 text-xs',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base',
  icon: 'p-2',
};

const variantClasses = {
  solid: 'text-white bg-indigo-600 hover:bg-indigo-700',
  outline: 'text-indigo-700 bg-transparent hover:bg-indigo-50 border-indigo-700',
};

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'solid',
  size = 'md',
  className = '',
  ...props
}) => {
  return (
    <button
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
