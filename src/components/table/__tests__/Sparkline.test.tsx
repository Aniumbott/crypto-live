import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { Sparkline } from '../Sparkline';

describe('Sparkline', () => {
  it('renders SVG with path for valid data', () => {
    const data = [100, 105, 103, 110, 108];
    const { container } = render(<Sparkline data={data} positive={true} />);

    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveAttribute('aria-hidden', 'true');

    const path = container.querySelector('path');
    expect(path).toBeInTheDocument();
    expect(path).toHaveAttribute('stroke', 'var(--color-success)');
  });

  it('renders empty div for insufficient data', () => {
    const { container } = render(<Sparkline data={[100]} positive={true} />);

    expect(container.querySelector('svg')).not.toBeInTheDocument();
    expect(container.querySelector('.sparkline-empty')).toBeInTheDocument();
  });

  it('uses danger color for negative trend', () => {
    const data = [100, 95, 90];
    const { container } = render(<Sparkline data={data} positive={false} />);

    const path = container.querySelector('path');
    expect(path).toHaveAttribute('stroke', 'var(--color-danger)');
  });

  it('renders empty div for empty data array', () => {
    const { container } = render(<Sparkline data={[]} positive={true} />);

    expect(container.querySelector('svg')).not.toBeInTheDocument();
    expect(container.querySelector('.sparkline-empty')).toBeInTheDocument();
  });

  it('respects custom dimensions', () => {
    const data = [100, 110, 105];
    const { container } = render(
      <Sparkline data={data} positive={true} width={200} height={60} />
    );

    const svg = container.querySelector('svg');
    expect(svg).toHaveAttribute('width', '200');
    expect(svg).toHaveAttribute('height', '60');
  });
});
