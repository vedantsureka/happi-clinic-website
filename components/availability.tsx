import { CircleCheck, CircleHelp, PhoneCall } from "lucide-react";
import { cn } from "@/lib/utils";

const labels = {
  confirmed: { text: "Available", Icon: CircleCheck, cls: "bg-mint-soft text-teal-ink" },
  enquiry: { text: "Ask about availability", Icon: CircleHelp, cls: "bg-sky text-teal-ink" },
  unconfirmed: { text: "Call to confirm", Icon: PhoneCall, cls: "bg-[#FFF4DB] text-[#7A4E00]" },
} as const;

export function AvailabilityBadge({ value, className }: { value: string; className?: string }) {
  const item = labels[value as keyof typeof labels] ?? labels.enquiry;
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-semibold", item.cls, className)}>
      <item.Icon className="size-4" aria-hidden="true" />
      {item.text}
    </span>
  );
}
