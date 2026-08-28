import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'flat' | 'bordered' | 'critical' | 'highlight';
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  padding = 'md',
  className = '',
  ...props
}) => {
  const baseStyles = 'rounded-2xl transition-shadow duration-150';

  const variantStyles = {
    default: 'bg-white border border-gov-200/80 shadow-touch',
    flat: 'bg-gov-50 border border-gov-200',
    bordered: 'bg-white border-2 border-gov-300',
    critical: 'bg-red-50/70 border-2 border-red-300 shadow-touch',
    highlight: 'bg-sky-50/70 border-2 border-sky-300 shadow-touch',
  };

  const paddingStyles = {
    none: 'p-0',
    sm: 'p-3',
    md: 'p-4 sm:p-5',
    lg: 'p-6',
  };

  return (
    <div
      className={`${baseStyles} ${variantStyles[variant]} ${paddingStyles[padding]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
