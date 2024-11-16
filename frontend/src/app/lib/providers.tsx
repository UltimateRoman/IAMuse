"use client";

import { DynamicContextProvider } from "@dynamic-labs/sdk-react-core";
import { EthereumWalletConnectors } from "@dynamic-labs/ethereum";
import { WalletProvider } from "./walletProvider";
import {CirclesSDK} from '../circles/circles'

import { spicy, gnosisChiado, gnosis } from "viem/chains";

const evmNetworks = [
  {
    blockExplorerUrls: [gnosisChiado.blockExplorers.default.url],
    chainId: gnosisChiado.id,
    chainName: gnosisChiado.name,
    iconUrls: ["https://app.dynamic.xyz/assets/networks/gnosis.svg"],
    name: gnosisChiado.name,
    nativeCurrency: {
      ...gnosisChiado.nativeCurrency,
      iconUrl: "https://app.dynamic.xyz/assets/networks/gnosis.svg",
    },
    networkId: gnosisChiado.id,
    rpcUrls: [gnosisChiado.rpcUrls.default.http[0]],
    vanityName: gnosisChiado.name,
  },
  {
    blockExplorerUrls: [gnosis.blockExplorers.default.url],
    chainId: gnosis.id,
    chainName: gnosis.name,
    iconUrls: ["https://app.dynamic.xyz/assets/networks/gnosis.svg"],
    name: gnosis.name,
    nativeCurrency: {
      ...gnosis.nativeCurrency,
      iconUrl: "https://app.dynamic.xyz/assets/networks/gnosis.svg",
    },
    networkId: gnosis.id,
    rpcUrls: [gnosis.rpcUrls.default.http[0]],
    vanityName: gnosis.name,
  },
  {
    blockExplorerUrls: [spicy.blockExplorers.default.url],
    chainId: spicy.id,
    chainName: spicy.name,
    iconUrls: ["https://app.dynamic.xyz/assets/networks/gnosis.svg"],
    name: spicy.name,
    nativeCurrency: {
      ...spicy.nativeCurrency,
      iconUrl: "https://app.dynamic.xyz/assets/networks/gnosis.svg",
    },
    networkId: spicy.id,
    rpcUrls: [spicy.rpcUrls.default.http[0]],
    vanityName: spicy.name,
  },
];


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
