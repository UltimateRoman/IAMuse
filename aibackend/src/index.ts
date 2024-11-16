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

app.post('/', async (c) => {
    const data = await c.req.json()
    console.log('user payload in JSON:', data)
    await aiChat("test");
    return c.json(data)
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

    await downloadImage('https://github.com/test-images/png/blob/main/202105/cs-blue-00f.png', 'SB_LogoH_Dark.png');
    await downloadImage('https://github.com/test-images/png/blob/main/202105/cs-gray-7f7f7f.png', '/home/wapo/SB_LogoH_White.png');
*/
    const image1 = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII="//convertImageToBase64("/home/wapo/SB_LogoH_Dark.png");
    const image2 = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAAQSURBVHjaYvj//z8DQIABAAj8Av7bok0WAAAAAElFTkSuQmCC"//convertImageToBase64("/home/wapo/SB_LogoH_White.png");


    let vault: Record<string, string> = {};
    let result: Record<string, any> = {};
    vault = JSON.parse(process.env.secret || "");
    const redPillKey = vault.apiKey ? (vault.apiKey as string) : "";

    const prompt = `
    Compare these two images in terms of visual appeal and emotional impact.
    Highlight the differences and explain which image feels more joyous or engaging:
    - Image 1: ${image1}
    - Image 2: ${image2}
    `;

    return fetch("https://api.red-pill.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: "Bearer sk-1wOov65bo9vQtJB7D9vFp8UpnwsNgEfR9J23RoA4eEQXJKy4",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
            { role: 'system', content: 'You are an image analysis assistant.' },
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
