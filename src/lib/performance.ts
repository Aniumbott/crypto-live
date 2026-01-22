interface PerformanceMetric {
  name: string;
  value: number;
  timestamp: number;
}

class PerformanceMonitor {
  private metrics: PerformanceMetric[] = [];
  private readonly maxMetrics = 100;

  mark(name: string, value: number) {
    this.metrics.push({
      name,
      value,
      timestamp: Date.now(),
    });

    if (this.metrics.length > this.maxMetrics) {
      this.metrics = this.metrics.slice(-this.maxMetrics);
    }
  }

  measure(name: string, fn: () => void) {
    const start = performance.now();
    fn();
    const duration = performance.now() - start;
    this.mark(name, duration);
    return duration;
  }

  async measureAsync<T>(name: string, fn: () => Promise<T>): Promise<T> {
    const start = performance.now();
    const result = await fn();
    const duration = performance.now() - start;
    this.mark(name, duration);
    return result;
  }

  getMetrics(name?: string) {
    return name ? this.metrics.filter((m) => m.name === name) : this.metrics;
  }

  getAverage(name: string) {
    const relevant = this.metrics.filter((m) => m.name === name);
    if (relevant.length === 0) return 0;
    return relevant.reduce((sum, m) => sum + m.value, 0) / relevant.length;
  }

  clear() {
    this.metrics = [];
  }
}

export const perfMonitor = new PerformanceMonitor();
