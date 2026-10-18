import { ImageResponse } from "next/og";

export const alt = "HAPPI CLINIC AND DIAGNOSTICS, Alwal, Secunderabad";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", background: "#EAF7FA", padding: 72, fontFamily: "sans-serif" }}>
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", width: "100%", background: "#087F8C", borderRadius: 36, padding: 64, color: "white" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
            <div style={{ width: 84, height: 84, borderRadius: 22, background: "white", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
              <div style={{ position: "absolute", width: 14, height: 46, background: "#087F8C", borderRadius: 4, top: 14 }} />
              <div style={{ position: "absolute", width: 46, height: 14, background: "#087F8C", borderRadius: 4, top: 30 }} />
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div style={{ fontSize: 52, fontWeight: 800, letterSpacing: 2 }}>HAPPI</div>
              <div style={{ fontSize: 22, letterSpacing: 4, opacity: 0.85 }}>CLINIC AND DIAGNOSTICS</div>
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 76, fontWeight: 800, lineHeight: 1.05 }}>Your Health, Our Priority.</div>
            <div style={{ fontSize: 32, marginTop: 20, opacity: 0.9 }}>Golnaka, Alwal, Secunderabad · +91 99514 71400</div>
          </div>
        </div>
      </div>
    ),
    size,
  );
}
