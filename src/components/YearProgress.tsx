"use client";

import { useEffect, useMemo, useState } from "react";
import sdk from "@farcaster/miniapp-sdk";
import { getYearProgressFromTimestamp } from "@/lib/time";
import MintButton from "./MintButton";

const YearProgress = () => {
  const [now, setNow] = useState(() => Date.now());
  const [displayProgress, setDisplayProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 60 * 60 * 1000);
    return () => clearInterval(timer);
  }, []);

  const { year, percent, daysPassed, daysTotal } = useMemo(
    () => getYearProgressFromTimestamp(now),
    [now],
  );

  const dateLabel = useMemo(
    () =>
      new Date(now)
        .toLocaleDateString("en-US", {
          weekday: "short",
          month: "short",
          day: "numeric",
          timeZone: "UTC",
        })
        .toUpperCase(),
    [now],
  );

  const mintedAt = Math.floor(now / 1000);

  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setDisplayProgress(percent);
      return;
    }
    let frame: number;
    const animate = () => {
      setDisplayProgress((prev) => {
        if (Math.abs(prev - percent) < 0.1) return percent;
        return prev + (percent - prev) * 0.08;
      });
      frame = requestAnimationFrame(animate);
    };
    animate();
    return () => cancelAnimationFrame(frame);
  }, [percent]);

  const displayProgressInt = Math.floor(displayProgress);

  const shareText = `${year} is ${displayProgressInt} percent complete!`;
  const shareUrl = `${process.env.NEXT_PUBLIC_URL}?t=${mintedAt}`;

  const handleShareCast = async () => {
    const context = await sdk.context;
    if (context) {
      sdk.actions.composeCast({
        text: shareText,
        embeds: [shareUrl],
      });
    } else {
      const intent = `https://farcaster.xyz/~/compose?text=${encodeURIComponent(
        shareText
      )}&embeds[]=${shareUrl}`;
      window.open(intent, "_blank");
    }
  };

  const handleShareTweet = async () => {
    const intent = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      shareText
    )}&url=${encodeURIComponent(shareUrl)}`;
    const context = await sdk.context;
    if (context) {
      sdk.actions.openUrl(intent);
    } else {
      window.open(intent, "_blank");
    }
  };

  return (
    <div className="flex-1 w-full text-white relative overflow-hidden">
      <div className="w-full max-w-lg mx-auto flex flex-col items-center gap-6 px-5 py-7 sm:px-8 sm:py-10 md:py-14">
        <div className="text-center">
          <div className="text-[11px] tracking-[0.35em] uppercase text-white/60">
            Year Progress
          </div>
          <div className="mt-1 text-base font-semibold tracking-[0.08em] text-white/75">
            {year} · {dateLabel}
          </div>
        </div>

        <div className="relative w-50 h-50">
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background: `conic-gradient(#22d3ee 0% ${displayProgress}%, rgba(255,255,255,0.08) ${displayProgress}% 100%)`,
              filter: "drop-shadow(0 0 28px rgba(34,211,238,0.45))",
            }}
          />
          <div className="absolute inset-4 rounded-full bg-[#0b1020]/85 backdrop-blur border border-white/10 flex flex-col items-center justify-center">
            <span
              className="text-[52px] font-extrabold leading-none tracking-tight text-cyan-400"
              aria-live="polite"
            >
              {displayProgressInt}%
            </span>
            <span className="mt-1.5 text-[10px] tracking-[0.2em] uppercase text-white/55">
              Day {daysPassed} / {daysTotal}
            </span>
          </div>
        </div>

        <YearDotGrid
          year={year}
          daysPassed={daysPassed}
          daysTotal={daysTotal}
        />

        <div className="w-full flex flex-col gap-3">
          <div className="flex gap-2.5 w-full">
            <button
              onClick={handleShareCast}
              className="flex-1 rounded-full bg-white/10 border border-white/15 text-white text-sm font-semibold py-3 hover:bg-white/15 transition inline-flex items-center justify-center gap-2 cursor-pointer"
            >
              <svg
                viewBox="0 0 1000 1000"
                className="w-4 h-4"
                aria-hidden
                fill="currentColor"
              >
                <path d="M257.778 155.556h484.444v688.888h-71.111V528.889h-.697c-7.86-87.212-81.156-155.555-170.414-155.555s-162.553 68.343-170.414 155.555h-.697v315.555h-71.111z" />
                <path d="m128.889 253.333 28.889 97.778h24.444v395.556c-12.273 0-22.222 9.949-22.222 22.222v26.667h-4.444c-12.273 0-22.223 9.949-22.223 22.222v26.667h248.889v-26.667c0-12.273-9.949-22.222-22.222-22.222h-4.444v-26.667c0-12.273-9.95-22.222-22.222-22.222h-26.667V253.333zM675.556 746.667c-12.273 0-22.223 9.949-22.223 22.222v26.667h-4.444c-12.273 0-22.222 9.949-22.222 22.222v26.667h248.889v-26.667c0-12.273-9.95-22.222-22.223-22.222h-4.444v-26.667c0-12.273-9.949-22.222-22.222-22.222V351.111h24.444l28.889-97.778H702.222v493.334z" />
              </svg>
              Cast
            </button>
            <button
              onClick={handleShareTweet}
              className="flex-1 rounded-full bg-white/10 border border-white/15 text-white text-sm font-semibold py-3 hover:bg-white/15 transition inline-flex items-center justify-center gap-2 cursor-pointer"
            >
              <svg
                viewBox="0 0 24 24"
                className="w-4 h-4"
                aria-hidden
                fill="currentColor"
              >
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
              Tweet
            </button>
          </div>
          <div className="flex justify-center">
            <MintButton now={mintedAt} />
          </div>
        </div>
      </div>
    </div>
  );
};

interface YearDotGridProps {
  year: number;
  daysPassed: number;
  daysTotal: number;
}

const YearDotGrid = ({ year, daysPassed, daysTotal }: YearDotGridProps) => {
  return (
    <div className="w-full rounded-2xl bg-white/04 border border-white/10 backdrop-blur p-3.5">
      <div className="flex justify-between items-center mb-2.5">
        <div className="text-[9px] tracking-[0.2em] uppercase text-white/50">
          Days of {year}
        </div>
        <div className="flex gap-2.5 text-[9px] text-white/45">
          <span className="inline-flex items-center gap-1">
            <span className="w-2 h-2 rounded-[2px] bg-cyan-400 shadow-[0_0_4px_rgba(34,211,238,0.5)]" />
            Passed
          </span>
          <span className="inline-flex items-center gap-1">
            <span className="w-2 h-2 rounded-[2px] bg-white shadow-[0_0_5px_white]" />
            Today
          </span>
          <span className="inline-flex items-center gap-1">
            <span className="w-2 h-2 rounded-[2px] bg-white/10" />
            Ahead
          </span>
        </div>
      </div>

      <div
        className="grid gap-[2px]"
        style={{ gridTemplateColumns: "repeat(31, 1fr)" }}
      >
        {Array.from({ length: daysTotal }, (_, i) => {
          const dayOfYear = i + 1;
          let cls = "aspect-square rounded-[1.5px]";
          if (dayOfYear < daysPassed) {
            cls += " bg-cyan-400 shadow-[0_0_3px_rgba(34,211,238,0.5)]";
          } else if (dayOfYear === daysPassed) {
            cls += " bg-white shadow-[0_0_5px_white]";
          } else {
            cls += " bg-white/10";
          }
          return <div key={i} className={cls} />;
        })}
      </div>
    </div>
  );
};

export default YearProgress;
