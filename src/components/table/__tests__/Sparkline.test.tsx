import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { Sparkline } from '../Sparkline';

describe('Sparkline', () => {
  it('renders sparkline with data', () => {
    const data = [100, 105, 102, 108, 106, 110];
    const { container } = render(<Sparkline data={data} isPositive={true} />);
    
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
    
    const path = container.querySelector('path');
    expect(path).toBeInTheDocument();
  });

  it('returns null for insufficient data', () => {
    const { container } = render(<Sparkline data={[100]} isPositive={true} />);
    
    const svg = container.querySelector('svg');
    expect(svg).not.toBeInTheDocument();
  });

  it('applies correct color for negative trend', () => {
    const data = [110, 105, 102, 100];
    const { container } = render(<Sparkline data={data} isPositive={false} />);
    
    const path = container.querySelectorAll('path')[1]; // The line path
    expect(path).toHaveAttribute('stroke', '#ef4444');
  });

  it('returns null for empty data', () => {
    const { container } = render(<Sparkline data={[]} isPositive={true} />);
    
    const svg = container.querySelector('svg');
    expect(svg).not.toBeInTheDocument();
  });

  it('respects custom dimensions', () => {
    const data = [100, 105, 102, 108];
    const { container } = render(
      <Sparkline data={data} isPositive={true} width={200} height={60} />
    );
    
    const svg = container.querySelector('svg');
    expect(svg).toHaveAttribute('width', '200');
    expect(svg).toHaveAttribute('height', '60');
  });
});