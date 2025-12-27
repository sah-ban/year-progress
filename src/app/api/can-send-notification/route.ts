import { NextResponse } from "next/server";

export const runtime = "edge";

export async function GET() {
  const now = new Date();

  // UTC year calculation
  const year = now.getUTCFullYear();
  const start = Date.UTC(year, 0, 1);
  const end = Date.UTC(year + 1, 0, 1);

  const dayMs = 1000 * 60 * 60 * 24;
  const totalDays = (end - start) / dayMs;

  const passedDays =
    (Date.UTC(year, now.getUTCMonth(), now.getUTCDate()) - start) / dayMs;

  const percent = (passedDays / totalDays) * 100;

  // ✅ decimal part is zero (with tolerance)
  const isWholePercent = Math.abs(percent - Math.round(percent)) < 0.0001;

  if (!isWholePercent) {
    return NextResponse.json({
      skipped: true,
      percent: percent.toFixed(6),
    });
  }

  const rounded = Math.round(percent);

  await fetch(
    `${process.env.NEXT_PUBLIC_URL}/api/send-notifications?key=${process.env.KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: `${year} is ${rounded}% complete!`,
        body: `${passedDays} days completed, ${
          totalDays - passedDays
        } days remaining in ${year}.`,
        targetUrl: `${process.env.NEXT_PUBLIC_URL}`,
      }),
    }
  );

  return NextResponse.json({
    notified: true,
    percent: rounded,
  });
}
