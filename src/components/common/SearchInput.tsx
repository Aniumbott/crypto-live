import { useId } from 'react';
import { cn } from '@/lib/cn';

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function SearchInput({
  value,
  onChange,
  placeholder = 'Search coins...',
  className,
}: SearchInputProps) {
  const id = useId();

  return (
    <div className={cn('search-container', className)}>
      <label htmlFor={id} className="sr-only">
        Search cryptocurrencies
      </label>
      <svg
        className="search-icon"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        aria-hidden="true"
      >
        <circle cx="11" cy="11" r="8" />
        <path d="M21 21l-4.35-4.35" />
      </svg>
      <input
        id={id}
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="search-input"
        autoComplete="off"
        spellCheck={false}
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className="search-clear"
          aria-label="Clear search"
        >
          ×
        </button>
      )}
    </div>
  );
}
