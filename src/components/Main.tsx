"use client";

import React, { useState, useEffect } from "react";
import sdk, { type Context } from "@farcaster/miniapp-sdk";
import Connect from "./Connect";
import { useAccount } from "wagmi";
import SupportDeveloperCard from "./SupportDeveloperCard";
import YearProgress from "./YearProgress";

export default function GiphySearch() {
  const [isSDKLoaded, setIsSDKLoaded] = useState(false);
  const [context, setContext] = useState<Context.MiniAppContext>();
  const [activeDiv, setActiveDiv] = useState<"Home" | "Tip">("Home");

  const { isConnected } = useAccount();

  useEffect(() => {
    const load = async () => {
      const context = await sdk.context;
      setContext(context);

      sdk.actions.ready({});
    };
    if (sdk && !isSDKLoaded) {
      setIsSDKLoaded(true);
      load();
      return () => {
        sdk.removeAllListeners();
      };
    }
  }, [isSDKLoaded]);
  
  useEffect(() => {
    if (!context?.client.added) {
      sdk.actions.addMiniApp();
    }
  }, [context?.client.added]);

  if (!context)
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-b from-slate-900 to-slate-800">
        <div className="flex flex-col items-center justify-center text-white text-2xl p-4">
          <p className="flex items-center justify-center text-center">
            You need to access this mini app from inside a farcaster client
          </p>
          <div
            className="flex items-center justify-center text-center bg-indigo-800 p-3 rounded-lg mt-4 cursor-pointer"
            onClick={() => window.open("https://farcaster.xyz/miniapps/0LCZ6cNxjDl6/year-progress", "_blank")}
          >
            Open in Farcaster
          </div>
        </div>
      </div>
    );

  if (!isConnected) {
    return (
      <div className="flex items-center justify-center h-screen w-full bg-gradient-to-b from-slate-900 to-slate-800">
        <Connect />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col justify-between">
      <main className="flex-grow w-full flex flex-col flex-1 min-h-0 bg-gradient-to-b from-slate-900 to-slate-800">
        {activeDiv === "Home" && <YearProgress />}
        {activeDiv === "Tip" && (
          <div className="flex-1 w-full flex items-center justify-center">
            <SupportDeveloperCard />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gradient-to-b from-slate-900 to-slate-800 text-white p-3 font-bold min-w-full h-16">
        <div className="flex justify-around">
          <button
            className="flex flex-col items-center text-center cursor-pointer"
            onClick={() => setActiveDiv("Home")}
          >
            <span className="flex items-center justify-center">
              {activeDiv === "Home" ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="size-6 mx-auto"
                >
                  <path d="M11.47 3.841a.75.75 0 0 1 1.06 0l8.69 8.69a.75.75 0 1 0 1.06-1.061l-8.689-8.69a2.25 2.25 0 0 0-3.182 0l-8.69 8.69a.75.75 0 1 0 1.061 1.06l8.69-8.689Z" />
                  <path d="m12 5.432 8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 0 1-.75-.75v-4.5a.75.75 0 0 0-.75-.75h-3a.75.75 0 0 0-.75.75V21a.75.75 0 0 1-.75.75H5.625a1.875 1.875 0 0 1-1.875-1.875v-6.198a2.29 2.29 0 0 0 .091-.086L12 5.432Z" />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-6 mx-auto"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
                  />
                </svg>
              )}
            </span>
            <span>Home</span>
          </button>

          <button
            className="flex flex-col items-center text-center cursor-pointer"
            onClick={() => setActiveDiv("Tip")}
          >
            <span className="flex items-center justify-center">
              {activeDiv === "Tip" ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="size-6"
                >
                  <path d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z" />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
                  />
                </svg>
              )}
            </span>
            <span>Tip</span>
          </button>
        </div>
      </footer>
    </div>
  );
}
