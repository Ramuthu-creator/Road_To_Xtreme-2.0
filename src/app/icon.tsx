import { ImageResponse } from "next/og";
import { readFileSync } from "fs";
import { join } from "path";

export const size = { width: 512, height: 512 };
export const contentType = "image/png";

export default function Icon() {
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
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "80px",
          border: "4px solid #fe5119",
        }}
      >
        <img src={logoSrc} style={{ width: "80%", objectFit: "contain" }} />
      </div>
    ),
    { ...size },
  );
}
