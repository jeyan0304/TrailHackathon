import React from 'react';
import { Wifi, WifiOff, RefreshCw } from 'lucide-react';
import { ConnectionStatus } from '../../types';

export interface ConnectionBadgeProps {
  status: ConnectionStatus;
  pendingCount?: number;
  interactive?: boolean;
  onToggleStatus?: () => void;
  size?: 'sm' | 'md';
  className?: string;
}

export const ConnectionBadge: React.FC<ConnectionBadgeProps> = ({
  status,
  pendingCount = 0,
  interactive = false,
  onToggleStatus,
  size = 'md',
  className = '',
}) => {
  const config = {
    ONLINE: {
      label: 'ONLINE',
      icon: Wifi,
      classes: 'bg-emerald-100/90 text-emerald-950 border-emerald-400',
      dotClass: 'bg-emerald-500 animate-pulse',
      helper: 'Live Server Link',
    },
    SYNCING: {
      label: 'SYNCING',
      icon: RefreshCw,
      classes: 'bg-sky-100/90 text-sky-950 border-sky-400',
      dotClass: 'bg-sky-500',
      helper: 'Uploading Queue',
    },
    OFFLINE: {
      label: 'OFFLINE',
      icon: WifiOff,
      classes: 'bg-amber-100/90 text-amber-950 border-amber-400',
      dotClass: 'bg-amber-500',
      helper: pendingCount > 0 ? `${pendingCount} Queued` : 'Local Storage',
    },
  }[status];

  const IconComponent = config.icon;
  const isSyncing = status === 'SYNCING';

  return (
    <button
      type="button"
      onClick={interactive ? onToggleStatus : undefined}
      className={`inline-flex items-center rounded-full font-bold uppercase tracking-wider border transition-all duration-150 select-none ${
        size === 'sm' ? 'px-2 py-0.5 text-[11px] gap-1.5' : 'px-2.5 py-1 text-xs gap-2'
      } ${config.classes} ${interactive ? 'cursor-pointer hover:shadow active:scale-95' : 'cursor-default'} ${className}`}
      title={interactive ? `Click to simulate Network change (Current: ${status})` : `Network: ${status}`}
    >
      <span className="relative flex h-2 w-2">
        <span className={`absolute inline-flex h-full w-full rounded-full opacity-75 ${config.dotClass}`} />
        <span className={`relative inline-flex rounded-full h-2 w-2 ${config.dotClass.replace(' animate-pulse', '')}`} />
      </span>

      <IconComponent className={`w-3.5 h-3.5 shrink-0 ${isSyncing ? 'animate-spin text-sky-700' : ''}`} />
      <span>{config.label}</span>

      {pendingCount > 0 && status === 'OFFLINE' && (
        <span className="ml-0.5 px-1.5 py-0.2 bg-amber-600 text-white rounded-full text-[10px] font-mono">
          {pendingCount}
        </span>
      )}
    </button>
  );
};
