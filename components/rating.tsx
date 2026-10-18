import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

/** Five stars with the last one filled proportionally (e.g. 4.9 → 90%). */
export function Stars({ value, className, tone = "gold" }: { value: number; className?: string; tone?: "gold" | "white" }) {
  const color = tone === "gold" ? "text-[#F2A900]" : "text-white";
  return (
    <span className={cn("inline-flex items-center gap-0.5", className)} role="img" aria-label={`${value.toFixed(1)} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, i) => {
        const fill = Math.max(0, Math.min(1, value - i));
        return (
          <span key={i} className="relative inline-block size-[1em]">
            <Star className={cn("absolute inset-0 size-full", tone === "gold" ? "text-[#F2A900]/30" : "text-white/35")} fill="currentColor" strokeWidth={0} aria-hidden="true" />
            <span className="absolute inset-0 overflow-hidden" style={{ width: `${fill * 100}%` }}>
              <Star className={cn("size-[1em]", color)} fill="currentColor" strokeWidth={0} aria-hidden="true" />
            </span>
          </span>
        );
      })}
    </span>
  );
}
