import '@phala/wapo-env'
import { Hono } from 'hono/tiny'
import { handle } from '@phala/wapo-env/guest'
import { privateKeyToAccount } from 'viem/accounts'
import {
    keccak256,
    http,
    type Address,
    createPublicClient,
    PrivateKeyAccount,
    verifyMessage,
    createWalletClient,
    parseGwei
} from 'viem'
import { spicy } from 'viem/chains'
import superjson from 'superjson'
import  {deployedContracts} from './deployedContracts';
import fs from 'fs';
import axios from 'axios';
//import zlib from 'zlib';


export const app = new Hono()


const publicClient = createPublicClient({
    chain: spicy,
    transport: http(),
})
const walletClient = createWalletClient({
    // account: privateKeyToAccount(`0x${vault?.privateKey}` as `0x${string}`),
    chain: spicy,
    transport: http(),
})

function getECDSAAccount(salt: string): PrivateKeyAccount {
    const derivedKey = Wapo.deriveSecret(salt)
    const keccakPrivateKey = keccak256(derivedKey)
    return privateKeyToAccount(keccakPrivateKey)
}

async function signData(account: PrivateKeyAccount, data: string): Promise<any> {
    let result = {
        derivedPublicKey: account.address,
        data: data,
        signature: ''
    }
    const publicKey = account.address
    console.log(`Signing data [${data}] with Account [${publicKey}]`)
    const signature = await account.signMessage({
        message: data,
    })
    console.log(`Signature: ${signature}`)
    result.signature = signature
    return result
}

async function verifyData(account: PrivateKeyAccount, data: string, signature: any): Promise<any> {
    let result = {
        derivedPublicKey: account.address,
        data: data,
        signature: signature,
        valid: false
    }
    const publicKey = account.address
    console.log("Verifying Signature with PublicKey ", publicKey)
    const valid = await verifyMessage({
        address: publicKey,
        message: data,
        signature,
    })
    console.log("Is signature valid? ", valid)
    result.valid = valid
    return result
}

async function sendTransaction(account: PrivateKeyAccount, to: Address, gweiAmount: string): Promise<any> {
    let result = {
        derivedPublicKey: account.address,
        to: to,
        gweiAmount: gweiAmount,
        hash: '',
        receipt: {}
    }
    console.log(`Sending Transaction with Account ${account.address} to ${to} for ${gweiAmount} gwei`)
    // @ts-ignore
    const hash = await walletClient.sendTransaction({
        account,
        to,
        value: parseGwei(`${gweiAmount}`),
    })
    console.log(`Transaction Hash: ${hash}`)
    const receipt = await publicClient.waitForTransactionReceipt({ hash })
    console.log(`Transaction Status: ${receipt.status}`)
    result.hash = hash
    result.receipt = receipt
    return result
}

app.get('/', async (c) => {
    let vault: Record<string, string> = {}
    try {
        console.log('Secret Processing');
        vault = JSON.parse(process.env.secret || '')
        console.log('Secret Processed', vault);

    } catch (e) {
        console.error('Error parsing secret from vault', e)
        console.error(e)
    }
    let queries = c.req.queries() || {}
    let result = {};
    
    const secretSalt = (vault.secretSalt) ? vault.secretSalt as string : 'SALTY_BAE'
    const getType = (queries.type) ? queries.type[0] as string : ''
    const account = getECDSAAccount(secretSalt)
    const data = (queries.data) ? queries.data[0] as string : ''
    console.log(`Type: ${getType}, Data: ${data}`)

    const walletClientInner = createWalletClient({
        account: privateKeyToAccount(`0x${vault?.privateKey}` as `0x${string}`),
        chain: spicy,
        transport: http(),
    })

    try {
        if (getType == 'sendTx') {
            result = (queries.to && queries.gweiAmount) ?
              await sendTransaction(account, queries.to[0] as Address, queries.gweiAmount[0]) :
              { message: 'Missing query [to] or [gweiAmount] in URL'}
        } else if (getType == 'sign') {
            result = (data) ? await signData(account, data) : { message: 'Missing query [data] in URL'}
        } else if (getType == "challenge") {
            console.log("Challenge");
            //call the smart contract to issue the challenge and return the qid
            const gameId = keccak256(" - "+ Date.now().toString());
            const metadataURI = `https://example.com/challenge/${gameId}`;
            const balance = await publicClient.getBalance({
              address: walletClientInner.account.address, 
            })
            console.log("Balance:", account.address, "  :  ", balance);
            const createGameTx = await walletClientInner.writeContract({
              address: deployedContracts[88882].GameFactory.address as Address,
              abi: deployedContracts[88882].GameFactory.abi,
              functionName: "createGame",
              args: [gameId, "test"],        
            });
            console.log("Contract Write Triggered")
            // const receipt = await publicClient.waitForTransactionReceipt({ hash: createGameTx });
            result = { gameId, metadataURI, balance };
          }  
        else if (getType == 'verify') {
            if (data && queries.signature) {
                result = await verifyData(account, data, queries.signature[0] as string)
            } else {
                result = { message: 'Missing query [data] or [signature] in URL'}
            }
        } else {
            result = { derivedPublicKey: account.address }
        }
    } catch (error) {
        console.error('Error:', error)
        result = { message: error }
    }
    const { json, meta } = superjson.serialize(result)
    return c.json(json)
})

