import { xmtpClient } from "@xmtp/message-kit";
import { isAddress } from "viem";

async function init() {
  const { v2client } = await xmtpClient();
  return v2client;
}

export async function notifySubscribers(
  subscribers: string[],
  message: string,
) {
  const notificationClient = await init();
  console.log("SUBSCRIBERS", subscribers);
  for (const address of subscribers) {
    if (isAddress(address)) {
      console.log(`Sending daily update to ${address}`);
      // Logic to send daily updates to each subscriber
      try {
        const conversation =
          await notificationClient.conversations.newConversation(address);
        await conversation.send(message);
      } catch (error) {
        console.log(`Unable to notify ${address}: ${error}`);
      }
    }
  }
  notificationClient.close();
}
