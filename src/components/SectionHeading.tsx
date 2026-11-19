/**
 * Numbered editorial section label: hairline rule, mono index, clear title.
 */
export default function SectionHeading({
  index,
  title,
  id,
}: {
  index: string;
  title: string;
  id: string;
}) {
  return (
    <div data-ui="section-heading" className="border-t border-neutral-200 pt-6">
      <h2 id={id} className="flex items-baseline gap-5 scroll-mt-28">
        <span
          aria-hidden="true"
          data-ui="section-index"
          data-code={index}
          className="font-mono text-xs text-neutral-400"
        >
          {index}
        </span>
        <span
          data-ui="section-title"
          className="font-display text-xl font-medium tracking-tight"
        >
          {title}
        </span>
      </h2>
    </div>
  );
}
