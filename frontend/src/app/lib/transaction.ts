"use client";

import { BiconomySmartAccountV2 } from "@biconomy/account";
import { Abi, encodeFunctionData, Hex, WalletClient } from "viem";
import GameABI from "../../../../foundry/deployments/deployedContracts";
import { sendTransaction } from "../lib/biconomy";

export async function addPlayer(
  smartAccount: BiconomySmartAccountV2,
  gameId: string,
) {
  console.log("game id : ", gameId);
  const encodedCall = encodeFunctionData({
    abi: GameABI["10200"].GameController.abi,
    functionName: "joinGame",
    args: [gameId as any],
  });
  const transaction = {
    to: GameABI["10200"].GameController.address,
    data: encodedCall,
  };
  await sendTransaction(smartAccount, transaction);
}

export async function placeBet(
  smartAccount: BiconomySmartAccountV2,
  playerId: number,
  betAmount: number,
) {
  console.log("betAmount : ", betAmount);
  const encodedCall = encodeFunctionData({
    abi: GameABI["88882"].Game.abi,
    functionName: "placeBet",
    args: [playerId as any, betAmount as any],
  });
  const transaction = {
    to: "0x26a1253fb1b881554eb95cb487d1a5ee5593ec0b",
    data: encodedCall,
  };
  await sendTransaction(smartAccount, transaction);
}

export async function placeWagerWalletClient(
    gameAddress: Hex,
  walletClient: WalletClient,
  playerId: number,
  betAmount: number,
) {
  // console.log([BigInt(playerId),BigInt(betAmount)])
  await walletClient.writeContract({
    address: gameAddress,
    abi: GameABI["88882"].Game.abi as Abi,
    functionName: "placeBet",
    args: [BigInt(playerId), BigInt(betAmount)],
  } as any);
}

export async function approve(gameAddress: Hex, walletClient: WalletClient, betAmount: number) {
  console.log("betAmount : ", betAmount);
  await walletClient.writeContract({
    address: GameABI["88882"].Token.address,
    abi: GameABI["88882"].Token.abi as Abi,
    functionName: "approve",
    args: [
      gameAddress,
      BigInt(betAmount * 10 ** 18),
    ],
  } as any);
}
