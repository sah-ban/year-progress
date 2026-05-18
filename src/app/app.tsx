"use client";

import dynamic from "next/dynamic";

const YearProgress = dynamic(() => import("@/components/YearProgress"), {
  ssr: false,
});

export default function App() {
  return (
    <div className="min-h-screen flex flex-col justify-between">
      <main className="grow w-full flex flex-col flex-1 min-h-0 bg-linear-to-b from-slate-900 to-slate-800">
        <YearProgress />
      </main>
    </div>
  );
}
