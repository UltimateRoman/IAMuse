"use client";

import {
  Bundler,
  Paymaster,
  createSmartAccountClient,
  DEFAULT_ENTRYPOINT_ADDRESS,
  ECDSAOwnershipValidationModule,
  DEFAULT_ECDSA_OWNERSHIP_MODULE,
  SupportedSigner,
  BiconomySmartAccountV2,
  Transaction,
  PaymasterMode,
  UserOpReceipt,
} from "@biconomy/account";

const createValidationModule = async (signer: SupportedSigner) => {
  return await ECDSAOwnershipValidationModule.create({
    signer: signer,
    moduleAddress: DEFAULT_ECDSA_OWNERSHIP_MODULE, // This is a Biconomy constant
  });
};

export const createSmartAccount = async (
    walletClient: SupportedSigner,
    chainId: number,
    bundlerUrl: string,
    paymasterUrl: string,
) => {
    console.log("CHAIN ID BICONOMY: ", chainId);
    const bundler = new Bundler({
      bundlerUrl: bundlerUrl,
      chainId: chainId,
      entryPointAddress: DEFAULT_ENTRYPOINT_ADDRESS, // This is a Biconomy constant
    });

    const paymaster = new Paymaster({
        paymasterUrl: paymasterUrl,
    });

  const validationModule = await createValidationModule(walletClient);

  return await createSmartAccountClient({
    signer: walletClient,
    chainId: chainId, // Replace this with your target network
    bundler: bundler, // Use the `bundler` we initialized above
    paymaster: paymaster, // Use the `paymaster` we initialized above
    entryPointAddress: DEFAULT_ENTRYPOINT_ADDRESS, // This is a Biconomy constant
    defaultValidationModule: validationModule, // Use the `validationModule` we initialized above
    activeValidationModule: validationModule, // Use the `validationModule` we initialized above
  });
};

export async function sendTransaction(
  smartAccount: BiconomySmartAccountV2,
  tx: Transaction
): Promise<UserOpReceipt> {
  const userOpResponse = await smartAccount.sendTransaction(tx, {
    paymasterServiceData: {
      mode: PaymasterMode.SPONSORED,
    },
  });
  if (!userOpResponse) {
      throw new Error('Failed to send transaction');
  }

  const { transactionHash } = await userOpResponse.waitForTxHash();
  console.log("Transaction Hash", transactionHash);
  const userOpReceipt = await userOpResponse.wait();
  if (userOpReceipt.success == "true") {
    console.log("UserOp receipt", userOpReceipt);
    console.log("Transaction receipt", userOpReceipt.receipt);
  } else {
    console.error("Transaction Failed: ", userOpReceipt.logs);
    // throw new Error('Failed to send transaction');
  }
    return userOpReceipt;
}

