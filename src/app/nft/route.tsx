import { getYearProgressFromTimestamp } from "@/lib/time";
import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  const t = Number(req.nextUrl.searchParams.get("t"));

  const ms = Number.isFinite(t) ? t * 1000 : Date.now();

  const { year, percent } = getYearProgressFromTimestamp(ms);

  return new ImageResponse(
    (
      <div
        style={{
          width: "1000px",
          height: "1000px",
          backgroundColor: "#0f172a",
          color: "#ffffff",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontFamily: "Inter, sans-serif",
        }}
      >
        {/* Card */}
        <div
          style={{
            width: "820px",
            padding: "72px",
            backgroundColor: "#020617",
            borderRadius: "36px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "56px",
            boxShadow: "0 30px 80px rgba(0,0,0,0.5)",
          }}
        >
          {/* Header */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "16px",
            }}
          >
            <div
              style={{
                fontSize: 64,
                fontWeight: 900,
                letterSpacing: "-0.03em",
                display: "flex",
                justifyContent: "center",
              }}
            >
              {year} Progress
            </div>
          </div>

          {/* Progress */}
          <div
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              gap: "32px",
            }}
          >
            {/* Track */}
            <div
              style={{
                width: "100%",
                height: "56px",
                backgroundColor: "#020617",
                borderRadius: "16px",
                padding: "6px",
                border: "2px solid #4ade80",
                display: "flex",
                boxSizing: "border-box",
              }}
            >
              {/* Fill */}
              <div
                style={{
                  width: `${percent}%`,
                  backgroundColor: "#4ade80",
                  borderRadius: "16px",
                  display: "flex",
                }}
              />
            </div>

            {/* Percentage */}
            <div
              style={{
                fontSize: 52,
                fontWeight: 800,
                color: "#4ade80",
                display: "flex",
                justifyContent: "center",
              }}
            >
              {percent.toFixed(0)}%
            </div>
          </div>
        </div>
      </div>
    ),
    {
      width: 1000,
      height: 1000,
    }
  );
}
