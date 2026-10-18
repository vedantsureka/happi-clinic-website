import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "light" | "outline-light" | "quiet";
type Size = "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2.5 rounded-[var(--radius-control)] font-display font-bold tracking-[-0.01em] transition-colors duration-150 select-none whitespace-nowrap disabled:opacity-60 disabled:cursor-not-allowed";

const variants: Record<Variant, string> = {
  primary: "bg-teal text-white hover:bg-teal-deep active:bg-teal-ink",
  secondary: "bg-white text-teal ring-2 ring-inset ring-teal hover:bg-sky",
  light: "bg-white text-teal-ink hover:bg-sky",
  "outline-light": "bg-transparent text-white ring-2 ring-inset ring-white/70 hover:bg-white/10",
  quiet: "bg-sky text-teal-ink hover:bg-sky-deep",
};

const sizes: Record<Size, string> = {
  md: "min-h-12 px-5 text-base",
  lg: "min-h-14 px-7 text-[1.0625rem]",
};

export function buttonClass(variant: Variant = "primary", size: Size = "md", className?: string) {
  return cn(base, variants[variant], sizes[size], className);
}

type CommonProps = { variant?: Variant; size?: Size; className?: string; children: ReactNode };

export function ButtonLink({
  href,
  variant,
  size,
  className,
  children,
  external,
  ...rest
}: CommonProps & { href: string; external?: boolean } & Omit<ComponentPropsWithoutRef<"a">, "href" | "className">) {
  const cls = buttonClass(variant, size, className);
  const isNative = external || href.startsWith("tel:") || href.startsWith("mailto:") || href.startsWith("http");
  if (isNative) {
    return (
      <a href={href} className={cls} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})} {...rest}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={cls} {...rest}>
      {children}
    </Link>
  );
}
