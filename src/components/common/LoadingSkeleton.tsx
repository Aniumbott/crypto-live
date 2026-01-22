import { cn } from '@/lib/cn';

interface SkeletonProps {
  className?: string;
  rows?: number;
}

export function TableSkeleton({ rows = 10 }: SkeletonProps) {
  return (
    <div className="table-skeleton" role="status" aria-label="Loading data">
      <div className="skeleton-header">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="skeleton-cell" />
        ))}
      </div>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="skeleton-row">
          {Array.from({ length: 8 }).map((_, j) => (
            <div key={j} className={cn('skeleton-cell', j === 1 && 'skeleton-wide')} />
          ))}
        </div>
      ))}
      <span className="sr-only">Loading cryptocurrency data...</span>
    </div>
  );
}