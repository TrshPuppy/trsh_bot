/*
 * This module envelops functions r/t parsing through chat messages in order to delegate functions.
 * It is called by the TMI.js server created in server.js
 */

// Imports:
import sqlite3 from "sqlite3";
import { open } from "sqlite";
import { server } from "./server.js";
import nlp from "compromise";
import apiData from "./data/api.json" assert { type: "json" };
import commands from "./commands.js";

export default async function delegateMessage(channel, tags, message, self) {
  // Make sure the chatter is not the bot
  if (self == true) {
    return;
  }

  // Filter for whether the message starts w/ the correct prefix, or is a message
  // for the bot ('@trsh_bot)
  const correct_prefix = apiData.Bot.PREFIX;

  switch (message[0]) {
    case correct_prefix:
      await handleChannelCommand(channel, tags, message, self);
      break;
    case "/":
      return;
    case ".":
      return;
    case ";":
      return;
    case "@":
      // If the message is meant for the bot:
      if (
        message.split(" ")[0].toLowerCase() ==
        `@${apiData.Bot.BOT_USERNAME.toLowerCase()}`
      ) {
        const command = message.split(" ")[1].toLowerCase();
        if (commands[command]) {
          commands[command].exe({ channel, tags, message, self });
          return;
        } else {
          const alias = findCommandByAlias(command);
          if (alias) {
            commands[alias].exe({ channel, tags, message, self });
          } else {
            // server.say(
            //     apiData.Bot.CHANNEL,
            //     `sorry, that command doesn't exist :(`
            // );
          }
          return;
        }
      }
      return;
    default:
      // If none, then it's a regular chat message & we can run our keyword and timer functions:
      keywordQ300(channel, tags, message, self);
      checkMessageTimers(channel, tags, message, self);
      break;
  }
  return;
}

let timeSinceLastKeywordMsg = new Date();
let keywordLessMessages = 0;

const timerMessages = {
  programStart: new Date() / 1000, // Put in seconds
  yt: {
    msg: `Have you checked out the NetPuppy Dev Log series?! TP just uploaded a new vid all about concurrency! --> youtu.be/ADlIelOEb5E`,
    interval: 1800, // 30 minutes
    offset: 0,
    lastChecked: new Date() / 1000,
    started: false,
  },
  bootDev: {
    msg: "Are you interested in taking a course on Boot.dev? There are courses on Python, Go, JS, shells & terminals, SQL, Docker, and a lot more! Use my affiliate code TRASHPUP for 25% off your first payment! --> https://boot.dev/?via=trashpuppy",
    interval: 1800,
    offset: 900, // 15 mins
    lastChecked: new Date() / 1000,
    started: false,
  },
  tibs: {
    msg: "@0xtib3rius invited me to be his first guest on his new web-series! Check out the episode here! --> https://youtu.be/zSJEy91MJcY",
    interval: 1800,
    offset: 1200,
    lastChecked: new Date() / 1000,
    started: false,
  },
};

function keywordQ300(channel, tags, message, self) {
  /*
  * Keyword messages (chat messages trsh_bot takes and edits a random word
  to the key word in data/api.json and re-posts to chat) happen every
  20 chat messages && every 5 minutes. Both have to be true for
  trsh_bot to do this.
  */

  /* If we have a regular message: make sure we aren't:
   */
  // 1) harrassing a first time chatter with our bot:
  if (tags[`first-msg`] === true) {
    return;
  }
  // 2) responding to the chat message of another bot:
  if (tags["display-name"] === "streamlabs") {
    return;
  }

  // How many regular chat messages have there been since the last time we changed one?
  keywordLessMessages += 1;

  // How many seconds have passed since the last time we changed a message?
  const secondsFromLastKeyword = (new Date() - timeSinceLastKeywordMsg) / 1000;

  // If it's been 20 messages && 5 minutes, call the function which changes the message & reset the timer & message count:
  if (secondsFromLastKeyword >= 300 && keywordLessMessages >= 20) {
    // Make sure we're not re-posting a super long chat message, or a super short one:
    const wordCount = message.split(" ").length;
    if (wordCount === 1 || wordCount >= 20) {
      return false;
    }

    /*
     * We're using compromise js to pick which word to change and how to change it.
     * We want to change a noun in the original message, and we want to preserve
     * whether it was singular or plural. data/api.json has options for both a
     * simgular and plural versions of the keyword.
     *   i.e. if the keyword is "kitten", then our options are "kitten" and "kittens"
     */

    const doc = nlp(message);
    if (!doc.has("#Noun")) {
      return false;
    }

    let randomNoun = doc.nouns().random();

    while (randomNoun.terms().length > 1) {
      randomNoun = randomNoun.terms().nouns().random();
    }

    // Here is the replacement using data/api.json:
    if (randomNoun.isPlural().length > 0) {
      randomNoun.replaceWith(apiData.Bot.KEYWORD_PLURAL);
    } else {
      randomNoun.replaceWith(apiData.Bot.KEYWORD_SINGULAR);
    }

    // Here is trsh_bot reposting the changed message to chat:
    server.say(apiData.Bot.CHANNEL, doc.text());

    timeSinceLastKeywordMsg = new Date();
    keywordLessMessages = 0;

    return true;
  }
  return false;
}

function checkMessageTimers(c, t, m, s) {
  const now = Math.floor(new Date() / 1000);

  // Go through timer messages and decrement their offsets/ timers:
  for (const [ky, val] of Object.entries(timerMessages)) {
    if (ky == "programStart") {
      continue;
    }

    const sinceLastChecked = Math.floor(now - val.lastChecked);

    if (val.started == false) {
      // Decrement the offset
      val.offset -= sinceLastChecked;

      // If the offset if 0 or negative, set started to true
      if (val.offset <= 0) {
        val.started = true;
      }
    } else {
      val.interval -= sinceLastChecked;

      if (val.interval <= 0) {
        // Reset interval and send message to chat:
        val.interval = 1800; // 30 mins
        server.say(apiData.Bot.CHANNEL, val.msg);
      }
    }
    val.lastChecked = now;
  }
  return;
}

async function handleChannelCommand(channel, tags, message, self) {
  // get the name of the command to access it in the commands obj:
  let args = message.split(" ");
  let command = args.shift();
  command = command.split("");
  command.shift();
  command = command.join("").toLowerCase();

  const db = await open({
    filename: "./data/prompts.sqlite",
    driver: sqlite3.cached.Database,
  });

  let context = {
    channel,
    db,
    tags,
    args,
    self,
  };

  console.log("ATTEMPTINS COMMAND: " + command);
  try {
    commands[command].exe(context);
  } catch (e) {
    console.log(`ERROR in handleChannelCommand try-catch: ${e}`);
    const alias = findCommandByAlias(command);

    if (alias) {
      commands[alias].exe(context);
    } else {
      // server.say(
      //     apiData.Bot.CHANNEL,
      //     `Sorry @${tags["display-name"]}, that command doesn't exist :(`
      // );
    }
    return;
  }
}

// Return a command from the commands object by finding it, or finding its alias:
export function findCommandByAlias(command) {
  for (const [ky, val] of Object.entries(commands)) {
    const als = val["aliases"]();
    let found = als.filter((x) => x == command.toString().toLowerCase());
    if (found.length == 1) {
      return ky;
    }
  }
  return 0;
}
