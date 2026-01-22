import { useState, useCallback, useRef } from 'react';
import { ThemeProvider } from '@/context/ThemeContext';
import { ToastProvider } from '@/context/ToastContext';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import { OfflineBanner } from '@/components/common/OfflineBanner';
import { Header } from '@/components/layout/Header';
import { StatusBar } from '@/components/layout/StatusBar';
import { PriceTable } from '@/components/table/PriceTable';
import type { WorkerStats } from '@/types/worker';

function AppContent() {
  const [stats, setStats] = useState<WorkerStats>({
    updatesPerSecond: 0,
    isConnected: false,
    latency: 0,
  });
  
  const refreshRef = useRef<(() => void) | null>(null);
  
  const handleRefresh = useCallback(() => {
    refreshRef.current?.();
  }, []);
  
  return (
    <div className="app">
      <Header stats={stats} onRefresh={handleRefresh} />
      <OfflineBanner />
      <main className="main">
        <div className="container">
          <header className="page-header">
            <h1 className="page-title">Cryptocurrency Prices by Market Cap</h1>
            <p className="page-subtitle">
              Top 10 cryptocurrencies with real-time price updates
            </p>
          </header>
          <ErrorBoundary>
            <PriceTable onStatsChange={setStats} refreshRef={refreshRef} />
          </ErrorBoundary>
        </div>
      </main>
      <StatusBar stats={stats} />
    </div>
  );
}

export function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <ToastProvider>
          <AppContent />
        </ToastProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}