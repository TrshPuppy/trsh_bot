// Imports:
import apiData from "./api.json" assert { type: "json" };
import checkOAuthStatus from "./api.js";
import checkForFileSystem from "./fileCheck.js";
import tmi from "tmi.js";
import delegateMessage from "./messages.js";

checkForFileSystem();
checkOAuthStatus(); // make async

//Setting up TMI to listen to channel chat
export const server = new tmi.Client({
  connection: {
    reconnect: true,
  },
  channels: [apiData.Bot.CHANNEL],
  identity: {
    username: apiData.Bot.BOT_USERNAME,
    password: apiData.OA_TOKEN,
  },
});

server.connect();

// Event Handlers:
server.on("message", delegateMessage);

// client.on("message", async (channel, context, message) => {
//   //   const IS_BOT = context.username.toLowerCase() === process.env.BOT_USERNAME;
//   //   if (!IS_BOT) {
//   //     client.say(
//   //       channel,
//   //       `Responding to ${context.username} message: ${message}`
//   //     );
//   //   }
//   //   console.log("channel", {
//   //     channel,
//   //     user: context.username,
//   //     message,
//   //   });
// });
