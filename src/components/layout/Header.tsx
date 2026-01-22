import { type ReactNode } from 'react';
import { useTheme } from '@/context/ThemeContext';
import type { WorkerStats } from '@/types/worker';

interface HeaderProps {
  stats: WorkerStats;
  onRefresh: () => void;
}

export function Header({ stats, onRefresh }: HeaderProps) {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-50 glass">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-lg shadow-primary-500/25">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                  />
                </svg>
              </div>
              {/* Live indicator */}
              <span
                className={`absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-white dark:border-surface-900 ${stats.isConnected ? 'bg-success-500 animate-pulse' : 'bg-surface-400'
                  }`}
              />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg font-bold text-surface-900 dark:text-white">
                Crypto Terminal
              </h1>
              <p className="text-xs text-surface-500 dark:text-surface-400">
                Real-time market data
              </p>
            </div>
          </div>

          {/* Stats Display */}
          <div className="hidden md:flex items-center gap-6 border-l border-r border-surface-200 dark:border-surface-800 px-6 h-8">
            <StatItem
              label="Updates"
              value={`${stats.updatesPerSecond}/s`}
              icon={
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              }
            />
            <div className="w-px h-4 bg-surface-200 dark:bg-surface-800" /> {/* Divider */}
            <StatItem
              label="Latency"
              value={`${stats.latency}ms`}
              status={stats.latency < 100 ? 'good' : stats.latency < 300 ? 'warning' : 'bad'}
              icon={
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
            />
            <div className="w-px h-4 bg-surface-200 dark:bg-surface-800" /> {/* Divider */}
            <div className="flex items-center gap-2">
              <span
                className={`status-dot ${stats.isConnected ? 'status-dot-connected' : 'status-dot-disconnected'
                  }`}
              />
              <span className="text-sm font-medium text-surface-600 dark:text-surface-300">
                {stats.isConnected ? 'Live' : 'Offline'}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* GitHub Link */}
            <a
              href="https://github.com/Aniumbott/crypto-live"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-ghost btn-icon"
              aria-label="View source on GitHub"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
            </a>

            {/* Refresh Button */}
            <button
              onClick={onRefresh}
              className="btn btn-ghost btn-icon group"
              aria-label="Refresh data"
            >
              <svg
                className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
            </button>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="btn btn-ghost btn-icon"
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            >
              {theme === 'dark' ? (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

interface StatItemProps {
  label: string;
  value: string;
  status?: 'good' | 'warning' | 'bad';
  icon: ReactNode;
}

function StatItem({ label, value, status, icon }: StatItemProps) {
  const statusColors = {
    good: 'text-success-500',
    warning: 'text-yellow-500',
    bad: 'text-danger-500',
  };

  return (
    <div className="flex items-center gap-2.5">
      <span className="text-surface-400 dark:text-surface-500">{icon}</span>
      <div className="flex items-baseline gap-1.5">
        <span className="text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wide">
          {label}:
        </span>
        <span className={`text-sm font-bold tabular-nums ${status ? statusColors[status] : 'text-surface-900 dark:text-white'}`}>
          {value}
        </span>
      </div>
    </div>
  );
}