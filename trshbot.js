// Imports:

import apiData from "./api.json" assert { type: "json" };
import checkOAuthStatus from "./api.js";
import checkForFileSystem from "./fileCheck.js";
import tmi from "tmi.js";
import delegateMessage from "./messages.js";

checkOAuthStatus(); // make async
checkForFileSystem();

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

function checkForPromptQueue() {}

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

//

/*
NEED:
TMI.js
    twitch.tmi (library)
    tmijs.com
Twitch CLI for
    github
    set up authorization and test endpoints

nodejs

TO DO:
    OAuth token
        Access token?
        (havee to re-direct bot to twitch authentication page to get token)
        OAuth protocol
            OAuth 2.0

    REGISTERING THE APP:
        OAuth Redirect URL:
            Local host <-----
                port:
                ((Set up so localhost is listening, firewall?)) 
            Raspberry Pi?
            (if other people want to uise the bot in their stream)
        Get back:
            Client ID (Secret);
            Client Secret
    

    
    Learn how to set up .env
        install?
        dotenv
        Node "process.env.TOKEN" -- replace TOKEN w/ variable name

    Possible dependencies:
        - postman (to test api calls)
        - nodemon (not have to restart nodee server)

    Node: Odin Project
        SEDA: https://github.com/mdwelsh/mdwelsh.github.io/blob/main/papers/seda-sosp01.pdf




*/
