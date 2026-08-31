import React from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'warning' | 'outline' | 'ghost';
export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  loading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'secondary',
  size = 'md',
  icon,
  iconPosition = 'left',
  loading = false,
  className = '',
  disabled,
  ...props
}) => {
  const variantStyles: Record<ButtonVariant, string> = {
    primary: 'bg-blue-600 hover:bg-blue-500 text-white border-blue-500 shadow-sm focus:ring-blue-500',
    secondary: 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700 focus:ring-slate-500',
    danger: 'bg-red-600 hover:bg-red-500 text-white border-red-500 focus:ring-red-500',
    warning: 'bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold border-amber-500 focus:ring-amber-500',
    outline: 'bg-transparent hover:bg-slate-800/80 text-slate-300 border-slate-700 hover:border-slate-600 focus:ring-slate-500',
    ghost: 'bg-transparent hover:bg-slate-800 text-slate-300 border-transparent focus:ring-slate-500',
  };

  const sizeStyles: Record<ButtonSize, string> = {
    xs: 'px-2 py-1 text-xs gap-1',
    sm: 'px-2.5 py-1.5 text-xs gap-1.5 font-medium',
    md: 'px-3.5 py-2 text-sm gap-2 font-medium',
    lg: 'px-4 py-2.5 text-base gap-2.5 font-semibold',
  };

  return (
    <button
      className={`inline-flex items-center justify-center rounded-md border font-sans transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:opacity-50 disabled:cursor-not-allowed ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <span className="inline-block w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : (
        <>
          {icon && iconPosition === 'left' && <span className="shrink-0">{icon}</span>}
          {children}
          {icon && iconPosition === 'right' && <span className="shrink-0">{icon}</span>}
        </>
      )}
    </button>
  );
};
