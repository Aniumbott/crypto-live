import { useTheme } from '@/context/ThemeContext';
import { formatLatency } from '@/lib/formatters';
import { cn } from '@/lib/cn';
import type { WorkerStats } from '@/types/worker';

interface HeaderProps {
  stats: WorkerStats;
  onRefresh: () => void;
}

export function Header({ stats, onRefresh }: HeaderProps) {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <header className="header">
      <div className="header-brand">
        <svg className="logo-icon" viewBox="0 0 32 32" aria-hidden="true">
          <circle cx="16" cy="16" r="14" stroke="currentColor" strokeWidth="2" fill="none"/>
          <path d="M16 8v16M12 12l4-4 4 4M12 20l4 4 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
        </svg>
        <span className="logo-text">
          <span className="logo-primary">Crypto</span>
          <span className="logo-accent">Live</span>
        </span>
      </div>
      
      <div className="header-status">
        <div className={cn('status-badge', stats.isConnected ? 'connected' : 'disconnected')}>
          <span className="status-dot" aria-hidden="true" />
          <span>{stats.isConnected ? 'Live' : 'Connecting'}</span>
        </div>
        
        {stats.isConnected && stats.latency > 0 && (
          <div className="latency-badge">
            <span aria-hidden="true">⚡</span>
            <span>{formatLatency(stats.latency)}</span>
          </div>
        )}
      </div>
      
      <div className="header-actions">
        <button
          onClick={onRefresh}
          className="icon-btn"
          title="Refresh rankings"
          aria-label="Refresh cryptocurrency rankings"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="M23 4v6h-6M1 20v-6h6"/>
            <path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/>
          </svg>
        </button>
        
        <button
          onClick={toggleTheme}
          className="icon-btn"
          title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
          {theme === 'dark' ? (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <circle cx="12" cy="12" r="5"/>
              <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>
            </svg>
          )}
        </button>
      </div>
    </header>
  );
}