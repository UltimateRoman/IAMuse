/* eslint-disable react/jsx-key */
import { Button } from "frames.js/next";
import { frames } from "@/app/frames/frames";

const handleRequest = frames(async (ctx) => {
  let iAm: string | undefined;

  if (ctx.message) {
    iAm = (await ctx.message.walletAddress()) ?? "anonymous";
  }
  const gameId = ctx.searchParams.id
  console.log(`Current user: ${iAm}`); 

  const contenders = [
    {
      name: "Contender 1",
      skill: "8/10",
      creativity: "7/10",
      talent: "150+",
      pastGamesWon: "10",
    },
    {
      name: "Contender 2",
      skill: "9/10",
      creativity: "8/10",
      talent: "180+",
      pastGamesWon: "15",
    },
  ];

  return {
    image: (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "20px",
          position: "relative",
          width: "100%",
          gap: "20px",
          height: "100%",
          flexDirection: "column",
          backgroundColor: "#ff7e5f"
        }}
        tw="bg-gray-700 text-white text-[24px] shadow-lg rounded-md overflow-hidden"
      >
        

        <h1
          style={{
            color: "#FFFFFF",
            fontWeight: "bold",
            textAlign: "center",
            opacity:"unset",
            paddingBottom: "90px"
          }}
        >
          Join the excitement and promote your favorite contender in the
          ultimate creativity competition!
        </h1>

        <div
          style={{
            display: "flex",
            justifyContent: "space-around",
            width: "100%",
          }}
        >
          {contenders.map((contender, index) => (
            <div
              key={index}
              style={{
                backgroundColor: "rgba(0, 0, 0, 0.6)",
                padding: "10px",
                width: "40%",
                marginLeft: index === 0 ? "5px" : "0",
                marginRight: index === 1 ? "5px" : "0",
                textAlign: "center",
              }}
              tw="flex flex-col items-center"
            >
              <h2 tw="text-3xl font-semibold mb-2">{contender.name}</h2>
              <hr tw="w-3/4 border-white" />
              <p tw="text-3xl mb-2">Creativity: {contender.creativity}</p>
              <p tw="text-3xl mb-2">Past Games Won: {contender.pastGamesWon}</p>
            </div>
          ))}
        </div>
      </div>
    ),
    imageOptions: {
      width: 100,
      height: 100,
    },
    textInput: "Enter Promotion Amount",
    buttons: [
        <Button action="post" target="/gameDetails">
            Go Back
        </Button>,
        <Button 
            action="post"
            target={{
                pathname: "/promotionTx",
                query: { 
                    id: gameId,
                    voteValue: true
                }
            }}
        >
            Promote Contender 1
        </Button>,
        <Button 
            action="post"
            target={{
                pathname: "/promotionTx",
                query: { 
                    id: gameId,
                    voteValue: false 
                }
            }}
        >
            Promote Contender 2
        </Button>,
    ],
  };
});

export const GET = handleRequest;
export const POST = handleRequest;

// <img
//           src="https://static.wikia.nocookie.net/kungfupanda/images/a/a3/PoTraining1.jpg/revision/latest/scale-to-width-down/1200?cb=20110804052139"
//                         alt="Background"
//                     tw="absolute w-full h-full object-cover opacity-80"
//                             />
