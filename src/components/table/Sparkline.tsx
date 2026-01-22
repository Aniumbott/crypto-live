import { memo, useMemo } from 'react';

interface SparklineProps {
  data: number[];
  isPositive: boolean;
  width?: number;
  height?: number;
}

export const Sparkline = memo(function Sparkline({
  data,
  isPositive,
  width = 100,
  height = 32
}: SparklineProps) {
  const pathD = useMemo(() => {
    if (data.length < 2) return '';

    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;
    const padding = 2;

    const points = data.map((value, index) => {
      const x = (index / (data.length - 1)) * (width - padding * 2) + padding;
      const y = height - padding - ((value - min) / range) * (height - padding * 2);
      return `${x},${y}`;
    });

    return `M${points.join(' L')}`;
  }, [data, width, height]);

  const gradientId = useMemo(() => `sparkline-${Math.random().toString(36).slice(2)}`, []);

  if (data.length < 2) return null;

  const strokeColor = isPositive ? '#22c55e' : '#ef4444';

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className="overflow-visible"
    >
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={strokeColor} stopOpacity="0.3" />
          <stop offset="100%" stopColor={strokeColor} stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Area fill */}
      <path
        d={`${pathD} L${width - 2},${height - 2} L2,${height - 2} Z`}
        fill={`url(#${gradientId})`}
      />

      {/* Line */}
      <path
        d={pathD}
        fill="none"
        stroke={strokeColor}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="drop-shadow-sm"
      />

      {/* End dot */}
      <circle
        cx={width - 2}
        cy={parseFloat(pathD.split(' ').pop()?.split(',')[1] || '0')}
        r="2"
        fill={strokeColor}
        className="drop-shadow-sm"
      />
    </svg>
  );
});