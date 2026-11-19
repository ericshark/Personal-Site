/**
 * World Observatory's brand glyph (circle, meridian, latitudes) scaled into a
 * large wireframe globe fixed to the right edge. Phase-offset meridians squeeze
 * and widen so it reads as slowly spinning. Desktop only (see theme.css).
 */

const SPIN_SECONDS = 14;
const MERIDIANS = 4;

export default function Globe() {
  return (
    <div data-ui="obs-globe" aria-hidden="true">
      <svg viewBox="0 0 32 32" fill="none">
        <circle cx="16" cy="16" r="11" />
        {Array.from({ length: MERIDIANS }, (_, i) => (
          <ellipse key={i} cx="16" cy="16" rx="11" ry="11">
            <animate
              attributeName="rx"
              values="11;0;11"
              keyTimes="0;0.5;1"
              calcMode="spline"
              keySplines="0.45 0 0.55 1;0.45 0 0.55 1"
              dur={`${SPIN_SECONDS}s`}
              begin={`${(-SPIN_SECONDS / MERIDIANS) * i}s`}
              repeatCount="indefinite"
            />
          </ellipse>
        ))}
        <path d="M5 16h22M7 10h18M7 22h18M9.6 6.6h12.8M9.6 25.4h12.8" />
      </svg>
    </div>
  );
}
