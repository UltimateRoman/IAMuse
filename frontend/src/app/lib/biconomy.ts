"use client";

import {
  Bundler,
  Paymaster,
  createSmartAccountClient,
  DEFAULT_ENTRYPOINT_ADDRESS,
  ECDSAOwnershipValidationModule,
  DEFAULT_ECDSA_OWNERSHIP_MODULE,
  SupportedSigner,
} from "@biconomy/account";
import { sepolia } from "viem/chains";

const bundler = new Bundler({
  bundlerUrl: process.env.NEXT_PUBLIC_BUILDER_URL || "",
  chainId: sepolia.id, // Replace this with your desired network
  entryPointAddress: DEFAULT_ENTRYPOINT_ADDRESS, // This is a Biconomy constant
});

const paymaster = new Paymaster({
  paymasterUrl: process.env.NEXT_PUBLIC_PAYMASTER_URL || "",
});

const createValidationModule = async (signer: SupportedSigner) => {
  return await ECDSAOwnershipValidationModule.create({
    signer: signer,
    moduleAddress: DEFAULT_ECDSA_OWNERSHIP_MODULE, // This is a Biconomy constant
  });
};

export const createSmartAccount = async (walletClient: SupportedSigner) => {
  const validationModule = await createValidationModule(walletClient);

  return await createSmartAccountClient({
    signer: walletClient,
    chainId: sepolia.id, // Replace this with your target network
    bundler: bundler, // Use the `bundler` we initialized above
    paymaster: paymaster, // Use the `paymaster` we initialized above
    entryPointAddress: DEFAULT_ENTRYPOINT_ADDRESS, // This is a Biconomy constant
    defaultValidationModule: validationModule, // Use the `validationModule` we initialized above
    activeValidationModule: validationModule, // Use the `validationModule` we initialized above
  });
};

