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
    <div className="border-t border-neutral-200 pt-8">
      <h2 id={id} className="flex items-baseline gap-5 scroll-mt-24">
        <span aria-hidden="true" className="font-mono text-xs text-neutral-400">
          {index}
        </span>
        <span className="text-xl font-medium tracking-tight">{title}</span>
      </h2>
    </div>
  );
}
