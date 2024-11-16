/* eslint-disable react/jsx-key */
import { Button } from "frames.js/next";
import { frames } from "@/app/frames/frames";

const handler = frames(async (ctx) => {
  let iAm: string | undefined;
  const gameId = ctx.searchParams.id;

  if (ctx.message) {
    iAm = (await ctx.message.walletAddress()) ?? "anonymous";
  }
  console.log(`Current user: ${iAm}`);
  return {
    image:
      "https://static.vecteezy.com/system/resources/previews/022/076/846/non_2x/children-sit-at-table-doing-joint-creativity-draw-pictures-using-watercolor-or-gouache-boy-and-girl-with-brushes-in-their-hands-participate-in-kids-creativity-competition-vector.jpg",
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
