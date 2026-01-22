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
    <div className="min-h-screen flex flex-col bg-surface-50 dark:bg-surface-950">
      <Header stats={stats} onRefresh={handleRefresh} />
      <OfflineBanner />

      <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Page Header */}
          <header className="mb-8 text-center sm:text-left">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-surface-900 dark:text-white mb-2">
              <span className="text-gradient">Cryptocurrency Prices</span>
              <span className="text-surface-600 dark:text-surface-400"> by Market Cap</span>
            </h1>
            <p className="text-surface-500 dark:text-surface-400 text-sm sm:text-base">
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