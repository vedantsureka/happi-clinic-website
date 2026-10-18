export function MapEmbed({ src, title, className }: { src: string; title: string; className?: string }) {
  return (
    <div className={`relative overflow-hidden rounded-[var(--radius-panel)] border border-line bg-sky ${className ?? ""}`}>
      <iframe
        src={src}
        title={title}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        className="absolute inset-0 size-full border-0"
        allowFullScreen
      />
    </div>
  );
}
