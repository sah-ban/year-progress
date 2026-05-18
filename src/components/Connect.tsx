"use client";

import { useAccount, useConnect, useDisconnect, useSwitchChain } from "wagmi";
import { useState, useRef, useEffect } from "react";
import { base } from "wagmi/chains";
import Image from "next/image";

export default function ConnectButton() {
  const { address, isConnected, chainId } = useAccount();
  const { connect, connectors, isPending, variables, error } = useConnect();
  const { switchChain, isPending: isSwitchPending } = useSwitchChain();
  const { disconnect } = useDisconnect();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const hasAttemptedAutoConnect = useRef(false);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  useEffect(() => {
    if (
      !isConnected &&
      !hasAttemptedAutoConnect.current &&
      connectors.length > 0
    ) {
      const farcasterConnector = connectors.find(
        (c) => c.name.toLowerCase() === "farcaster" || c.id === "farcaster",
      );
      if (farcasterConnector) {
        hasAttemptedAutoConnect.current = true;
        connect({ connector: farcasterConnector });
      }
    }
  }, [connectors, isConnected, connect]);

  if (isConnected) {
    if (chainId !== base.id) {
      return (
        <button
          onClick={() => switchChain({ chainId: base.id })}
          className="rounded-full bg-rose-500/20 border border-rose-400/40 text-rose-200 text-sm font-semibold px-5 py-2.5 hover:bg-rose-500/30 transition inline-flex items-center gap-2 cursor-pointer"
        >
          <span className="w-2 h-2 rounded-full bg-rose-400 animate-pulse shadow-[0_0_8px_rgba(244,63,94,0.7)]" />
          {isSwitchPending ? "Switching..." : "Switch to Base"}
        </button>
      );
    }

    return (
      <button
        onClick={() => disconnect()}
        className="rounded-full bg-white/10 border border-white/15 text-white text-sm font-semibold px-5 py-2.5 hover:bg-white/15 transition inline-flex items-center gap-2 backdrop-blur cursor-pointer"
      >
        <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.7)]" />
        <code className="text-sm tracking-wider">
          {address?.slice(0, 6)}...{address?.slice(-4)}
        </code>
        <Image
          src="/disconnect.svg"
          alt="Disconnect"
          width={16}
          height={16}
          className="opacity-70"
        />
      </button>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="rounded-full bg-cyan-400/10 border border-cyan-400/40 text-cyan-300 text-sm font-semibold px-5 py-2.5 hover:bg-cyan-400/15 transition inline-flex items-center gap-2 backdrop-blur shadow-[0_0_20px_rgba(34,211,238,0.15)] cursor-pointer"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="drop-shadow-[0_0_6px_rgba(34,211,238,0.5)]"
        >
          <path
            d="M16 7.99983V4.50048C16 3.66874 16 3.25287 15.8248 2.9973C15.6717 2.77401 15.4346 2.62232 15.1678 2.57691C14.8623 2.52493 14.4847 2.6992 13.7295 3.04775L4.85901 7.14182C4.18551 7.45267 3.84875 7.6081 3.60211 7.84915C3.38406 8.06225 3.21762 8.32238 3.1155 8.60966C3 8.93462 3 9.30551 3 10.0473V14.9998M16.5 14.4998H16.51M3 11.1998L3 17.7998C3 18.9199 3 19.48 3.21799 19.9078C3.40973 20.2841 3.71569 20.5901 4.09202 20.7818C4.51984 20.9998 5.07989 20.9998 6.2 20.9998H17.8C18.9201 20.9998 19.4802 20.9998 19.908 20.7818C20.2843 20.5901 20.5903 20.2841 20.782 19.9078C21 19.48 21 18.9199 21 17.7998V11.1998C21 10.0797 21 9.51967 20.782 9.09185C20.5903 8.71552 20.2843 8.40956 19.908 8.21782C19.4802 7.99983 18.9201 7.99983 17.8 7.99983L6.2 7.99983C5.0799 7.99983 4.51984 7.99983 4.09202 8.21781C3.7157 8.40956 3.40973 8.71552 3.21799 9.09185C3 9.51967 3 10.0797 3 11.1998ZM17 14.4998C17 14.776 16.7761 14.9998 16.5 14.9998C16.2239 14.9998 16 14.776 16 14.4998C16 14.2237 16.2239 13.9998 16.5 13.9998C16.7761 13.9998 17 14.2237 17 14.4998Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        Connect Wallet to Mint this Milestone
      </button>

      {isOpen && (
        <div className="absolute bottom-[calc(100%+8px)] right-0 z-50 min-w-[220px] flex flex-col gap-1 p-2 rounded-2xl bg-[#0b1020]/90 border border-white/10 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
          {connectors
            .filter((c) => "id" in c)
            .map((connector: import("wagmi").Connector) => (
              <button
                key={connector.id}
                onClick={() => {
                  connect({ connector });
                }}
                className="text-left px-4 py-2.5 rounded-xl text-sm text-white/85 hover:bg-white/10 transition cursor-pointer"
              >
                {connector.name === "Injected"
                  ? "Browser Wallet"
                  : connector.name}
                {isPending &&
                  // @ts-expect-error - connector runtime object has id but TS infers CreateConnectorFn
                  connector.id === variables?.connector?.id && (
                    <span className="ml-2 text-cyan-400/80 text-xs">
                      connecting…
                    </span>
                  )}
              </button>
            ))}
          {error && (
            <div className="mt-1 px-3 py-2 rounded-lg text-[11px] text-rose-300 bg-rose-500/10 border border-rose-400/20 text-center">
              {error.message.toLowerCase().includes("connector not found") ||
              error.message.toLowerCase().includes("provider not found") ||
              error.message.toLowerCase().includes("not injected")
                ? "Wallet extension not detected. Install MetaMask or Rabby."
                : error.message.split("\n")[0]}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
