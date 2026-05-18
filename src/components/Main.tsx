"use client";

import { useEffect, useRef } from "react";
import sdk from "@farcaster/miniapp-sdk";
import YearProgress from "./YearProgress";

export default function Main() {
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    (async () => {
      const context = await sdk.context;
      sdk.actions.ready({});
      if (context && !context?.client.added) {
        sdk.actions.addMiniApp();
      }
    })();

    return () => {
      sdk.removeAllListeners();
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col justify-between">
      <main className="flex-grow w-full flex flex-col flex-1 min-h-0 bg-gradient-to-b from-slate-900 to-slate-800">
        <YearProgress />
      </main>
    </div>
  );
}
