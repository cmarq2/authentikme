import { ImageResponse } from "next/og"

export const runtime = "edge"
export const size = { width: 180, height: 180 }
export const contentType = "image/png"

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 40,
          background: "linear-gradient(135deg, #2563EB 0%, #7C3AED 100%)",
        }}
      >
        <div
          style={{
            width: 72,
            height: 40,
            marginTop: -10,
            borderLeft: "16px solid white",
            borderBottom: "16px solid white",
            transform: "rotate(-45deg)",
          }}
        />
      </div>
    ),
    { ...size }
  )
}
