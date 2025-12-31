import { NextResponse } from "next/server";
import { getYearProgressFromTimestamp } from "@/lib/time";
import Redis from "ioredis";

const redis = new Redis(process.env.REDIS_URL ?? "");

export async function GET() {
  const ms = Date.now();

  const { year, percent, daysPassed, daysTotal } =
    getYearProgressFromTimestamp(ms);

  const currentInt = percent >= 99.8 ? 100 : Math.floor(percent);
  const raw = await redis.get("year-progress:last-int");
  const lastInt = raw !== null ? Number(raw) : -1;

  if (currentInt <= lastInt) {
    return NextResponse.json({
      skipped: true,
      percent: percent.toFixed(6),
      currentInt,
      lastInt,
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
        body: `${daysPassed} days completed, ${
          daysTotal - daysPassed
        } days remaining in ${year}.`,
        targetUrl: `${process.env.NEXT_PUBLIC_URL}`,
      }),
    }
  );

  await fetch(
    `${process.env.NEXT_PUBLIC_URL}/api/cast?key=${process.env.KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    }
  );
  await redis.set("year-progress:last-int", String(currentInt));
  return NextResponse.json({
    notified: true,
    percent: rounded,
  });
}
