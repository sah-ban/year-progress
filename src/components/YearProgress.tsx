"use client";

import React, { useEffect, useState } from "react";
import sdk from "@farcaster/miniapp-sdk";
import MintButton from "./MintButton";

const YearProgress = () => {
  const [progress, setProgress] = useState(0);
  const [displayProgress, setDisplayProgress] = useState(0);
  const [daysPassed, setDaysPassed] = useState(0);
  const [daysTotal, setDaysTotal] = useState(365);
  const [year, setYear] = useState(0);
  const [dateLabel, setDateLabel] = useState("");
  const mintedAt = Math.floor(Date.now() / 1000);

  useEffect(() => {
    const calculate = () => {
      const now = new Date();

      // UTC midnight (same day for everyone)
      const utcToday = new Date(
        Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())
      );

      const y = utcToday.getUTCFullYear();
      const start = new Date(Date.UTC(y, 0, 1));
      const end = new Date(Date.UTC(y + 1, 0, 1));

      const dayMs = 1000 * 60 * 60 * 24;

      const total = Math.floor((end.getTime() - start.getTime()) / dayMs);
      const passed = Math.min(
        total,
        Math.floor((utcToday.getTime() - start.getTime()) / dayMs)
      );

      const percent = (passed / total) * 100;

      setYear(y);
      setDaysPassed(passed);
      setDaysTotal(total);
      setProgress(percent);

      setDateLabel(
        utcToday.toLocaleDateString("en-US", {
          weekday: "long",
          month: "long",
          day: "numeric",
          timeZone: "UTC",
        })
      );
    };

    calculate();
    const timer = setInterval(calculate, 60 * 60 * 1000);
    return () => clearInterval(timer);
  }, []);

  // Smooth percentage animation
  useEffect(() => {
    let frame: number;
    const animate = () => {
      setDisplayProgress((prev) => {
        if (Math.abs(prev - progress) < 0.1) return progress;
        return prev + (progress - prev) * 0.08;
      });
      frame = requestAnimationFrame(animate);
    };
    animate();
    return () => cancelAnimationFrame(frame);
  }, [progress]);

  const radius = 90;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (displayProgress / 100) * circumference;

  return (
    <div className="h-full w-full text-white flex flex-col items-center justify-center relative overflow-hidden">
      {/* Header */}
      <div className="absolute top-10 z-10 text-center">
        <h2 className="text-2xl uppercase tracking-[0.3em] font-semibold text-zinc-300">
          {year} Progress
        </h2>
        <p className="text-sm mt-2 text-zinc-400">{dateLabel} (UTC)</p>
      </div>

      {/* Circular Progress */}
      <div className="relative z-10 flex justify-center my-10">
        <div className="relative w-[200px] h-[200px] group">
          <svg width="200" height="200" className="rotate-[-90deg]" aria-hidden>
            {/* Track */}
            <circle
              cx="100"
              cy="100"
              r={90}
              strokeWidth="14"
              fill="none"
              className="text-zinc-700"
              stroke="currentColor"
            />

            {/* Soft halo */}
            <circle
              cx="100"
              cy="100"
              r={90}
              strokeWidth="20"
              fill="none"
              className="text-lime-500/10"
              stroke="currentColor"
            />

            {/* Progress */}
            <circle
              cx="100"
              cy="100"
              r={90}
              strokeWidth="14"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              className="text-lime-400 transition-all duration-700 ease-out"
              stroke="currentColor"
            />
          </svg>

          {/* Center Panel */}
          <div className="absolute inset-3 rounded-full bg-slate-900/80 backdrop-blur border border-white/5 shadow-inner flex flex-col items-center justify-center text-center transition group-hover:scale-[1.02]">
            <span
              className="text-[48px] font-extrabold leading-none text-lime-400"
              aria-live="polite"
            >
              {displayProgress.toFixed(1)}%
            </span>

            <span className="mt-2 text-[11px] tracking-wide text-zinc-400">
              Day {daysPassed} of {daysTotal}
            </span>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="relative z-10 grid grid-cols-2 gap-6 mb-2">
        <Stat label="Days Passed" value={daysPassed} />
        <Stat label="Days Left" value={daysTotal - daysPassed} />
      </div>
      <button
        onClick={() =>
          sdk.actions.composeCast({
            text: `${year} is ${displayProgress.toFixed(2)}% complete!`,
            embeds: [`${process.env.NEXT_PUBLIC_URL}?t=${mintedAt}`],
          })
        }
        className="bg-[#7C3AED] text-white px-4 py-2 rounded-lg hover:bg-[#38BDF8] transition cursor-pointer font-semibold mt-4"
      >
        Share
      </button>      <MintButton now={mintedAt} />

    </div>
  );
};

const Stat = ({ label, value }: { label: string; value: number }) => (
  <div className="rounded-2xl bg-slate-800/70 border border-white/5 px-6 py-4 text-center shadow-md">
    <div className="text-2xl font-bold text-white">{value}</div>
    <div className="mt-1 text-[10px] uppercase tracking-wider text-zinc-400">
      {label}
    </div>
  </div>
);

export default YearProgress;
