import { useMemo } from 'react';

interface SparklineProps {
  data: number[];
  positive: boolean;
  width?: number;
  height?: number;
}

export function Sparkline({ data, positive, width = 120, height = 40 }: SparklineProps) {
  const path = useMemo(() => {
    if (!data || data.length < 2) return '';
    
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;
    
    return data
      .map((val, i) => {
        const x = (i / (data.length - 1)) * width;
        const y = height - ((val - min) / range) * height;
        return `${i === 0 ? 'M' : 'L'}${x.toFixed(2)},${y.toFixed(2)}`;
      })
      .join(' ');
  }, [data, width, height]);
  
  if (!path) {
    return <div className="sparkline-empty" style={{ width, height }} aria-hidden="true" />;
  }
  
  return (
    <svg
      className="sparkline"
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      aria-hidden="true"
    >
      <path
        d={path}
        fill="none"
        stroke={positive ? 'var(--color-success)' : 'var(--color-danger)'}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}