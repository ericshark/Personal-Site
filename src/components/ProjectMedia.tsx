import ProjectVisual from "@/components/ProjectVisuals";
import type { Project } from "@/data/portfolio";

// Encoded sizes written by scripts/capture-projects.mjs. Keep the two in sync.
export const MEDIA_SIZES = {
  thumb: { width: 480, height: 300 },
  media: { width: 1280, height: 800 },
} as const;

/**
 * Pre-encoded screenshot as AVIF/WebP, or a designed visual. Fills a parent
 * that sets the frame size. A plain <img> because the static export has no
 * image optimiser; the files are already encoded at display size.
 */
export function Screenshot({
  src,
  alt,
  variant,
  eager = false,
  className = "h-full w-full object-cover object-top",
}: {
  src: string;
  alt: string;
  variant: keyof typeof MEDIA_SIZES;
  eager?: boolean;
  className?: string;
}) {
  const { width, height } = MEDIA_SIZES[variant];
  const base = `${src}-${variant}`;
  return (
    <picture>
      <source srcSet={`${base}.avif`} type="image/avif" />
      <img
        src={`${base}.webp`}
        alt={alt}
        width={width}
        height={height}
        loading={eager ? "eager" : "lazy"}
        fetchPriority={eager ? "high" : "auto"}
        decoding={eager ? "sync" : "async"}
        className={className}
      />
    </picture>
  );
}

export default function ProjectMedia({
  project,
  variant,
  eager = false,
}: {
  project: Project;
  variant: keyof typeof MEDIA_SIZES;
  eager?: boolean;
}) {
  const { media } = project;
  if (media.type !== "image") {
    return <ProjectVisual type={media.type} compact={variant === "thumb"} />;
  }
  return (
    <Screenshot
      src={media.src}
      alt={media.alt}
      variant={variant}
      eager={eager}
    />
  );
}
