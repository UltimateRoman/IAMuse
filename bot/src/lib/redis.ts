import { createClient } from "redis";

const client = createClient();

client.on("error", (err) => console.error("Redis Client Error", err));

await client.connect();

// Utility to add a subscriber to a category
export const addSubscriberToCategory = async (
  category: string,
  subscriber: string,
): Promise<void> => {
  const currentSubscribers = await client.lRange(category, 0, -1);
  if (!currentSubscribers.includes(subscriber)) {
    await client.rPush(category, subscriber);
  }
};

// Utility to unsubscribe a subscriber from a category
export const removeSubscriberFromCategory = async (
  category: string,
  subscriber: string,
): Promise<void> => {
  await client.lRem(category, 0, subscriber);
};

// Utility to get all categories
export const getAllCategories = async (): Promise<string[]> => {
  return await client.keys("*");
};

// Utility to add a new category
export const addCategory = async (category: string): Promise<void> => {
  const exists = await client.exists(category);
  if (!exists) {
    await client.rPush(category, []); // Initialize the category with an empty list
  }
};

// Utility to remove a category
export const removeCategory = async (category: string): Promise<void> => {
  await client.del(category);
};

// Utility to find categories a user is subscribed to
export const getCategoriesBySubscriber = async (
  subscriber: string,
): Promise<string[]> => {
  const categories = await getAllCategories();
  const subscribedCategories: string[] = [];

  for (const category of categories) {
    const subscribers = await client.lRange(category, 0, -1);
    if (subscribers.includes(subscriber)) {
      subscribedCategories.push(category);
    }
  }

  return subscribedCategories;
};

// Utility to get all subscribers of a given category
export const getSubscribersByCategory = async (
  category: string,
): Promise<string[]> => {
  return await client.lRange(category, 0, -1);
};
