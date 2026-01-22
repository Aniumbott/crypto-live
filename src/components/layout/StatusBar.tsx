import { useEffect, useState } from 'react';
import { formatNumber, formatLatency } from '@/lib/formatters';
import { cn } from '@/lib/cn';
import type { WorkerStats } from '@/types/worker';

interface StatusBarProps {
  stats: WorkerStats;
}

export function StatusBar({ stats }: StatusBarProps) {
  const [time, setTime] = useState(() => new Date());
  
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);
  
  return (
    <footer className="status-bar">
      <div className="status-left">
        <div className="status-item">
          <span className="status-label">Updates/sec</span>
          <span className={cn('status-value', stats.updatesPerSecond > 0 && 'highlight')}>
            {formatNumber(stats.updatesPerSecond)}
          </span>
        </div>
        
        <span className="status-divider" aria-hidden="true" />
        
        <div className="status-item">
          <span className="status-label">Latency</span>
          <span className="status-value">{formatLatency(stats.latency)}</span>
        </div>
        
        <span className="status-divider" aria-hidden="true" />
        
        <div className="status-item">
          <span className={cn('status-dot', stats.isConnected ? 'online' : 'offline')} aria-hidden="true" />
          <span className="status-value">
            {stats.isConnected ? 'Connected' : 'Disconnected'}
          </span>
        </div>
      </div>
      
      <div className="status-right">
        <time className="status-time" dateTime={time.toISOString()}>
          {time.toLocaleTimeString('en-US', { hour12: false })}
        </time>
      </div>
    </footer>
  );
}