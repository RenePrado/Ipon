import { Plus } from "lucide-react";

export function FloatingActionButton({ onClick, label, ariaLabel }) {
  return (
    <button
      onClick={onClick}
      className="lg:hidden fixed bottom-24 right-4 w-14 h-14 bg-accent-primary hover:bg-accent-primary/90 text-white rounded-full shadow-lg flex items-center justify-center transition-colors z-40"
      aria-label={ariaLabel || label}
    >
      <Plus size={24} />
    </button>
  );
}
