"use client";

import { DynamicContextProvider } from "@dynamic-labs/sdk-react-core";
import { EthereumWalletConnectors } from "@dynamic-labs/ethereum";
import { WalletProvider } from "./walletProvider";
import {CirclesSDK} from '../circles/circles'
import { chain } from "./chain";

const evmNetworks = [
    {
        blockExplorerUrls: [chain.blockExplorers.default.url ],
        chainId: chain.id,
        chainName: chain.name,
        iconUrls: ["https://app.dynamic.xyz/assets/networks/gnosis.svg"],
            name: chain.name,
        nativeCurrency: {
            ...chain.nativeCurrency,
            iconUrl: 'https://app.dynamic.xyz/assets/networks/gnosis.svg',
        },
            networkId: chain.id,
            rpcUrls: [chain.rpcUrls.default.http[0]],
            vanityName: chain.name,
    },
]

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <DynamicContextProvider
      theme="auto"
      settings={{
        environmentId: process.env.NEXT_PUBLIC_DYNAMIC_ENV_ID || "",
        walletConnectors: [EthereumWalletConnectors],
        overrides: { evmNetworks },
      }}
    >
      <WalletProvider>
        <CirclesSDK>{children}</CirclesSDK>
      </WalletProvider>
    </DynamicContextProvider>
  );
}
