import { ImageResponse } from "next/og";

export const size = { width: 512, height: 512 };
export const contentType = "image/png";

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
          background: "#6B352A",
          color: "#FFF1A6",
          fontSize: 230,
          fontWeight: 700,
          letterSpacing: "-0.04em",
        }}
      >
        PB
      </div>
    ),
    size,
  );
}
