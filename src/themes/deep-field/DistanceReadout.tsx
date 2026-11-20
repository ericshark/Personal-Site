"use client";

import { useEffect, useRef, useState } from "react";

/*
 * A small instrument panel, after Journey Through Space's readouts: as the page
 * scrolls from the top to Contact, the voyage runs from low Earth orbit to the
 * galactic centre. Distance interpolates logarithmically between stops, so it
 * keeps accelerating. Decorative (aria-hidden), desktop only, homepage only.
 */

const KM_PER_AU = 1.495978707e8;
const KM_PER_LY = 9.4607e12;

/** Stops in page order; `id` is the section heading the stop is pinned to. */
const STOPS = [
  { id: null, name: "EARTH · LEO", km: 400 },
  { id: "projects", name: "MARS", km: 1.52 * KM_PER_AU },
  { id: "experience", name: "VOYAGER 1", km: 169 * KM_PER_AU },
  { id: "education", name: "ORION NEBULA", km: 1344 * KM_PER_LY },
  { id: "contact", name: "SGR A*", km: 26670 * KM_PER_LY },
] as const;

const pad = (value: number) => String(value).padStart(2, "0");

function formatDistance(km: number) {
  if (km < 1e7) return `${Math.round(km).toLocaleString("en-US")} km`;
  const au = km / KM_PER_AU;
  if (au < 1000) return `${au.toFixed(au < 10 ? 2 : au < 100 ? 1 : 0)} AU`;
  const ly = km / KM_PER_LY;
  if (ly < 0.01) return `${Math.round(au).toLocaleString("en-US")} AU`;
  return `${ly < 10 ? ly.toFixed(2) : Math.round(ly).toLocaleString("en-US")} ly`;
}

export default function DistanceReadout() {
  // Only the homepage has the stops; case studies get no readout.
  const [enabled, setEnabled] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const distRef = useRef<HTMLElement>(null);
  const velRef = useRef<HTMLElement>(null);
  const stopRef = useRef<HTMLElement>(null);

  useEffect(() => {
    setEnabled(document.getElementById("projects") !== null);
  }, []);

  useEffect(() => {
    if (!enabled) return;
    let frame = 0;
    let lastTime = 0;
    let lastScroll = window.scrollY;
    let velocity = 0;

    // The colophon is the end of the voyage: the panel steps aside for it.
    const colophon = document.querySelector('[data-ui~="colophon"]');
    const observer = new IntersectionObserver(([entry]) => {
      panelRef.current?.toggleAttribute("data-docked", entry.isIntersecting);
    });
    if (colophon) observer.observe(colophon);

    function anchors() {
      const threshold = window.innerHeight * 0.4;
      return STOPS.map((stop) => {
        if (!stop.id) return 0;
        const heading = document.getElementById(stop.id);
        return heading
          ? heading.getBoundingClientRect().top + window.scrollY - threshold
          : Infinity;
      });
    }

    function update(now: number) {
      frame = requestAnimationFrame(update);
      const dt = lastTime ? Math.min((now - lastTime) / 1000, 0.1) : 1 / 60;
      lastTime = now;
      const scroll = window.scrollY;
      velocity +=
        ((scroll - lastScroll) / dt - velocity) * (1 - Math.exp(-dt / 0.15));
      lastScroll = scroll;

      const points = anchors();
      const atBottom =
        window.innerHeight + scroll >=
        document.documentElement.scrollHeight - 2;
      let index = 0;
      for (let i = 0; i < points.length; i++)
        if (scroll >= points[i]) index = i;
      if (atBottom) index = STOPS.length - 1;

      let km: number = STOPS[index].km;
      const next = STOPS[index + 1];
      if (next && !atBottom && Number.isFinite(points[index + 1])) {
        const span = points[index + 1] - points[index];
        const t = span > 0 ? Math.min(1, (scroll - points[index]) / span) : 0;
        km = Math.exp(
          Math.log(STOPS[index].km) +
            (Math.log(next.km) - Math.log(STOPS[index].km)) * t,
        );
      }

      if (distRef.current) distRef.current.textContent = formatDistance(km);
      if (velRef.current)
        velRef.current.textContent = `${Math.min(0.99, Math.abs(velocity) / 4000).toFixed(2)} c`;
      if (stopRef.current)
        stopRef.current.textContent = `${pad(index)} / ${pad(STOPS.length - 1)} · ${STOPS[index].name}`;
    }

    frame = requestAnimationFrame(update);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, [enabled]);

  if (!enabled) return null;
  return (
    <div ref={panelRef} data-ui="df-readout" aria-hidden="true">
      <dl>
        <div>
          <dt>Dist</dt>
          <dd ref={distRef}>400 km</dd>
        </div>
        <div>
          <dt>Vel</dt>
          <dd ref={velRef}>0.00 c</dd>
        </div>
        <div>
          <dt>Stop</dt>
          <dd ref={stopRef}>00 / 04 · EARTH · LEO</dd>
        </div>
      </dl>
    </div>
  );
}
