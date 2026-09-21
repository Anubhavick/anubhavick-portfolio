import { ImageResponse } from "next/og";
import type { NextRequest } from "next/server";

/**
 * next/og renders through Satori, which has no access to the page's CSS —
 * it can't read the `--color-*` custom properties in app/globals.css, so
 * these are that file's dark-theme values duplicated here by necessity.
 * Keep them in sync with globals.css by hand; this is the one place
 * outside globals.css a literal color value is allowed to live.
 */
const COLORS = {
  surface1: "#131F2B",
  ink: "#E8F0F6",
  inkMuted: "#8CA3B5",
  hairline: "#26384A",
  accent: "#0A84FF",
};

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const title = (searchParams.get("title") ?? "Anubhav Mishra").slice(0, 120);
  const kind = (searchParams.get("kind") ?? "Portfolio").slice(0, 160);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px",
          backgroundColor: COLORS.surface1,
          backgroundImage: `linear-gradient(180deg, ${COLORS.accent}33 0%, ${COLORS.surface1} 55%)`,
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ width: 16, height: 16, borderRadius: 4, backgroundColor: COLORS.accent, display: "flex" }} />
          <span style={{ fontSize: 28, color: COLORS.inkMuted, letterSpacing: 3 }}>
            ANUBHAV MISHRA
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
          <span style={{ fontSize: 62, fontWeight: 700, color: COLORS.ink, lineHeight: 1.15, maxWidth: 1000 }}>
            {title}
          </span>
          <span style={{ fontSize: 30, color: COLORS.accent, maxWidth: 1000 }}>{kind}</span>
        </div>

        <div
          style={{
            display: "flex",
            borderTop: `1px solid ${COLORS.hairline}`,
            paddingTop: 24,
            fontSize: 22,
            color: COLORS.inkMuted,
          }}
        >
          anubhavick.vercel.app
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
