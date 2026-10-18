/** Flat illustration of a neighbourhood clinic front. Decorative only. */
export function ClinicIllustration({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 480 400" className={className} aria-hidden="true">
      <rect x="0" y="0" width="480" height="400" rx="28" fill="#EAF7FA" />
      <circle cx="390" cy="88" r="44" fill="#DDF4EE" />
      {/* building */}
      <rect x="92" y="112" width="296" height="228" rx="10" fill="#FFFFFF" />
      <rect x="92" y="112" width="296" height="44" rx="10" fill="#087F8C" />
      <rect x="92" y="140" width="296" height="16" fill="#087F8C" />
      <text x="240" y="141" textAnchor="middle" fontFamily="Manrope Variable, Manrope, sans-serif" fontWeight="800" fontSize="20" letterSpacing="2" fill="#FFFFFF">HAPPI</text>
      {/* awning */}
      <path d="M100 156 h280 l-12 28 h-256 z" fill="#43BFA7" />
      <path d="M100 156 h40 l-6 28 h-34 z M180 156 h40 l-2 28 h-40 z M260 156 h40 l2 28 h-40 z M340 156 h40 l-12 28 h-30 z" fill="#FFFFFF" opacity="0.45" />
      {/* windows */}
      <rect x="118" y="206" width="92" height="74" rx="6" fill="#D3EDF3" />
      <path d="M164 206 v74 M118 243 h92" stroke="#FFFFFF" strokeWidth="4" />
      {/* door */}
      <rect x="246" y="206" width="76" height="134" rx="6" fill="#17324D" />
      <rect x="254" y="216" width="60" height="58" rx="4" fill="#D3EDF3" opacity="0.35" />
      <circle cx="306" cy="290" r="4" fill="#43BFA7" />
      {/* plus sign */}
      <rect x="338" y="214" width="34" height="34" rx="8" fill="#087F8C" />
      <rect x="352" y="220" width="6" height="22" rx="1.5" fill="#FFFFFF" />
      <rect x="344" y="228" width="22" height="6" rx="1.5" fill="#FFFFFF" />
      {/* step and ground */}
      <rect x="236" y="336" width="96" height="10" rx="3" fill="#D4E7EC" />
      <rect x="40" y="344" width="400" height="6" rx="3" fill="#D4E7EC" />
      {/* tree */}
      <rect x="58" y="270" width="8" height="76" rx="3" fill="#17324D" opacity="0.8" />
      <circle cx="62" cy="258" r="30" fill="#43BFA7" />
      <circle cx="44" cy="276" r="18" fill="#43BFA7" opacity="0.8" />
      {/* bench pot */}
      <rect x="402" y="300" width="30" height="44" rx="6" fill="#087F8C" opacity="0.85" />
      <circle cx="417" cy="290" r="18" fill="#43BFA7" />
    </svg>
  );
}
