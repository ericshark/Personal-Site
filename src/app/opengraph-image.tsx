import { ImageResponse } from "next/og";
import { profile, siteMeta } from "@/data/portfolio";

export const alt = siteMeta.title;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "80px",
          backgroundColor: "#fafaf9",
          color: "#18181b",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            fontSize: 28,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "#737373",
          }}
        >
          {`${profile.role} — ${profile.location}`}
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "24px",
          }}
        >
          <div style={{ fontSize: 88, fontWeight: 600, letterSpacing: "-0.02em" }}>
            {profile.name}
          </div>
          <div style={{ fontSize: 34, color: "#525252", maxWidth: "900px" }}>
            Backend-heavy systems, automation tools, and full-stack products.
          </div>
        </div>
        <div style={{ height: 4, width: 120, backgroundColor: "#1d4ed8" }} />
      </div>
    ),
    size
  );
}
