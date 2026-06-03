import { cn } from "@/lib/utils";

export default function InterestTag({ label, selected, onClick, variant = "default" }) {
  const base = "px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer select-none";
  const variants = {
    default: selected
      ? "bg-primary text-primary-foreground shadow-sm"
      : "bg-secondary text-secondary-foreground hover:bg-secondary/80",
    coral: "bg-primary/15 text-primary border border-primary/20",
    blue: "bg-secondary text-secondary-foreground",
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(base, variants[variant])}
    >
      #{label}
    </button>
  );
}