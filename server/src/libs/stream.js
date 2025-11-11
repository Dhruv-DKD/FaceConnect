import { StreamChat } from "stream-chat";
import "dotenv/config";

const apiKey = process.env.STREAM_API_KEY;
const apiSecret = process.env.STREAM_API_SECRET;

if (!apiKey || !apiSecret) {
  console.error("Stream API key or Secret is missing");
}

const streamClient = StreamChat.getInstance(apiKey, apiSecret);

export const upsertStreamUser = async (userData) => {
  try {
    await streamClient.upsertUsers([userData]);
    return userData;
  } catch (error) {
    console.error("Error Upserting Stream User:", error);
    throw error;
  }
};

export const generateStreamToken = (userId) => {
  try {
    if (!userId) {
      throw new Error("User ID is required to generate Stream token");
    }

    // createToken is synchronous
    const token = streamClient.createToken(userId.toString());
    return token;
  } catch (error) {
    console.error("Error generating stream token:", error.message);
    throw error;
  }
};
