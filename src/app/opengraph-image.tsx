import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";
import { profile, siteMeta } from "@/data/portfolio";

export const dynamic = "force-static";
export const alt = siteMeta.title;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Rendered once at build time (static export), so reading fonts from node_modules is safe.
const geistDir = path.join(
  process.cwd(),
  "node_modules/geist/dist/fonts/geist-sans",
);

export default async function OpengraphImage() {
  const [regular, semiBold] = await Promise.all([
    readFile(path.join(geistDir, "Geist-Regular.ttf")),
    readFile(path.join(geistDir, "Geist-SemiBold.ttf")),
  ]);

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: 80,
        background: "#fafaf9",
        color: "#18181b",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: 88,
          height: 88,
          borderRadius: 20,
          background: "#18181b",
          color: "#fafaf9",
          fontSize: 34,
          fontWeight: 600,
        }}
      >
        EZ
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        <div style={{ fontSize: 60, fontWeight: 600, letterSpacing: -1.5 }}>
          {profile.name}
        </div>
        <div style={{ fontSize: 34, color: "#525252", maxWidth: 960 }}>
          {profile.headline}
        </div>
      </div>
    </div>,
    {
      ...size,
      fonts: [
        { name: "Geist", data: regular, weight: 400 },
        { name: "Geist", data: semiBold, weight: 600 },
      ],
    },
  );
}
