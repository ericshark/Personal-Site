// Each word starts with the last letter of the one before it.
const words = ["STORM", "MAPLE", "EMBER"];

/** Word-game tiles that flip in row by row; the linking letters are highlighted. */
export default function LettersPreview() {
  return (
    <div className="flex h-full items-center justify-center p-4">
      <div className="grid w-full max-w-[13rem] gap-1.5 [perspective:400px]">
        {words.map((word, row) => (
          <div key={word} className="grid grid-cols-5 gap-1.5">
            {[...word].map((letter, col) => {
              const isLink =
                (col === 4 && row < words.length - 1) || (col === 0 && row > 0);
              return (
                <span
                  key={col}
                  className={`grid aspect-square animate-[pv-flip_6s_var(--ease-soft)_infinite_both] place-items-center rounded-md border font-mono text-xs font-medium sm:text-sm ${
                    isLink
                      ? "border-transparent bg-[var(--pv)] text-paper"
                      : "border-neutral-300 bg-paper text-ink"
                  }`}
                  style={{ animationDelay: `${row * 0.45 + col * 0.08}s` }}
                >
                  {letter}
                </span>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
