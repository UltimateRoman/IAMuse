import { skills } from "./skills.js";
import { UserInfo, PROMPT_USER_CONTENT, PROMPT_ALL_CATEGORIES } from "./lib/resolver.js";
import { PROMPT_RULES, PROMPT_SKILLS_AND_EXAMPLES } from "./lib/gpt.js";

export async function agent_prompt(userInfo: UserInfo) {
  let { address, ensDomain, converseUsername, preferredName } = userInfo;

  //Update the name of the agent with predefined prompt
  let systemPrompt = PROMPT_RULES.replace("{NAME}", skills?.[0]?.tag ?? "@promotionBot");

  //Add user context to the prompt
  systemPrompt += PROMPT_USER_CONTENT(userInfo);

  //Add skills and examples to the prompt
  systemPrompt += PROMPT_SKILLS_AND_EXAMPLES(skills, "@promotionBot");
  console.log("SYSTEM PROMPT: ", systemPrompt)

  systemPrompt += await PROMPT_ALL_CATEGORIES();

  systemPrompt += `

## Example responses:

1. If user wants to subscribe to categories: ["pushup", "quiz"]
Subscibing to pushup and quiz\n/subscribe pushup\n/subscribe quiz

2. If user wants to unsubscribe from categories: ["pushup", "quiz", "pullup", "chess"]
Unubscibing from pushup, quiz, pullup and chess\n/unsubscribe pushup\n/unsubscribe quiz\n/unsubscribe pullup\n/unsubscribe chess

3. If user wants to view all categories
/categories

4. If user wants to view their subscriptions
/mysubscriptions

5. If user wants to reset their converssation
/reset

6. If the user wants to view a frame for the game id "game-1"
/show game-1

7. If the user sends hi, hello, Hi etc or any starting message.
Hey <User name | Domain | "there">.\nHow can I assist you.\nType /help to show available commands.

8. If the user wants to know about the bot or user asks to do somethisg that cannot be done with the available commands.
<A few creative lines that sSmmarize the available commands>\nType /help to show available commands.
`;
  return systemPrompt;
}


/*
    1. Check if the user does not have a ENS domain
Hey ${preferredName}! it looks like you don't have a ENS domain yet! \n\Let me start by checking your Converse username with the .eth suffix\n/check ${converseUsername}.eth

2. If the user has a ENS domain
Hello ${preferredName} ! I'll help you get your ENS domain.\n Let's start by checking your ENS domain ${ensDomain}. Give me a moment.\n/check ${ensDomain}

3. Check if the ENS domain is available
    Hello! I'll help you get your domain.\n Let's start by checking your ENS domain ${ensDomain}. Give me a moment.\n/check ${ensDomain}

4. If the ENS domain is available,
Looks like ${ensDomain} is available! Here you can register it:\n/register ${ensDomain}\n or I can suggest some cool alternatives? Le me know!

5. If the ENS domain is already registered, let me suggest 5 cool alternatives
Looks like ${ensDomain} is already registered!\n What about these cool alternatives?\n/cool ${ensDomain}

6. If the user wants to register a ENS domain, use the command "/register [domain]"
Looks like ${ensDomain} is available! Let me help you register it\n/register ${ensDomain} 

7. If the user wants to directly to tip to the ENS domain owner, use directly the command "/tip [domain]", this will return a url but a button to send the tip 
Here is the url to send the tip:\n/tip ${ensDomain}

8. If the user wants to get information about the ENS domain, use the command "/info [domain]"
Hello! I'll help you get info about ${ensDomain}.\n Give me a moment.\n/info ${ensDomain}  

9. If the user wants to renew their domain, use the command "/renew [domain]"
Hello! I'll help you get your ENS domain.\n Let's start by checking your ENS domain ${ensDomain}. Give me a moment.\n/renew ${ensDomain} 

10. If the user wants cool suggestions about a domain, use the command "/cool [domain]"
Here are some cool suggestions for your domain.\n/cool ${ensDomain}

## Most common bugs

1. Some times you will say something like: "Looks like vitalik.eth is registered! What about these cool alternatives?"
But you forgot to add the command at the end of the message.
    You should have said something like: "Looks like vitalik.eth is registered! What about these cool alternatives?\n/cool vitalik.eth

*/
