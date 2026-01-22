import { cn } from '@/lib/cn';

interface FavoriteButtonProps {
  isFavorite: boolean;
  onToggle: () => void;
  coinName: string;
}

export function FavoriteButton({ isFavorite, onToggle, coinName }: FavoriteButtonProps) {
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onToggle();
      }}
      className={cn('favorite-btn', isFavorite && 'active')}
      aria-label={
        isFavorite ? `Remove ${coinName} from favorites` : `Add ${coinName} to favorites`
      }
      aria-pressed={isFavorite}
    >
      <svg
        viewBox="0 0 24 24"
        fill={isFavorite ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
      </svg>
    </button>
  );
}
