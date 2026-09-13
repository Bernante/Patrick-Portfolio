import { ImageResponse } from "next/og";
import { site } from "@/lib/site";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = `${site.name} — ${site.role}`;

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#FFF1A6",
          padding: "72px 80px",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <div
            style={{
              width: 96,
              height: 96,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 999,
              background: "#6B352A",
              color: "#FFF1A6",
              fontSize: 42,
              fontWeight: 700,
            }}
          >
            PB
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 40, fontWeight: 700, color: "#3A1C16" }}>{site.name}</div>
            <div style={{ fontSize: 26, color: "#5E4036" }}>{site.shortRole}</div>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            fontSize: 82,
            fontWeight: 700,
            color: "#3A1C16",
            lineHeight: 1.08,
            letterSpacing: "-0.03em",
          }}
        >
          {site.tagline}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          {["AI Automation", "Web Development", "Video Editing"].map((tag) => (
            <div
              key={tag}
              style={{
                display: "flex",
                background: "#6B352A",
                color: "#FFF1A6",
                fontSize: 28,
                fontWeight: 600,
                padding: "14px 28px",
                borderRadius: 999,
              }}
            >
              {tag}
            </div>
          ))}
        </div>
      </div>
    ),
    size,
  );
}
