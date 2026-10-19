/** Stable small integer from a string, so previews vary per project without Math.random (which would break hydration). */
export function seedFrom(text: string) {
  let hash = 0;
  for (const char of text) {
    hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  }
  return hash % 1000;
}

/** Smooth pseudo-random series in [0, 1], built from a few summed sines. */
export function series(seed: number, count: number) {
  return Array.from({ length: count }, (_, i) => {
    const value =
      Math.sin(i * 0.55 + seed) * 0.5 +
      Math.sin(i * 1.3 + seed * 1.7) * 0.3 +
      Math.sin(i * 0.21 + seed * 0.3) * 0.2;
    return (value + 1) / 2;
  });
}

/** SVG polyline points for values in [0, 1] across a width × height box (y grows downward). */
export function toPoints(
  values: number[],
  width: number,
  height: number,
  padding = 0.12,
) {
  return values
    .map((value, i) => {
      const x = (i / (values.length - 1)) * width;
      const y = height * (1 - padding - value * (1 - padding * 2));
      return `${x.toFixed(2)},${y.toFixed(2)}`;
    })
    .join(" ");
}

export type PreviewProps = {
  seed: number;
};
