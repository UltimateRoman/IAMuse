"use client";

import React, { createContext, useState, useEffect, useCallback, useContext } from "react";
import { BrowserProviderContractRunner } from "@circles-sdk/adapter-ethers";
import { AvatarInterface, CirclesConfig, Sdk } from '@circles-sdk/sdk';
import { BiconomySdkContractRunner } from "./biconomyAdapter";
import { WalletContext } from "../lib/walletProvider";

interface CirclesSDKContextType {
    sdk: Sdk | null;
    setIsConnected: React.Dispatch<React.SetStateAction<boolean>>;
    isConnected: boolean;
    adapter: BrowserProviderContractRunner | null;
    circlesProvider: any;
    circlesAddress: string | null;
    initSdk: () => Promise<void>;
    avatar?: AvatarInterface;
    initAvatar?: () => void;
}

const CirclesSDKContext = createContext<CirclesSDKContextType>({
    sdk: null,
    setIsConnected: (_) => {},
    isConnected: false,
    adapter: null,
    circlesProvider: null,
    circlesAddress: null,
    // per
    // groupBalance: 0,
    // avatar: null,
    // contract: null,
    initSdk: async () => {},
    // updateBalances: async () => {},
  });
// Provider component to wrap around your application
interface CirclesSDKProps {
    children: React.ReactNode;
}

export const GnosisChainConfig: CirclesConfig = {
    circlesRpcUrl: "https://static.94.138.251.148.clients.your-server.de/rpc/",
    v1HubAddress: "0x29b9a7fbb8995b2423a71cc17cf9810798f6c543",
    v2HubAddress: "0x3D61f0A272eC69d65F5CFF097212079aaFDe8267",
    migrationAddress: "0x28141b6743c8569Ad8B20Ac09046Ba26F9Fb1c90",
    nameRegistryAddress: "0x8D1BEBbf5b8DFCef0F7E2039e4106A76Cb66f968",
    profileServiceUrl: "https://static.94.138.251.148.clients.your-server.de/profiles/",
    baseGroupMintPolicy: "0x79Cbc9C7077dF161b92a745345A6Ade3fC626A60",
};

export const CirclesSDK: React.FC<CirclesSDKProps> = ({ children }) => {
    const {smartAccount, isLoading, ethersProvider} = useContext(WalletContext);
    const [sdk, setSdk] = useState<Sdk|null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const [adapter, setAdapter] = useState<any | null>(null);
    const [circlesProvider, setCirclesProvider] = useState<any | null>(null);
    const [circlesAddress, setCirclesAddress] = useState<any | null>(null);
    const [avatar, setAvatar] = useState<AvatarInterface>()

    // Function to initialize the SDK
    const initSdk = useCallback(async () => {
        try {
            if (isLoading || !smartAccount || !ethersProvider) return;
            const adapter = new BiconomySdkContractRunner(
                smartAccount, 
                await smartAccount?.getAccountAddress(),
                ethersProvider

            );

             setAdapter(adapter); // Set the adapter in the state

             const circlesProvider = adapter.provider;
             setCirclesProvider(circlesProvider); // Store the provider

             const circlesAddress =  adapter.address;
             setCirclesAddress(circlesAddress); // Set the address

             const sdk = new Sdk(adapter, GnosisChainConfig); // Pass the initialized adapter to the SDK
             setSdk(sdk); // Set the SDK in the state
        } catch (error) {
            console.error("Error initializing SDK:", error);
        }
    }, [isLoading, smartAccount]);

    useEffect(() => {
        console.log("Initializing sdk")
        initSdk(); // Call initSdk when the component mounts
    }, [initSdk]);


    async function initAvatar() {
        if (sdk && smartAccount && !avatar) {
            try {
                const registeredAvatar = await sdk.getAvatar(await smartAccount.getAccountAddress());
                setAvatar(registeredAvatar);
                setIsConnected(true)
            } catch (error) {
                const registeredAvatar = await sdk.registerHuman();
                setAvatar(registeredAvatar);
                setIsConnected(true)
            }
        }
    }

    // Provide the SDK context to child components
    return (
        <CirclesSDKContext.Provider value={{
            sdk,
            setIsConnected,
            isConnected,
            adapter,
            circlesProvider,
            circlesAddress,
            initSdk,
            avatar,
            initAvatar,
        }}>
            {children}
        </CirclesSDKContext.Provider>
    );
};

export default CirclesSDKContext;
