import Image from "next/image";

interface AvatarProps {
  size?: number;
  src?: string;
}

export function Avatar({ size = 88, src }: AvatarProps) {
  if (src) {
    return (
      <Image
        src={src}
        alt="Matt Wilson"
        width={size}
        height={size}
        className="rounded-full object-cover"
        style={{ width: size, height: size }}
      />
    );
  }

  return (
    <div
      className="flex items-center justify-center rounded-full border border-[var(--color-border)] bg-[var(--color-card)]"
      style={{ width: size, height: size }}
      aria-label="Matt Wilson avatar placeholder"
      role="img"
    >
      <span
        className="select-none font-semibold text-[var(--color-muted)]"
        style={{ fontSize: Math.round(size * 0.3) }}
      >
        MW
      </span>
    </div>
  );
}
