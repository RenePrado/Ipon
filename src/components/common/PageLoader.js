export function PageLoader() {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="w-8 h-8 border-2 border-accent-primary border-t-transparent rounded-full animate-spin" />
      <span className="ml-3 text-text-secondary dark:text-dark-text-secondary text-sm">Loading...</span>
    </div>
  );
}
