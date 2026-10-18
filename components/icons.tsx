import { Stethoscope, ClipboardList, Microscope, Pill, HeartPulse, type LucideIcon } from "lucide-react";

const map: Record<string, LucideIcon> = {
  stethoscope: Stethoscope,
  clipboard: ClipboardList,
  microscope: Microscope,
  pill: Pill,
  heart: HeartPulse,
};

export function ServiceIcon({ name, className }: { name: string; className?: string }) {
  const Icon = map[name] ?? Stethoscope;
  return <Icon className={className} aria-hidden="true" strokeWidth={1.75} />;
}
