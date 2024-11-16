import { handlePromoteSubBot } from "./handler/promotionBot.js";
import type { SkillGroup } from "@xmtp/message-kit";

export const skills: SkillGroup[] = [
  {
    name: "Promotion Subscription Bot",
    tag: "@promotionBot",
    description: "Get notifiactions on new games and promote contentders of a game.",
    skills: [
      {
        command: "/help",
        triggers: ["/help"],
        handler: handlePromoteSubBot,
        description:
          "Show help menu.",
        examples: ["/help"],
        params: {},
      },
      {
        command: "/subscribe [category]",
        triggers: ["/subscribe"],
        handler: handlePromoteSubBot,
        description:
          "Subscribe to a catgory of games",
        examples: ["/subscribe physical", "/subscribe all"],
        params: {
          category: {
            type: "string",
          },
        },
      },
      {
        command: "/unsubscribe [category]",
        triggers: ["/unsubscribe"],
        handler: handlePromoteSubBot,
        description:
          "Unsubscribe from a catgory of games",
        examples: ["/unsubscribe physical", "/subscribe all"],
        params: {
          category: {
            type: "string",
          },
        },
      },
      {
        command: "/show [gameId]",
        triggers: ["/show"],
        handler: handlePromoteSubBot,
        description:
          "Show game frame",
        examples: ["/show 1"],
        params: {
          gameId: {
            type: "string",
          },
        },
      },
      {
        command: "/categories",
        triggers: ["/categories"],
        handler: handlePromoteSubBot,
        description:
          "Show all categories",
        examples: ["/categories"],
        params: {},
      },
      {
        command: "/mysubscriptions",
        triggers: ["/mysubscriptions"],
        handler: handlePromoteSubBot,
        description:
          "Show you subscriptions",
        examples: ["/mysubscriptions"],
        params: {},
      },
      {
        command: "/reset",
        triggers: ["/reset"],
        examples: ["/reset"],
        handler: handlePromoteSubBot,
        description: "Reset the conversation.",
        params: {},
      },
      {
        command: "/notify [category] [gameId]",
        triggers: ["/notify"],
        handler: handlePromoteSubBot,
        description:
          "Send notification",
        examples: [],
        params: {
          category: {
            type: "string",
          },
          gameId: {
            type: "string",
          },
        },
      },
    ],
  },
];
