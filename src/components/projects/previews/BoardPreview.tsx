type Car = {
  x: number;
  y: number;
  length: number;
  vertical?: boolean;
  role?: "red" | "block";
};

// A 6×6 rush-hour board. The "block" car slides down out of row 2, then the
// red car drives through to the exit and back (keyframes in globals.css).
const cars: Car[] = [
  { x: 0, y: 2, length: 2, role: "red" },
  { x: 4, y: 1, length: 2, vertical: true, role: "block" },
  { x: 0, y: 0, length: 3 },
  { x: 3, y: 0, length: 2, vertical: true },
  { x: 5, y: 3, length: 3, vertical: true },
  { x: 1, y: 3, length: 2, vertical: true },
  { x: 2, y: 4, length: 2 },
  { x: 2, y: 5, length: 2 },
];

const cell = 100 / 6;

export default function BoardPreview() {
  return (
    <div className="flex h-full items-center justify-center p-4">
      <div className="relative aspect-square h-full max-h-full max-w-full rounded-xl border border-neutral-300 bg-neutral-100 p-1.5 shadow-inner">
        <div className="relative h-full w-full">
          {Array.from({ length: 36 }, (_, i) => (
            <span
              key={i}
              className="absolute p-[2px]"
              style={{
                left: `${(i % 6) * cell}%`,
                top: `${Math.floor(i / 6) * cell}%`,
                width: `${cell}%`,
                height: `${cell}%`,
              }}
            >
              <span className="block h-full w-full rounded-[3px] bg-paper/70" />
            </span>
          ))}
          {cars.map((car) => (
            <span
              key={`${car.x}-${car.y}`}
              className={`absolute p-[3px] ${
                car.role === "red"
                  ? "animate-[pv-car-red_5s_var(--ease-soft)_infinite]"
                  : car.role === "block"
                    ? "animate-[pv-car-block_5s_var(--ease-soft)_infinite]"
                    : ""
              }`}
              style={{
                left: `${car.x * cell}%`,
                top: `${car.y * cell}%`,
                width: `${(car.vertical ? 1 : car.length) * cell}%`,
                height: `${(car.vertical ? car.length : 1) * cell}%`,
              }}
            >
              <span
                className={`block h-full w-full rounded-md shadow-sm ${
                  car.role === "red"
                    ? "bg-[var(--pv)]"
                    : "border border-neutral-300 bg-neutral-200"
                }`}
              />
            </span>
          ))}
          <span
            aria-hidden="true"
            className="absolute -right-2.5 w-1 rounded-full bg-[var(--pv)]"
            style={{ top: `${2 * cell + 3}%`, height: `${cell - 6}%` }}
          />
        </div>
      </div>
    </div>
  );
}
