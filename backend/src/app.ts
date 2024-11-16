import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { initializeDatabase, insertGame, getGames, getGameFinalizedStatus, setGameFinalizedStatus } from './sql';
import cron from 'node-cron';
import axios from 'axios';
const app = express();
import { ethers } from 'ethers'; 
import dotenv from 'dotenv';
dotenv.config();

const port = process.env.PORT || 3001;
app.use(cors());

app.use(bodyParser.json());

initializeDatabase();

const contractFactoryABI=[
    {
        type: "function",
        name: "getGame",
        inputs: [
          {
            name: "gameId",
            type: "bytes32",
            internalType: "bytes32",
          },
        ],
        outputs: [
          {
            name: "",
            type: "address",
            internalType: "address",
          },
        ],
        stateMutability: "view",
      }
]
const contractGameABI = [
    {
        type: "function",
        name: "prepareForBidding",
        inputs: [
          {
            name: "outcomeSlotCount",
            type: "uint256",
            internalType: "uint256",
          },
        ],
        outputs: [],
        stateMutability: "nonpayable",
      },
      {
        type: "function",
        name: "finishGame",
        inputs: [
          {
            name: "_winnerId",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "_winnerAddress",
            type: "address",
            internalType: "address",
          },
        ],
        outputs: [],
        stateMutability: "nonpayable",
      }
];

app.get('/', (req, res) => {
    res.send('Hello are you amused?');
});

app.get('/games', async (req, res) => {
    try {
        const games = await getGames(); // Assuming getGames is a function that retrieves the list of games from the database
        res.json(games);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve games' });
    }
});

app.post('/createGame', async (req, res) => {
    const { gameId } = req.body;
    console.log(req.body);

    const response = await axios.get('https://wapo-testnet.phala.network/ipfs/QmU2dNBThEQVdM8RuqyivySQuy4dQ56Scvn1f4ZfQ6ANxe', {
        params: {
            key: '1ddc090cfb263f49',
            type: 'challenge'
        }
    });

    const game = response.data;
    

    const timestamp = new Date().toISOString();
    await sleep(5000);
    const gameAddress = await getGameAddress(game.gameId)

    insertGame(game.gameId, timestamp, gameAddress);
    scheduleApiCall(game.gameId, gameAddress);
    // Setup the provider and wallet (replace with your actual RPC URL and private key)

    // Define the contract's ABI and address
    const contractFactoryAddress = process.env.GAME_FACTORY_ADDRESS||''; // Replace with the smart contract's address
        
    res.json({ gameId: game.gameId });
});

app.post('/finishGame', async (req, res) => {
    const { gameAddress, winnerAddress, winnerId, chainId } = req.body;
    await callFinishGame(winnerId, winnerAddress, gameAddress, chainId)
    res.json({ gameAddress: gameAddress });
});

function sleep(ms:number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

async function getGameAddress(gameId:string) {
    try {
        // Set up provider and contract
        const provider = new ethers.JsonRpcProvider(process.env.CHILLIZ_RPC_URL); //TODO: Add Flow RPC URL
        const wallet = new ethers.Wallet(process.env.WALLET_PRIVATE_KEY||'', provider); // Replace 'YOUR_PRIVATE_KEY' with your private key
    
        // Create contract instance
        const contract = new ethers.Contract(process.env.GAME_FACTORY_ADDRESS||'', contractFactoryABI, provider);

        // Call the `getGame` function
        const gameAddress = await contract.getGame(gameId);

        console.log(`Game Address for gameId ${gameId}: ${gameAddress}`);
        return gameAddress;
    } catch (error) {
        console.error('Error calling getGame:', error);
        throw error;
    }
}


function scheduleApiCall(gameId: string, gameAddress: string) {

    cron.schedule('* * * * *', async () => {
        try {
                const isFinalized = await getGameFinalizedStatus(gameId);
                if (isFinalized) {
                    console.log(`Game ${gameId} is finalized. Stopping the scheduled task.`);
                    cron.getTasks().forEach(task => task.stop());
                    return;
                }
                else{
                    await callStartBidding(gameId, gameAddress, 88882);
                    console.log(`Called another API for gameId: ${gameId}`);    
                    await setGameFinalizedStatus(gameId)
                }

        } catch (error) {
            console.error('Failed to call another API:', error);
        }
    }, {
        scheduled: true,
        timezone: "UTC"
    });
}



//0xc5a5F537d8861143EFa4DD1585B44A90C3de1953 -- winning address
async function callStartBidding(gameId: string, gameAddress:string, chainId: number) {
    try {
        // Setup the provider and wallet (replace with your actual RPC URL and private key)
        const provider = new ethers.JsonRpcProvider(process.env.CHILLIZ_RPC_URL); //TODO: Add Flow RPC URL
        const wallet = new ethers.Wallet(process.env.WALLET_PRIVATE_KEY||'', provider); // Replace 'YOUR_PRIVATE_KEY' with your private key

        // Define the contract's ABI and address
        const contractGameAddress = gameAddress||''; // Replace with the smart contract's address
        

        // Create a contract instance
        const contract = new ethers.Contract(contractGameAddress, contractGameABI, wallet);

        // Call the function on the smart contract
        const tx = await contract.prepareForBidding(2);
        console.log(`Transaction submitted: ${tx.hash}`);

        // Wait for the transaction to be confirmed
        await tx.wait();
        console.log('Transaction confirmed!');
    } catch (error) {
        console.error('Failed to call the smart contract:', error);
    }
}


async function callFinishGame(winnerId: number, winnerAddress:string, gameAddress:string, chainId: number) {
    try {
        // Setup the provider and wallet (replace with your actual RPC URL and private key)
        const provider = new ethers.JsonRpcProvider(process.env.CHILLIZ_RPC_URL); //TODO: Add Flow RPC URL
        const wallet = new ethers.Wallet(process.env.WALLET_PRIVATE_KEY||'', provider); // Replace 'YOUR_PRIVATE_KEY' with your private key

        // Define the contract's ABI and address
        const contractGameAddress = gameAddress||''; // Replace with the smart contract's address
        

        // Create a contract instance
        const contract = new ethers.Contract(contractGameAddress, contractGameABI, wallet);

        // Call the function on the smart contract
        const tx = await contract.finishGame(2, winnerAddress);
        console.log(`Transaction submitted: ${tx.hash}`);

        // Wait for the transaction to be confirmed
        await tx.wait();
        console.log('Transaction confirmed!');
    } catch (error) {
        console.error('Failed to call the smart contract:', error);
    }
}

export default app;
