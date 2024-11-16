import "dotenv/config";
import { HandlerContext, SkillResponse } from "@xmtp/message-kit";
import { clearInfoCache } from "../lib/resolver.js";
import { clearMemory, clearMemoryOfUser } from "../lib/gpt.js";
import { skills } from "../skills.js";
import { addSubscriberToCategory, getAllCategories, getCategoriesBySubscriber, getSubscribersByCategory, removeSubscriberFromCategory } from "../lib/redis.js";
import { notifySubscribers } from "../lib/notifiacation.js";

export const frameUrl = process.env.FRAMES_URL || "http://localhost:3000/frames/";

const ADMINS: string[] =  [
    // "0x..."
]

export async function handlePromoteSubBot(
  context: HandlerContext,
): Promise<SkillResponse> {
  const {
    message: {
      content: { command, params },
      sender,
    },
    skill,
  } = context;
  if (command == "reset") {
    clearMemoryOfUser(sender.address);
    return { code: 200, message: "Conversation reset." };
  } else if (command == "help" || command == "hi") {
      let msg = "Help menu:-\n";
      msg += skills[0].skills.map((skill) => `${skill.command} - ${skill.description}\nExample: ${skill.examples}`).join("\n\n")
    return { code: 200, message: msg};
  } else if (command == "categories") {
      let categories = await getAllCategories();
      let msg = "Available Categoriies are:-\n";
      msg += categories.map((c, idx) => `${idx+1}. ${c}`).join("\n")
    return { code: 200, message: msg};
  } else if (command == "mysubscriptions") {
      if (!sender.address) {
            return { code: 400, message: "Invalid Sender" };
      }
      let categories = await getCategoriesBySubscriber(sender.address);
      let msg = "Available Categoriies are:-\n";
      msg += categories.map((c, idx) => `${idx+1}. ${c}`).join("\n")
    return { code: 200, message: msg};
  } else if (command == "notify") {
      if (ADMINS.findIndex((adminAddr) => adminAddr === sender.address) === -1)  {
            return { code: 401, message: "Not Allowed" + JSON.stringify(sender)};
      }
      const {category, gameId} = params;
      const subscribers = await getSubscribersByCategory(category)
      const message = frameUrl+`?gameId=${gameId}`
      await notifySubscribers(subscribers, message);
      return { code: 200, message: "OK" };
  } else if (command == "subscribe") {
      const {category} = params;
      await addSubscriberToCategory(category, sender.address)
      return { code: 200, message: `Subscribed to ${category}` };
  } else if (command == "unsubscribe") {
      const {category} = params;
      await removeSubscriberFromCategory(category, sender.address)
      return { code: 200, message: `Unubscribed from ${category}` };
  } else {
    return { code: 400, message: "Command not found." };
  }
}

export const generateCoolAlternatives = (domain: string) => {
  const suffixes = ["lfg", "cool", "degen", "moon", "base", "gm"];
  const alternatives = [];
  for (let i = 0; i < 5; i++) {
    const randomPosition = Math.random() < 0.5;
    const baseDomain = domain.replace(/\.eth$/, ""); // Remove any existing .eth suffix
    alternatives.push(
      randomPosition
        ? `${suffixes[i]}${baseDomain}.eth`
        : `${baseDomain}${suffixes[i]}.eth`,
    );
  }

  const cool_alternativesFormat = alternatives
    .map(
      (alternative: string, index: number) => `${index + 1}. ${alternative} ✨`,
    )
    .join("\n");
  return cool_alternativesFormat;
};

export async function clear() {
  clearMemory();
  clearInfoCache();
}
