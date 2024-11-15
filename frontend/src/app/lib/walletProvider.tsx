"use client";

import { isEthereumWallet } from "@dynamic-labs/ethereum";
import { useDynamicContext, useIsLoggedIn } from "@dynamic-labs/sdk-react-core";
import React, { createContext, useEffect, useState } from "react";
import { PublicClient, WalletClient } from "viem";

type WalletContextType = {
    isLoggedIn: boolean,
    isLoading: boolean,
    walletClient?: WalletClient
};

export const WalletContext = createContext<WalletContextType>({
    isLoggedIn: false,
    isLoading: true
})

export function WalletProvider({children}: {children: React.ReactNode}) {
    const { sdkHasLoaded, primaryWallet, user } = useDynamicContext();
    const isLoggedIn = useIsLoggedIn();
    const [walletClient, setWalletClient] = useState<WalletClient>()
    const [isLoading, setIsLoading] = useState(true);

    async function initWalletClient() {
        if(!primaryWallet || !isEthereumWallet(primaryWallet)) return;

        const walletClient = await primaryWallet.getWalletClient();
        console.log(`Got wallet client: `, walletClient)
        console.log(`Got user: `, user)
        setWalletClient(walletClient)
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
        <WalletContext.Provider value={{
            isLoggedIn,
            isLoading,
            walletClient
        }}>
            {children}
        </WalletContext.Provider>
    )
}
