import React from 'react';

interface CardProps {
  title?: React.ReactNode;
  subtitle?: string;
  icon?: React.ReactNode;
  headerBadge?: React.ReactNode;
  headerActions?: React.ReactNode;
  footer?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  noPadding?: boolean;
}

export const Card: React.FC<CardProps> = ({
  title,
  subtitle,
  icon,
  headerBadge,
  headerActions,
  footer,
  children,
  className = '',
  noPadding = false,
}) => {
  const hasHeader = title || subtitle || icon || headerBadge || headerActions;

  return (
    <div className={`bg-slate-900/90 rounded-lg border border-slate-800 shadow-sm flex flex-col ${className}`}>
      {hasHeader && (
        <div className="px-4 py-3 border-b border-slate-800 flex items-center justify-between gap-3 bg-slate-900/50">
          <div className="flex items-center gap-2.5 min-w-0">
            {icon && <span className="text-slate-400 shrink-0">{icon}</span>}
            <div className="min-w-0">
              {title && (
                <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider truncate flex items-center gap-2">
                  {title}
                </h3>
              )}
              {subtitle && (
                <p className="text-xs text-slate-400 font-normal truncate mt-0.5">
                  {subtitle}
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {headerBadge}
            {headerActions}
          </div>
        </div>
      )}

      <div className={`flex-1 ${noPadding ? '' : 'p-4'}`}>
        {children}
      </div>

      {footer && (
        <div className="px-4 py-2.5 border-t border-slate-800 bg-slate-900/40 text-xs text-slate-400 rounded-b-lg">
          {footer}
        </div>
      )}
    </div>
  );
};
