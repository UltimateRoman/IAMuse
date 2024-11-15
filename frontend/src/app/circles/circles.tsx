import React, { createContext, useState, useEffect, useCallback } from "react";
import { BrowserProviderContractRunner } from "@circles-sdk/adapter-ethers";
import { CirclesConfig, Sdk } from '@circles-sdk/sdk';

interface CirclesSDKContextType {
    sdk: Sdk | null;
    setIsConnected: React.Dispatch<React.SetStateAction<boolean>>;
    isConnected: boolean;
    adapter: BrowserProviderContractRunner | null;
    circlesProvider: any;
    circlesAddress: string | null;
    initSdk: () => Promise<void>;
}

const CirclesSDKContext = createContext<CirclesSDKContextType>({
    sdk: null,
    setIsConnected: (_) => {},
    isConnected: false,
    adapter: null,
    circlesProvider: null,
    circlesAddress: null,
    // personalBalance: 0,
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

export const CirclesSDK: React.FC<CirclesSDKProps> = ({ children }) => {
    const [sdk, setSdk] = useState<any|null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const [adapter, setAdapter] = useState<any | null>(null);
    const [circlesProvider, setCirclesProvider] = useState<any | null>(null);
    const [circlesAddress, setCirclesAddress] = useState<any | null>(null);

    const chiadoConfig: CirclesConfig = {
        circlesRpcUrl: "https://chiado-rpc.aboutcircles.com",
        pathfinderUrl: "https://chiado-pathfinder.aboutcircles.com",
        //v2PathfinderUrl: "https://chiado-pathfinder.aboutcircles.com/pathfinder/",
        profileServiceUrl: "https://chiado-pathfinder.aboutcircles.com/profiles/",
        v1HubAddress: "0xdbf22d4e8962db3b2f1d9ff55be728a887e47710",
        v2HubAddress: "0xc12C1E50ABB450d6205Ea2C3Fa861b3B834d13e8",
        migrationAddress: "0x12E815963A0b910288C7256CAD0d345c8F5db08E",
        nameRegistryAddress: "0x24b3fDCdD9fef844fB3094ef43c0A6Ac23a6dF9E",
        baseGroupMintPolicy: "0xE35c66531aF28660a1CdfA3dd0b1C1C0245D2F67"
    };
    

    // Function to initialize the SDK
    const initSdk = useCallback(async () => {
        try {
            const adapter = new BrowserProviderContractRunner();
            await adapter.init(); // Initialize the adapter before using it
            
            setAdapter(adapter); // Set the adapter in the state

            const circlesProvider = adapter.provider;
            setCirclesProvider(circlesProvider); // Store the provider
            
            const circlesAddress = await adapter.address;
            setCirclesAddress(circlesAddress); // Set the address
            
            const sdk = new Sdk(adapter, chiadoConfig); // Pass the initialized adapter to the SDK
            setSdk(sdk); // Set the SDK in the state
            setIsConnected(true); // Update connection status
            console.log("Circles is working")
        } catch (error) {
            console.error("Error initializing SDK:", error);
        }
    }, []);

    useEffect(() => {
        initSdk(); // Call initSdk when the component mounts
    }, [initSdk]);

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
        }}>
            {children}
        </CirclesSDKContext.Provider>
    );
};

export default CirclesSDKContext;