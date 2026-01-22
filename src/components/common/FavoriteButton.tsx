import { memo, type MouseEvent } from 'react';

interface FavoriteButtonProps {
  isFavorite: boolean;
  onClick: (e: MouseEvent) => void;
  className?: string;
}

export const FavoriteButton = memo(function FavoriteButton({
  isFavorite,
  onClick,
  className = '',
}: FavoriteButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`
        p-1.5 rounded-lg transition-all duration-200
        hover:bg-surface-100 dark:hover:bg-surface-700
        focus:outline-none focus:ring-2 focus:ring-primary-500/50
        ${className}
      `}
      aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
      aria-pressed={isFavorite}
    >
      <svg
        className={`w-4 h-4 transition-all duration-200 ${isFavorite
            ? 'text-yellow-400 fill-yellow-400 scale-110'
            : 'text-surface-400 hover:text-yellow-400'
          }`}
        viewBox="0 0 20 20"
        fill={isFavorite ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth={isFavorite ? 0 : 1.5}
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    </button>
  );
});