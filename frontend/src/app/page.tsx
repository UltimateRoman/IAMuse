"use client";
import React, { useEffect, useState, useContext } from "react";
import { Button } from "./components/ui/button";
import { Card, CardContent, CardHeader } from "./components/ui/card";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { DynamicWidget } from "@dynamic-labs/sdk-react-core";
import createApolloClient from "./lib/appolo-client";
import { gql } from "@apollo/client";
import CirclesSDKContext from "./circles/circles";
import { AvatarInterface } from "@circles-sdk/sdk";
import { WalletContext } from "./lib/walletProvider";
import { addPlayer } from "./lib/transaction";

interface Game {
  id: string;
  gameId: string;
  game: string;
  metadataURI: string;
  status: number;
}

const MainPage = () => {
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [games, setGameIDs] = useState<Game[]>([]);
  const { sdk } = useContext(CirclesSDKContext);
  const [avatar, setAvatar] = useState<AvatarInterface>();
  const { smartAccount, isLoading } = useContext(WalletContext);

  const router = useRouter();
  const handleJoinClick = (id: string) => {
    if (smartAccount) {
      addPlayer(smartAccount, id);
    }
    router.push(`/join/${id}`);
  };
  const handleCreateClick = async () => {
    console.log("Invoking Create game API");
    const response = await fetch(`http://localhost:3001/createGame`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    setAlertMessage(
      `Game successfully created. Please check your game: ${data.gameId}`
    );
    console.log("Output : ", data);
  };
  const handlePromoteClick = (id: string) => {
    router.push(`/promote/${id}`);
  };

  const human = async () => {
    if (sdk && !avatar) {
      if (!isLoading && smartAccount) {
        const registeredAvatar = await sdk.registerHuman();
        console.log("avatar : ", registeredAvatar);
        setAvatar(registeredAvatar);
        return;
      }
    }
  };
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
    // console.log("Appolo: ", data);
    setGameIDs(data.gameCreateds);
  };

  useEffect(() => {
    appoloClient();
  }, []);

  useEffect(() => {
    // human();
  }, [sdk]);

  const sortedGames = games.reduce(
    (acc, game) => {
      if (game.status === 0) acc[0].push(game);
      else if (game.status === 1) acc[1].push(game);
      else acc[2].push(game);
      return acc;
    },
    { 0: [] as Game[], 1: [] as Game[], 2: [] as Game[] }
  );

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">
      {alertMessage && (
        <div
          className="fixed top-2 left-2 right-2 z-50 p-6 mb-4 text-green-900 font-bold border-2 border-green-200 rounded-lg bg-green-50 shadow-xl dark:bg-gray-800 dark:text-green-300 dark:border-green-600"
          role="alert"
        >
          <div className="flex items-center">
            <svg
              className="flex-shrink-0 w-5 h-5 me-3 text-green-800 dark:text-green-400"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
            </svg>
            <span className="sr-only">Success</span>
            <h3 className="text-lg font-semibold text-green-800 dark:text-green-400">
              Success!
            </h3>
          </div>
          <div className="mt-2 mb-4 text-sm font-medium text-green-800 dark:text-green-200">
            {alertMessage}
          </div>
          <div className="flex">
            <button
              type="button"
              className="text-white bg-green-800 hover:bg-green-900 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-xs px-5 py-2.5 text-center dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
              onClick={() => setAlertMessage(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}

      <div className="w-full max-w-6xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        <div className="flex justify-between items-center mb-8 sm:mb-12">
          <DynamicWidget />
          <div className="flex justify-between items-center">
            <Link
              href="/chat"
              className="relative inline-flex items-center justify-center p-1 mb-2 me-2 overflow-hidden text-base font-extrabold text-gray-900 rounded-full group bg-gradient-to-br from-purple-600 to-blue-500 group-hover:from-purple-600 group-hover:to-blue-500 hover:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800"
            >
              <span className="relative px-6 py-3 transition-all ease-in duration-75 bg-white hover:text-white rounded-full group-hover:bg-opacity-0">
                Chatbot
              </span>
            </Link>
            <button
              onClick={handleCreateClick}
              className="relative inline-flex items-center justify-center p-1 mb-2 me-2 overflow-hidden text-base font-extrabold text-gray-900 rounded-full group bg-gradient-to-br from-purple-600 to-blue-500 group-hover:from-purple-600 group-hover:to-blue-500 hover:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800"
            >
              <span className="relative px-6 py-3 transition-all ease-in duration-75 bg-white hover:text-white rounded-full group-hover:bg-opacity-0">
                Create a game
              </span>
            </button>
          </div>
        </div>
        <div className="space-y-12">
          {Object.entries(sortedGames).map(([status, gamesForStatus]) => (
            <div key={status}>
              <h2 className="text-2xl font-bold mb-6 text-gray-300">
                {status === "0"
                  ? "Open Games"
                  : status === "1"
                  ? "Active Games"
                  : "Completed Games"}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {gamesForStatus.map((game) => (
                  <Card
                    key={game.id}
                    className="transform hover:scale-105 transition-all duration-300 bg-gray-800 shadow-lg rounded-lg overflow-hidden"
                  >
                    <CardHeader title={game.gameId}></CardHeader>

                    <CardContent>
                      <p className="mb-4 text-gray-400">{game.metadataURI}</p>
                      <div className="flex justify-between space-x-4 items-center">
                        {game.status == 1 ? (
                          <>
                            <div className="flex flex-col items-center">
                              <img
                                src={`https://noun-api.com/beta/pfp?name=${game.gameId}1`}
                                alt="Avatar 1"
                                className="w-10 h-10 rounded-full mb-2"
                              />
                            </div>
                            <Button
                              onClick={() => handlePromoteClick(`${game.game}`)}
                              variant="primary"
                              className="hover:text-white relative inline-flex items-center justify-center p-1 mb-2 me-2 overflow-hidden text-base font-extrabold border-gray-600 hover:bg-gray-700 w-1/2 bg-gray-200"
                            >
                              Promote a player
                            </Button>
                            <div className="flex flex-col items-center">
                              <img
                                src={`https://noun-api.com/beta/pfp?name=${game.gameId}2`}
                                alt="Avatar 2"
                                className="w-10 h-10 rounded-full mb-2"
                              />
                            </div>
                          </>
                        ) : game.status == 0 ? (
                          <div className="flex w-full items-center justify-center ">
                            <Button
                              onClick={() => handleJoinClick(`${game.game}`)}
                              variant="primary"
                              className="hover:text-white relative inline-flex p-1 mb-2 me-2 overflow-hidden text-base font-extrabold border-gray-600 hover:bg-gray-700 w-1/2 bg-gray-200"
                            >
                              Join game
                            </Button>
                          </div>
                        ) : (
                          <div className="flex w-full items-center justify-center ">
                            <Button
                              variant="primary"
                              className="hover:text-white relative inline-flex p-1 mb-2 me-2 overflow-hidden text-base font-extrabold border-gray-600 hover:bg-gray-700 w-1/2 bg-gray-200"
                            >
                              Redeem
                            </Button>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MainPage;
