"use client";
import React from "react";
import { Button } from "./components/ui/button";
import { Card, CardContent, CardHeader } from "./components/ui/card";
import Link from "next/link";
import { useRouter } from "next/navigation";

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
  const router = useRouter();
  const handleJoinClick = (id: string) => {
    router.push(`/terms/${id}`);
  };
  const handleCreateClick = () => {
    router.push(`/challenge`);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">
      <div className="w-full max-w-6xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        <div className="flex justify-between items-center mb-8 sm:mb-12">
          <div className="flex justify-between items-center">
            <Link
              href="/chat"
              className="relative inline-flex items-center justify-center p-1 mb-2 me-2 overflow-hidden text-base font-extrabold text-gray-900 rounded-full group bg-gradient-to-br from-purple-600 to-blue-500 group-hover:from-purple-600 group-hover:to-blue-500 hover:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800"
            >
              <span className="relative px-6 py-3 transition-all ease-in duration-75 bg-white hover:text-white rounded-full group-hover:bg-opacity-0">
                Chatbot
              </span>
            </Link>
            <button className="relative inline-flex items-center justify-center p-1 mb-2 me-2 overflow-hidden text-base font-extrabold text-gray-900 rounded-full group bg-gradient-to-br from-purple-600 to-blue-500 group-hover:from-purple-600 group-hover:to-blue-500 hover:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800">
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
                      onClick={() => handleJoinClick(`${game.id}`)}
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
