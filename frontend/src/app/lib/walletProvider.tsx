"use client";

import { BiconomySmartAccountV2 } from "@biconomy/account";
import { isEthereumWallet } from "@dynamic-labs/ethereum";
import {
  useDynamicContext,
  useIsLoggedIn,
  UserProfile,
} from "@dynamic-labs/sdk-react-core";
import React, { createContext, useEffect, useState } from "react";
import { WalletClient } from "viem";
import { createSmartAccount } from "./biconomy";
import { ethers } from "ethers";
import { getWeb3Provider, getSigner } from "@dynamic-labs/ethers-v6";
import { chain } from "./chain";
import { spicy } from "viem/chains";

type WalletContextType = {
  isLoggedIn: boolean;
  isLoading: boolean;
  walletClient?: WalletClient;
  smartAccount?: BiconomySmartAccountV2;
  user?: UserProfile;
  ethersProvider?: ethers.Provider;
  ethersSigner?: ethers.Signer;
  wagerSmartAccount?: BiconomySmartAccountV2;
};

export const WalletContext = createContext<WalletContextType>({
  isLoggedIn: false,
  isLoading: true,
});

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const { sdkHasLoaded, primaryWallet, user } = useDynamicContext();
  const isLoggedIn = useIsLoggedIn();
  const [walletClient, setWalletClient] = useState<WalletClient>();
  const [isLoading, setIsLoading] = useState(true);
  const [smartAccount, setSmartAccount] = useState<BiconomySmartAccountV2>();
  const [ethersProvider, setEthersProvider] = useState<ethers.Provider>();
  const [ethersSigner, setEthersSigner] = useState<ethers.Signer>();
  const [wagerSmartAccount, setWagerSmartAccount] =
    useState<BiconomySmartAccountV2>();

  async function initWalletClient() {
    if (!primaryWallet || !isEthereumWallet(primaryWallet) || !isLoading)
      return;

    let walletClient = await primaryWallet.getWalletClient(`${chain.id}`);
    console.log(`ChainID: `, walletClient.chain.id)
    setWalletClient(walletClient);

    const provider = await getWeb3Provider(primaryWallet);
    setEthersProvider(provider);

    const signer = await getSigner(primaryWallet);
    setEthersSigner(signer);

    const newSmartAccount = await createSmartAccount(
      walletClient,
      chain.id,
      process.env.NEXT_PUBLIC_BUILDER_URL || "",
      process.env.NEXT_PUBLIC_PAYMASTER_URL || "",
    );
    console.log(
      "Got smart account address: ",
      await newSmartAccount.getAccountAddress(),
    );
    setSmartAccount(newSmartAccount);

    walletClient = await primaryWallet.getWalletClient(`${spicy.id}`);
    console.log(`ChainID: `, walletClient.chain.id)

    const newWagerSmartAccount = await createSmartAccount(
      walletClient,
      spicy.id,
      process.env.NEXT_PUBLIC_WAGER_BUILDER_URL || "",
      process.env.NEXT_PUBLIC_WAGER_PAYMASTER_URL || "",
    );

    console.log(
      "Got wager smart account address: ",
      await newWagerSmartAccount.getAccountAddress(),
    );
    setWagerSmartAccount(newWagerSmartAccount);
  }

  useEffect(() => {
    if (sdkHasLoaded && isLoggedIn && primaryWallet) {
      initWalletClient();
      setIsLoading(false);
    } else {
      setIsLoading(true);
    }
  }, [sdkHasLoaded, isLoggedIn, primaryWallet]);

  return (
    <WalletContext.Provider
      value={{
        isLoggedIn,
        isLoading,
        walletClient,
        smartAccount,
        user,
        ethersProvider,
        ethersSigner,
        wagerSmartAccount,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}
