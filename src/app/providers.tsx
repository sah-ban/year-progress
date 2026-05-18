"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  WagmiProvider,
  http,
  cookieStorage,
  createStorage,
  createConfig,
} from "wagmi";
import { base } from "wagmi/chains";
import { type ReactNode, useState, useEffect } from "react";
import { injected } from "wagmi/connectors";
import sdk from "@farcaster/miniapp-sdk";

export const config = createConfig({
  chains: [base],
  connectors: [injected()],
  transports: {
    [base.id]: http(),
  },
  ssr: true,
  storage: createStorage({
    storage: cookieStorage,
  }),
});

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());
  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      await sdk.context;
      if (isMounted) {
        sdk.actions.ready({ disableNativeGestures: true });
      }
    };

    if (sdk) {
      load();
    }

    return () => {
      isMounted = false;
      if (sdk) {
        sdk.removeAllListeners();
      }
    };
  }, []);

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
}
