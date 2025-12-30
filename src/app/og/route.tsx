import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";
import { getYearProgressFromTimestamp } from "@/lib/time";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  const t = Number(req.nextUrl.searchParams.get("t"));

  const ms = Number.isFinite(t) ? t * 1000 : Date.now();

  const { year, percent } = getYearProgressFromTimestamp(ms);
  const displayProgressInt = Math.floor(percent);

  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "800px",
          backgroundColor: "#0f172a",
          color: "#ffffff",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontFamily: "Inter, sans-serif",
          textAlign: "center",
        }}
      >
        {/* Main Card */}
        <div
          style={{
            width: "100%",
            maxWidth: "900px",
            padding: "80px",
            backgroundColor: "#020617",
            borderRadius: "32px",
            display: "flex",
            flexDirection: "column",
            gap: "56px",
            boxShadow: "0 24px 70px rgba(0,0,0,0.45)",
          }}
        >
          {/* Header */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center", // ✅ horizontal center
              gap: "12px",
            }}
          >
            <div
              style={{
                fontSize: 64,
                fontWeight: 900,
                letterSpacing: "-0.03em",
                display: "flex",
                justifyContent: "center", // ✅ center text node
              }}
            >
              {year} Progress
            </div>
          </div>

          {/* Progress Section */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "28px",
            }}
          >
            {/* Progress Track */}
            <div
              style={{
                width: "100%",
                height: "64px",
                backgroundColor: "#020617",
                borderRadius: "16px",
                display: "flex",
                padding: "4px",
                border: "2px solid #4ade80", // <-- visible incomplete border
                boxSizing: "border-box",
              }}
            >
              {/* Progress Fill */}
              <div
                style={{
                  width: `${displayProgressInt}%`,
                  backgroundColor: "#4ade80",
                  borderRadius: "12px",
                  display: "flex",
                }}
              />
            </div>

            {/* Percentage */}
            <div
              style={{
                fontSize: 48,
                fontWeight: 800,
                color: "#4ade80",
                display: "flex",
                justifyContent: "center", // ✅ center text
              }}
            >
              {displayProgressInt}%
            </div>
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 800,
    }
  );
}
