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
    <div className="border-t border-neutral-300/80 pt-6">
      <h2
        id={id}
        className="grid scroll-mt-[88px] grid-cols-[2rem_minmax(0,1fr)] items-baseline gap-x-3 md:grid-cols-[10rem_minmax(0,1fr)] md:gap-x-12"
      >
        <span
          aria-hidden="true"
          className="font-mono text-[11px] text-neutral-500"
        >
          {index}
        </span>
        <span className="text-base font-medium tracking-tight sm:text-lg">
          {title}
        </span>
      </h2>
    </div>
  );
}
