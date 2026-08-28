import React from 'react';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'gray';
  size?: 'sm' | 'md';
  icon?: React.ReactNode;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'md',
  icon,
  className = '',
}) => {
  const sizeStyles = {
    sm: 'px-2 py-0.5 text-xs font-semibold gap-1',
    md: 'px-2.5 py-1 text-xs font-bold gap-1.5',
  };

  const variantStyles = {
    default: 'bg-gov-100 text-gov-800 border border-gov-300',
    primary: 'bg-sky-100 text-sky-900 border border-sky-300',
    success: 'bg-emerald-100 text-emerald-900 border border-emerald-300',
    warning: 'bg-amber-100 text-amber-900 border border-amber-300',
    danger: 'bg-red-100 text-red-900 border border-red-300',
    info: 'bg-blue-100 text-blue-900 border border-blue-300',
    gray: 'bg-gov-200 text-gov-700 border border-gov-300',
  };

  return (
    <span className={`inline-flex items-center rounded-full uppercase tracking-wider ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}>
      {icon && <span className="inline-flex shrink-0">{icon}</span>}
      <span>{children}</span>
    </span>
  );
};
