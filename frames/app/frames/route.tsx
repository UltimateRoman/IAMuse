/* eslint-disable react/jsx-key */
import { Button } from "frames.js/next";
import { frames } from "@/app/frames/frames";
import { appURL } from "@/lib/util";

const handler = frames(async (ctx) => {
  let iAm: string | undefined;
  const gameId = ctx.searchParams.id;

  if (ctx.message) {
    iAm = (await ctx.message.walletAddress()) ?? "anonymous";
  }
  console.log(`Current user: ${iAm}`);
  return {
    image:
      appURL() + "/art.png",
    imageOptions: {
      headers: {
        "Cache-Control": "max-age=1",
      },
    },
    buttons: [
      <Button
        action="post"
        target={{ pathname: "/gameDetails", query: { id: gameId } }}
      >
        Lets go!!
      </Button>,
    ],
  };
});

export const GET = handler;
export const POST = handler;
