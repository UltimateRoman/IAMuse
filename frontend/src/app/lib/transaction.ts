"use client";

import {
  BiconomySmartAccountV2,
} from "@biconomy/account";
import { encodeFunctionData } from "viem";
import GameABI from "../../../../foundry/deployments/deployedContracts";
import {sendTransaction} from '../lib/biconomy'

export async function addPlayer(
  smartAccount: BiconomySmartAccountV2,
  gameId: string
) {
    console.log("game id : ",gameId);
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

export async function getPlayers(
  smartAccount: BiconomySmartAccountV2,
  gameId: string
) {
    console.log("game id : ",gameId);
  const encodedCall = encodeFunctionData({
    abi: GameABI["10200"].GameController.abi,
    functionName: "getPlayers",
    args: [gameId as any],
  });
  const transaction = {
    to: GameABI["10200"].GameController.address,
    data: encodedCall,
  };
  await sendTransaction(smartAccount, transaction);
}