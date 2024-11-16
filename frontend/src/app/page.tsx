  "use client";
  import React, { useState, useContext, useEffect } from "react";
  import { Button } from "./components/ui/button";
  import { Card, CardContent, CardHeader } from "./components/ui/card";
  import Link from "next/link";
  import { useRouter } from "next/navigation";
  import { DynamicWidget } from "@dynamic-labs/sdk-react-core";
  import CirclesSDKContext from "./circles/circles";
import { AvatarInterface } from "@circles-sdk/sdk";
import { WalletContext } from "./lib/walletProvider";

  const games = [
    {
      id: 1,
      title: "Game 1",
      description: "This is the description for Game 1. Who are you betting on?",
      challenger_1: "Challenger 1A",
      challenger_2: "Challenger 1B",
    },
    {
      id: 2,
      title: "Game 2",
      description: "This is the description for Game 2. Who are you betting on?",
      challenger_1: "Challenger 2A",
      // challenger_2 is missing
    },
    {
      id: 3,
      title: "Game 3",
      description: "Do you want to join this game?",
      // challengers are missing
    },
    {
      id: 4,
      title: "Game 4",
      description: "This is the description for Game 4. Who are you betting on?",
      challenger_1: "Challenger 4A",
      challenger_2: "Challenger 4B",
    },
    {
      id: 5,
      title: "Game 5",
      description: "This is the description for Game 5. Who are you betting on?",
      challenger_1: "Challenger 5A",
      // challenger_2 is missing
    },
  ];

  const MainPage = () => {
    const [alertMessage, setAlertMessage] = useState<string | null>(null);
    const { sdk } = useContext(CirclesSDKContext);
    const [avatar, setAvatar] = useState<AvatarInterface>();
    const {smartAccount, isLoading} = useContext(WalletContext);

    const router = useRouter();
    const handleJoinClick = (id: string) => {
      router.push(`/join/${id}`);
    };
    const handleCreateClick = async () => {
      console.log("Invoking Create game API");
      const response = await fetch(`http://localhost:3001/createGame`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          gameId: "123123123n213",
        }),
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
            const userAvatar = await sdk.getAvatar(await smartAccount.getAccountAddress(), true)
            if (!userAvatar) {
                console.log("Registering human");
                const registeredAvatar = await sdk.registerHuman();
                console.log("avatar : ", registeredAvatar);
                setAvatar(registeredAvatar)
                return;
            }
            console.log("Got avatar");
            setAvatar(userAvatar)
        }
      }
    };

    useEffect(() => {
      human();
    }, [sdk]);

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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {games.map((game) => (
              <Card
                key={game.id}
                className="transform hover:scale-105 transition-all duration-300 bg-gray-800 shadow-lg rounded-lg overflow-hidden"
              >
                <CardHeader
                  title={game.title}
                  onDetailsClick={
                    game.challenger_1 && game.challenger_2
                      ? () => {
                          console.log(`More details for ${game.title}`);
                        }
                      : undefined
                  }
                ></CardHeader>

                <CardContent>
                  <p className="mb-4 text-gray-400">{game.description}</p>
                  <div className="flex justify-between space-x-4 items-center">
                    {game.challenger_1 && game.challenger_2 ? (
                      <>
                        <div className="flex flex-col items-center">
                          <img
                            src={`https://noun-api.com/beta/pfp?name=${game.challenger_1}`}
                            alt="Avatar 1"
                            className="w-10 h-10 rounded-full mb-2"
                          />
                        </div>
                        <Button
                          onClick={() => handlePromoteClick(`${game.id}`)}
                          variant="primary"
                          className="hover:text-white relative inline-flex items-center justify-center p-1 mb-2 me-2 overflow-hidden text-base font-extrabold border-gray-600 hover:bg-gray-700 w-1/2 bg-gray-200"
                        >
                          Promote a player
                        </Button>
                        <div className="flex flex-col items-center">
                          <img
                            src={`https://noun-api.com/beta/pfp?name=${game.challenger_2}`}
                            alt="Avatar 2"
                            className="w-10 h-10 rounded-full mb-2"
                          />
                        </div>
                      </>
                    ) : (
                      <div className="flex w-full items-center justify-center ">
                        <Button
                          onClick={() => handleJoinClick(`${game.id}`)}
                          variant="primary"
                          className="hover:text-white relative inline-flex p-1 mb-2 me-2 overflow-hidden text-base font-extrabold border-gray-600 hover:bg-gray-700 w-1/2 bg-gray-200"
                        >
                          Join game
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  };

  export default MainPage;
