import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  // Read timestamp from query (?t=1700000000)
  const tParam = req.nextUrl.searchParams.get("t");

  const timestamp = tParam ? Number(tParam) * 1000 : Date.now();

  // Fallback safety
  const now = new Date(Number.isFinite(timestamp) ? timestamp : Date.now());

  // UTC-only year progress calculation
  const year = now.getUTCFullYear();
  const start = Date.UTC(year, 0, 1);
  const end = Date.UTC(year + 1, 0, 1);

  const dayMs = 1000 * 60 * 60 * 24;
  const totalDays = Math.floor((end - start) / dayMs);
  const passedDays = Math.floor(
    (Date.UTC(year, now.getUTCMonth(), now.getUTCDate()) - start) / dayMs
  );

  const percent = Number(
    Math.min(100, (passedDays / totalDays) * 100).toFixed(2)
  );

  return NextResponse.json({
    name: `Year Progress: ${year}`,
    description: "A simple visualization of the year’s progress.",
    image: `https://year.itscashless.com/nft?t=${tParam}`,
    attributes: [
      { trait_type: "Year", value: year },
      { trait_type: "Progress", value: `${percent}%` },
      {
        display_type: "date",
        trait_type: "Snapshot Time",
        value: Math.floor(timestamp / 1000),
      },
    ],
  });
}