interface WinnerResponse {
    winner: string;
}

app.post('/', async (c) => {
    // const data = await c.req.json()
    // console.log('user payload in JSON:', data)
    const data = await aiChat("test");
    let content = data.choices[0].message.content;
    content = content.replace(/```json\n/, '').replace(/\n```/, '');
        
    // Clean up any remaining backticks
    content = content.replace(/`/g, '');
    // Parse the JSON string from the content
    const winnerJson = JSON.parse(content) as WinnerResponse;
    return c.json(winnerJson.winner)
});

function convertImageToBase64(filePath: string): string {
    const imageBuffer = fs.readFileSync(filePath);
    return imageBuffer.toString('base64');
}

async function downloadImage(url: string, filePath: string): Promise<void> {
    const response = await axios({
        url,
        method: 'GET',
        responseType: 'arraybuffer',
    });
    fs.writeFileSync(filePath, response.data);
}

async function aiChat(questionType:string): Promise<Record<string, any>> {
    // return new Promise((resolve) => {
    //   resolve({
    //     content: "Do ten burpies in 2 minutes!"
    //   });
    // });
    // AI Response: { messages: [ { role: 'system', content: 'Reply with a challenge question, that challenges players to a burpies competition for 2 minutes' } ] }
    
/*

    await downloadImage('https://github.com/test-images/png/blob/main/202105/cs-blue-00f.png', '.png');
    await downloadImage('https://github.com/test-images/png/blob/main/202105/cs-gray-7f7f7f.png', '/home/wapo/.png');
TODO: Add resizing logic and make this dynamic
    */
    const image1 ="data:image/jpeg;base64,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";
    const image2 = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAAQSURBVHjaYvj//z8DQIABAAj8Av7bok0WAAAAAElFTkSuQmCC";


    let vault: Record<string, string> = {};
    let result: Record<string, any> = {};
    vault = JSON.parse(process.env.secret || "");
    const redPillKey = vault.apiKey ? (vault.apiKey as string) : "";

    const prompt = `
    Compare these two images in terms of visual appeal and emotional impact.
    Choose 1 image from below for its expressiveness and return as 1 or 2 in the form a json {"winner": "1" or "2"}:
    - Image 1: ${image1}
    - Image 2: ${image2}
    `;

    return fetch("https://api.red-pill.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${redPillKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
            { role: 'system', content: 'You are an image analysis assistant. That responds to every request in the form of a json' },
            { role: 'user', content: prompt },
        ],
      }),
    })
      .then((response) => response.json() as Promise<Record<string, any>>)
      .then((data: Record<string, any>) => {
        console.log("AI Response:", data);
        return data;
      })
      .catch((error) => {
        console.error("Error:", error);
        throw new Error("Failed to fetch AI response");
      });
      
  }

  
export default handle(app)
