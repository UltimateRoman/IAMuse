import { createPublicClient, createWalletClient, custom, http } from 'viem'
import { spicy } from 'viem/chains'
 
export const publicClient = createPublicClient({
  chain: spicy,
  transport: http()
})

export const client = createWalletClient({
  chain: spicy,
  transport: custom(window.ethereum!)
})