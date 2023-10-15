/*
 * This module is for creating and exporting the TMI.js server
 */

import apiData from "./data/api.json" assert { type: "json" };
import tmi from "tmi.js";
import delegateMessage from "./messages.js";

export let server;

// Create the server using the tmi.Client & using data in data/api.json
export default function createServer() {
  server = new tmi.Client({
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
}
