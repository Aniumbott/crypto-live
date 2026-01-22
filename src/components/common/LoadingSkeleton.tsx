export function TableSkeleton() {
  return (
    <div className="card overflow-hidden">
      <div className="p-4 border-b border-surface-200 dark:border-surface-800">
        <div className="skeleton h-10 w-80 rounded-lg" />
      </div>
      <div className="divide-y divide-surface-100 dark:divide-surface-800">
        {Array.from({ length: 10 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-4 p-4"
            style={{ animationDelay: `${i * 50}ms` }}
          >
            <div className="skeleton h-4 w-8 rounded" />
            <div className="skeleton h-10 w-10 rounded-full" />
            <div className="flex-1 space-y-2">
              <div className="skeleton h-4 w-32 rounded" />
              <div className="skeleton h-3 w-16 rounded" />
            </div>
            <div className="skeleton h-5 w-24 rounded" />
            <div className="skeleton h-6 w-16 rounded-lg" />
            <div className="hidden md:block skeleton h-5 w-28 rounded" />
            <div className="hidden lg:block skeleton h-5 w-28 rounded" />
            <div className="hidden sm:block skeleton h-8 w-24 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className="card p-6 animate-pulse">
      <div className="flex items-center gap-4 mb-4">
        <div className="skeleton h-16 w-16 rounded-full" />
        <div className="flex-1 space-y-2">
          <div className="skeleton h-5 w-40 rounded" />
          <div className="skeleton h-4 w-20 rounded" />
        </div>
      </div>
      <div className="space-y-3">
        <div className="skeleton h-8 w-32 rounded" />
        <div className="skeleton h-4 w-24 rounded" />
      </div>
    </div>
  );
}