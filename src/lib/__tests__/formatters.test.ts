import { describe, it, expect } from 'vitest';
import { formatPrice, formatCompact, formatPercent, formatLatency } from '../formatters';

describe('formatPrice', () => {
  it('formats large prices with 2 decimals', () => {
    expect(formatPrice(50000)).toBe('$50,000.00');
    expect(formatPrice(1234.56)).toBe('$1,234.56');
  });

  it('formats small prices with more decimals', () => {
    expect(formatPrice(0.5)).toBe('$0.5000');
    expect(formatPrice(0.00123)).toBe('$0.001230');
  });

  it('handles zero', () => {
    expect(formatPrice(0)).toBe('$0.000000');
  });
});

describe('formatCompact', () => {
  it('formats billions', () => {
    expect(formatCompact(1_500_000_000)).toMatch(/\$1\.5B/);
  });

  it('formats millions', () => {
    expect(formatCompact(2_500_000)).toMatch(/\$2\.5M/);
  });
});

describe('formatPercent', () => {
  it('adds plus sign for positive values', () => {
    expect(formatPercent(5.5)).toBe('+5.50%');
  });

  it('shows minus sign for negative values', () => {
    expect(formatPercent(-3.25)).toBe('-3.25%');
  });

  it('handles zero', () => {
    expect(formatPercent(0)).toBe('+0.00%');
  });
});

describe('formatLatency', () => {
  it('shows <1ms for very low latency', () => {
    expect(formatLatency(0.5)).toBe('<1ms');
  });

  it('rounds to nearest ms', () => {
    expect(formatLatency(45.7)).toBe('46ms');
  });

  it('handles exact values', () => {
    expect(formatLatency(100)).toBe('100ms');
  });
});
