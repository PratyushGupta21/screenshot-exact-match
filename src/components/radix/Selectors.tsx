import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";

export function NativeSelect({
  id,
  label,
  value,
  onChange,
  options,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <div className="space-y-1.5">
      <Label
        htmlFor={id}
        className="font-mono text-[11px] font-semibold uppercase tracking-wider text-zinc-400"
      >
        {label}
      </Label>
      <div className="relative">
        <select
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={cn(
            "h-10 w-full appearance-none rounded-xl bg-[#131316] px-3.5 pr-8 text-xs font-medium text-zinc-100 transition-all cursor-pointer shadow-[0_2px_10px_rgba(0,0,0,0.3)]",
            "border border-white/10 hover:border-white/20",
            "outline-none focus:border-champagne/50 focus:ring-1 focus:ring-champagne/30 focus-visible:border-champagne/50 focus-visible:ring-1 focus-visible:ring-champagne/30",
          )}
        >
          {options.map((o) => (
            <option key={o.value} value={o.value} className="bg-[#131316] text-zinc-100 py-1">
              {o.label}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-zinc-500">
          <svg className="size-3.5 fill-current" viewBox="0 0 20 20">
            <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
          </svg>
        </div>
      </div>
    </div>
  );
}
