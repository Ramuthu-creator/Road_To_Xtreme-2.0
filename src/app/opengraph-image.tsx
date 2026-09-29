import { ImageResponse } from "next/og";
import { readFileSync } from "fs";
import { join } from "path";

export const alt = "Road to Xtreme 2.0";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  const logoData = readFileSync(
    join(process.cwd(), "public/assets/logos/ieeextreme-logo.png"),
  );
  const logoSrc = `data:image/png;base64,${logoData.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          background: "#0a0a0b",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          borderBottom: "12px solid #fe5119",
        }}
      >
        <img src={logoSrc} style={{ width: "60%", objectFit: "contain" }} />
        <div
          style={{
            marginTop: 40,
            fontSize: 32,
            fontFamily: "sans-serif",
            letterSpacing: "0.2em",
            color: "#fe5119",
            textTransform: "uppercase",
          }}
        >
          Outthink the challenge. Outcode the competition.
        </div>
      </div>
    ),
    { ...size },
  );
}
