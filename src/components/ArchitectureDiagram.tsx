import { ArrowDown, ArrowRight } from "lucide-react";
import type { Architecture, ArchitectureNode } from "@/data/portfolio";

function Node({ node }: { node: ArchitectureNode }) {
  return (
    <div
      className={`rounded-md border bg-paper px-3 py-2 text-center text-ink ${
        node.dashed ? "border-dashed border-neutral-400" : "border-neutral-300"
      }`}
    >
      {node.label}
      {node.detail && (
        <div className="mt-0.5 text-neutral-500">{node.detail}</div>
      )}
    </div>
  );
}

/**
 * Compact flow diagram drawn from data. Row 0 runs left to right; row 1 nodes
 * hang below a column of row 0. On narrow screens it collapses to a vertical list.
 */
export default function ArchitectureDiagram({
  architecture,
}: {
  architecture: Architecture;
}) {
  const { nodes, edges } = architecture;
  const main = nodes.filter((n) => n.row === 0);
  const below = nodes.filter((n) => n.row === 1);
  const edgeInto = (id: string) => edges.find((e) => e.to === id);

  return (
    // The image role gives the whole diagram one text alternative.
    <div
      role="img"
      aria-label={architecture.alt}
      className="font-mono text-[11px] leading-snug"
    >
      <ol className="space-y-1 sm:hidden">
        {nodes.map((node, i) => {
          const edge = i > 0 ? edgeInto(node.id) : undefined;
          return (
            <li key={node.id}>
              {edge && (
                <div className="flex items-center gap-1.5 py-0.5 pl-3 text-neutral-500">
                  <ArrowDown size={12} strokeWidth={1.5} />
                  {edge.label}
                </div>
              )}
              <Node node={node} />
            </li>
          );
        })}
      </ol>

      <div
        className="hidden items-center gap-x-2 gap-y-1 sm:grid"
        style={{
          gridTemplateColumns: main
            .map((_, i) => (i < main.length - 1 ? "1fr auto" : "1fr"))
            .join(" "),
        }}
      >
        {main.map((node, i) => {
          const next = main[i + 1];
          const edge = next && edgeInto(next.id);
          return (
            <div key={node.id} className="contents">
              <Node node={node} />
              {next && (
                <div className="flex flex-col items-center text-neutral-500">
                  {edge && edge.label && (
                    <span className="text-[10px]">{edge.label}</span>
                  )}
                  <ArrowRight size={14} strokeWidth={1.5} />
                </div>
              )}
            </div>
          );
        })}

        {below.map((node) => {
          const edge = edgeInto(node.id);
          // Row 0 occupies two grid tracks per node (node + arrow).
          const track = (node.col ?? 0) * 2 + 1;
          return (
            <div
              key={node.id}
              className="mt-1.5 flex flex-col items-center gap-1"
              style={{ gridColumn: track, gridRow: 2 }}
            >
              <span className="flex items-center gap-1 text-[10px] text-neutral-500">
                <ArrowDown size={12} strokeWidth={1.5} />
                {edge?.label}
              </span>
              <div className="w-full">
                <Node node={node} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
