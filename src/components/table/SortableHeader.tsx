import { type ReactNode } from 'react';

// Define sortable fields explicitly
export type SortField = 'marketCapRank' | 'name' | 'currentPrice' | 'priceChangePercent24h' | 'marketCap' | 'totalVolume';
export type SortDirection = 'asc' | 'desc';

interface SortableHeaderProps {
  field: SortField;
  currentField: SortField;
  direction: SortDirection;
  onSort: (field: SortField) => void;
  className?: string;
  children: ReactNode;
}

export function SortableHeader({
  field,
  currentField,
  direction,
  onSort,
  className = '',
  children,
}: SortableHeaderProps) {
  const isActive = field === currentField;

  // Fix: Determine flex alignment based on text classes
  const justifyClass = className.includes('text-right')
    ? 'justify-end'
    : className.includes('text-center')
      ? 'justify-center'
      : 'justify-start';

  return (
    <th
      scope="col"
      className={`
        px-4 py-3 text-xs font-semibold uppercase tracking-wider cursor-pointer
        text-surface-500 dark:text-surface-400
        hover:text-surface-900 dark:hover:text-surface-100
        transition-colors select-none
        ${className}
      `}
      onClick={() => onSort(field)}
      aria-sort={isActive ? (direction === 'asc' ? 'ascending' : 'descending') : 'none'}
    >
      <div className={`flex items-center gap-1.5 ${justifyClass}`}>
        <span>{children}</span>
        <span className={`transition-all duration-200 ${isActive ? 'opacity-100' : 'opacity-0'}`}>
          <svg
            className={`w-3.5 h-3.5 transition-transform duration-200 ${direction === 'desc' ? 'rotate-180' : ''
              }`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
          </svg>
        </span>
      </div>
    </th>
  );
}