// Imports:
import apiData from "./data/api.json" assert { type: "json" };
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

// server.on("message", (channel, tags, message, self) => {
//   console.log("channel = " + channel);
//   console.log("tags = " + JSON.stringify(tags));
//   console.log("message = " + message);
//   console.log("self = " + self);
// });
