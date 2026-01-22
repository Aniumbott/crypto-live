import { cn } from '@/lib/cn';
import type { SortField, SortDirection } from '@/hooks/useSort';

interface SortableHeaderProps {
  field: SortField;
  currentField: SortField;
  direction: SortDirection;
  onSort: (field: SortField) => void;
  children: React.ReactNode;
  className?: string;
}

export function SortableHeader({
  field,
  currentField,
  direction,
  onSort,
  children,
  className,
}: SortableHeaderProps) {
  const isActive = field === currentField;

  return (
    <th 
      scope="col" 
      className={cn('sortable-header', className)}
      aria-sort={isActive ? (direction === 'asc' ? 'ascending' : 'descending') : undefined}
    >
      <button
        onClick={() => onSort(field)}
        className={cn('sort-button', isActive && 'active')}
      >
        {children}
        <span className="sort-indicator" aria-hidden="true">
          {isActive ? (direction === 'asc' ? '↑' : '↓') : '↕'}
        </span>
      </button>
    </th>
  );
}
