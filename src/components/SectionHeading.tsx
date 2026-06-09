/**
 * Numbered editorial section label: hairline rule, mono index, title.
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
    <div className="border-t border-neutral-200 pt-6">
      <h2
        id={id}
        className="flex items-baseline gap-4 font-mono text-xs uppercase tracking-[0.2em] text-neutral-500"
      >
        <span aria-hidden="true">{index}</span>
        {title}
      </h2>
    </div>
  );
}
