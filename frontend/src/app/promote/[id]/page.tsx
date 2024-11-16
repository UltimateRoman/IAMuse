"use client";
import React, { useEffect, useState } from "react";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader } from "../../components/ui/card";
import { useParams } from "next/navigation";
import createApolloClient from "../../lib/appolo-client";
import { gql } from "@apollo/client";
import { createWalletClient, custom, Hex, WalletClient } from "viem";
import { spicy } from "viem/chains";
import { approve, placeWagerWalletClient } from "@/app/lib/transaction";

const MainPage = () => {
  const [challenger_1_Address, setChallenger_1_Address] = useState("address1");
  const [challenger_2_Address, setChallenger_2_Address] = useState("address2");
  const { id } = useParams();
  const [games, setGames] = useState(null);
  // console.log("id : ", id);
  const appoloClient = async () => {
    const client = createApolloClient();
    const { data } = await client.query({
      query: gql`
        query gameCreateds {
          gameCreateds {
            id
            gameId
            game
            metadataURI
            status
          }
        }
      `,
    });
    // console.log("Games: ", data);
    //@ts-ignore
    setGames(data.gameCreateds.find((game) => game.game === id));
    // console.log(data.gameCreateds.find((game) => game.gameId === id))
  }
  console.log("id : ", id);
  const [wagerAmount, setWagerAmount] = useState(0)
  // const {wagerSmartAccount} = useContext(WalletContext);
  const [walletClient, setWalletClient] = useState<WalletClient>()


  useEffect(() => {
      async function init() {
          if (!walletClient) {
              const [account] = await window.ethereum!.request({ method: 'eth_requestAccounts' })
              console.log("ACCOUNT: ", account);
              const client = createWalletClient({
                  account: account as `0x{string}`,
                  chain: spicy,
                  transport: custom(window.ethereum!)
              })
              await client.switchChain({ id: spicy.id })
              setWalletClient(client)
          }
      }
      init();
  }, []);

  const handlePromoterChallenger = async  (challengerId: number) => {
      // if (!wagerSmartAccount) return;
      if (!walletClient) return;
      await approve(id as Hex, walletClient, wagerAmount)
      await placeWagerWalletClient(id as Hex, walletClient, challengerId, wagerAmount)
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;
      setWagerAmount(value === '' ? 0 : parseFloat(value));
  };

  useEffect(() => {
    appoloClient();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white text-white">
      <div className="w-full max-w-6xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {games ? (
            <Card
              key={games?.id}
              className="transform hover:scale-105 transition-all duration-300 bg-gray-800 shadow-xl rounded-lg overflow-hidden"
            >
              <CardHeader title={games.gameId}></CardHeader>
              <CardContent>
                <p className="mb-4 text-gray-300">{games.metadataURI}</p>
                <div className="flex flex-col items-center mt-4 space-y-4">
                  <div className="flex justify-between items-center space-x-8">
                    <div className="flex flex-col items-center">
                      <img
                        src={`https://noun-api.com/beta/pfp?name=${challenger_1_Address}`}
                        alt="Avatar 1"
                        className="w-14 h-14 rounded-full mb-2 border-2 border-blue-500"
                      />
                    </div>
                    <div className="flex items-center">
                      <input
                        onChange={handleChange}
                        value={wagerAmount ?? '0'}
                        type="number"
                        placeholder="Enter your input"
                        className="w-full max-w-sm px-4 py-2 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div className="flex flex-col items-center">
                      <img
                        src={`https://noun-api.com/beta/pfp?name=${challenger_2_Address}`}
                        alt="Avatar 2"
                        className="w-14 h-14 rounded-full mb-2 border-2 border-purple-500"
                      />
                    </div>
                  </div>
                  <div className="flex justify-between items-center w-full space-x-8">
                    <Button
                      onClick={() => handlePromoterChallenger(0)}
                      variant="primary"
                      className="hover:text-white relative inline-flex p-2 overflow-hidden text-base font-extrabold border-gray-600 hover:bg-gray-700 bg-gray-200"
                    >
                      Promote Challenger 1
                    </Button>
                    <Button
                      onClick={() => handlePromoterChallenger(1)}
                      variant="primary"
                      className="hover:text-white relative inline-flex p-2 overflow-hidden text-base font-extrabold border-gray-600 hover:bg-gray-700 bg-gray-200"
                    >
                      Promote Challenger 2
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <p className="text-gray-400">Game not found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default MainPage;
