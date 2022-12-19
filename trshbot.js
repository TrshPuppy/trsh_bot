// Imports:
import * as dotenv from "dotenv";
// import { test } from "./api.js";
// import tmi from "tmi.js";
// import delegateMessage from "./messages.js";

dotenv.config();

const TWITCH_REFRESH_URL = `https://id.twitch.tv/oauth2/token`;

fetch(TWITCH_REFRESH_URL, {
  method: "POST",
  body: `grant_type=refresh_token&refresh_token=${process.env.REFRESH_TOKEN}&client_id=${process.env.CLIENT_ID}&client_secret=${process.env.CLIENT_SECRET}`,
  headers: {
    "Content-Type": `application/x-www-form-urlencoded`,
  },
})
  .then(function (response) {
    return response.json();
  })
  .then(consoleThatShit);

function consoleThatShit(shit) {
  process.env.OA_TOKEN = shit.access_token;
  console.log(process.env.OA_TOKEN);
}

// //Setting up TMI to listen to channel chat
// export const server = new tmi.Client({
//   connection: {
//     reconnect: true,
//   },
//   channels: [process.env.CHANNEL],
//   identity: {
//     username: process.env.BOT_USERNAME,
//     password: process.env.OA_TOKEN,
//   },
// });

// server.connect();

// // Event Handlers:
// server.on("message", delegateMessage);

// client.on("message", async (channel, context, message) => {
// //   const IS_BOT = context.username.toLowerCase() === process.env.BOT_USERNAME;

// //   if (!IS_BOT) {
// //     client.say(
// //       channel,
// //       `Responding to ${context.username} message: ${message}`
// //     );
// //   }

// //   console.log("channel", {
// //     channel,
// //     user: context.username,
// //     message,
// //   });
// });

// console.log(client);
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
