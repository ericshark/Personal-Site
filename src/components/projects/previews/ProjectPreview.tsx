import Image from "next/image";
import type { PreviewVariant, Project } from "@/data/portfolio";
import { cn } from "@/lib/utils";
import AuthPreview from "./AuthPreview";
import BoardPreview from "./BoardPreview";
import ChartPreview from "./ChartPreview";
import DashboardPreview from "./DashboardPreview";
import GenerativePreview from "./GenerativePreview";
import LettersPreview from "./LettersPreview";
import OrbitPreview from "./OrbitPreview";
import TerminalPreview from "./TerminalPreview";
import TracePreview from "./TracePreview";
import WaveformPreview from "./WaveformPreview";
import { type PreviewProps, seedFrom } from "./shared";

const variants: Record<PreviewVariant, React.ComponentType<PreviewProps>> = {
  trace: TracePreview,
  auth: AuthPreview,
  terminal: TerminalPreview,
  dashboard: DashboardPreview,
  chart: ChartPreview,
  board: BoardPreview,
  orbit: OrbitPreview,
  letters: LettersPreview,
  generative: GenerativePreview,
  waveform: WaveformPreview,
};

/**
 * A project's screenshot: the real `image` when one exists, otherwise a
 * code-drawn mock. Colors come from the nearest `.accent-scope`.
 */
export default function ProjectPreview({
  project,
  className,
  sizes = "(min-width: 1024px) 50vw, 100vw",
}: {
  project: Project;
  className?: string;
  sizes?: string;
}) {
  const Variant = variants[project.preview];

  return (
    <div
      className={cn("preview-surface relative overflow-hidden", className)}
      aria-hidden={project.image ? undefined : true}
    >
      <div className="preview-stage absolute inset-0">
        {project.image ? (
          <Image
            src={project.image}
            alt={`Screenshot of ${project.name}`}
            fill
            sizes={sizes}
            className="object-cover"
          />
        ) : (
          <Variant seed={seedFrom(project.slug)} />
        )}
      </div>
    </div>
  );
}
