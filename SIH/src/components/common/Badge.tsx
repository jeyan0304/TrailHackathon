import React from 'react';

export type BadgeVariant = 'default' | 'success' | 'warning' | 'danger' | 'info' | 'neutral' | 'outline';
export type BadgeSize = 'sm' | 'md' | 'lg';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: BadgeSize;
  icon?: React.ReactNode;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  default: 'bg-slate-800 text-slate-200 border-slate-700',
  success: 'bg-emerald-950/80 text-emerald-300 border-emerald-700/50',
  warning: 'bg-amber-950/80 text-amber-300 border-amber-700/50',
  danger: 'bg-red-950/80 text-red-300 border-red-700/50',
  info: 'bg-sky-950/80 text-sky-300 border-sky-700/50',
  neutral: 'bg-slate-800/80 text-slate-300 border-slate-700',
  outline: 'bg-transparent text-slate-300 border-slate-600',
};

const sizeStyles: Record<BadgeSize, string> = {
  sm: 'px-2 py-0.5 text-xs gap-1',
  md: 'px-2.5 py-1 text-xs gap-1.5 font-medium',
  lg: 'px-3 py-1.5 text-sm gap-2 font-medium',
};

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'md',
  icon,
  className = '',
}) => {
  return (
    <span
      className={`inline-flex items-center justify-center rounded-md border font-semibold tracking-wide uppercase ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
    </span>
  );
};
