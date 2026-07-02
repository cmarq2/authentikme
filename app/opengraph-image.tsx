import { ImageResponse } from "next/og"

export const runtime = "edge"
export const alt = "AuthentikMe – Identity Verification for Job Seekers"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#0B1120",
          backgroundImage:
            "radial-gradient(circle at 25% 20%, rgba(37,99,235,0.35), transparent 50%), radial-gradient(circle at 80% 80%, rgba(124,58,237,0.3), transparent 50%)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 96,
            height: 96,
            borderRadius: 22,
            marginBottom: 36,
            background: "linear-gradient(135deg, #2563EB 0%, #7C3AED 100%)",
          }}
        >
          <div
            style={{
              width: 38,
              height: 21,
              marginTop: -5,
              borderLeft: "8px solid white",
              borderBottom: "8px solid white",
              transform: "rotate(-45deg)",
            }}
          />
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 72,
            fontWeight: 700,
            color: "white",
            letterSpacing: -1,
          }}
        >
          Authentik<span style={{ color: "#60A5FA" }}>Me</span>
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 20,
            fontSize: 30,
            color: "#CBD5E1",
          }}
        >
          Prove You Are Real. The Authentik You.
        </div>
      </div>
    ),
    { ...size }
  )
}
