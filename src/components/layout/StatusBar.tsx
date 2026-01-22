import type { WorkerStats } from '@/types/worker';

interface StatusBarProps {
  stats: WorkerStats;
}

export function StatusBar({ stats }: StatusBarProps) {
  return (
    <footer className="glass border-t border-surface-200/50 dark:border-surface-700/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-10 text-xs">
          <div className="flex items-center gap-2">
            <span
              className={`status-dot ${stats.isConnected ? 'status-dot-connected' : 'status-dot-disconnected'
                }`}
            />
            <span className="text-surface-600 dark:text-surface-400">
              {stats.isConnected ? 'Connected to Binance' : 'Disconnected'}
            </span>
          </div>
          <span className="hidden sm:inline text-surface-400">
            Data from CoinGecko & Binance
          </span>
        </div>
      </div>
    </footer>
  );
}