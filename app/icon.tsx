import { ImageResponse } from "next/og"

export const runtime = "edge"
export const size = { width: 32, height: 32 }
export const contentType = "image/png"

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 7,
          background: "linear-gradient(135deg, #2563EB 0%, #7C3AED 100%)",
        }}
      >
        <div
          style={{
            width: 13,
            height: 7,
            marginTop: -2,
            borderLeft: "3px solid white",
            borderBottom: "3px solid white",
            transform: "rotate(-45deg)",
          }}
        />
      </div>
    ),
    { ...size }
  )
}
