// This module envelops functions r/t parsing through chat messages in order to delegate functions.

// Imports:
import { server } from "./server.js";
import nlp from "compromise";
import {
  handleBotSummons,
  ifThisDoesntWorkItsStevesFault,
} from "./commands.js";
import apiData from "./data/api.json" assert { type: "json" };

// Module globals:
let Fred = new Date(0); // lastKeywordTime
let keywordLessMessages = 0;

export default function delegateMessage(channel, context, message) {
  console.log(`@${context.username}: "${message}"`);
  message = message.trim();

  if (message[0] === "/" || message[0] === ".") {
    return;
  }
  if (context.username === server.username) {
    return;
  }

  const botSummons = `@${apiData.Bot.BOT_USERNAME}`;
  const messageArr = message.split(" ");
  if (messageArr[0].toLowerCase() === botSummons.toLowerCase()) {
    handleBotSummons(channel, context, message);
    return;
  }

  if (message[0] === "!") {
    ifThisDoesntWorkItsStevesFault(channel, context, message);
    return;
  }
  if (context[`first-msg`] === true) {
    return;
  }
  if (context.username === "streamlabs") {
    return;
  }

  handleKeywordMessages(channel, context, message);
}

function handleKeywordMessages(channel, context, message) {
  keywordLessMessages += 1;

  const secondsFromLastKeyword = (new Date() - Fred) / 1000;

  if (secondsFromLastKeyword >= 300 && keywordLessMessages >= 20) {
    if (keywordQ300(channel, context, message)) {
      Fred = new Date();
      keywordLessMessages = 0;
    }
  }
}

function keywordQ300(channel, context, message) {
  const wordCount = message.split(" ").length;

  if (wordCount === 1 || wordCount >= 20) {
    return false;
  }

  const doc = nlp(message);

  if (!doc.has("#Noun")) {
    return false;
  }

  let randomNoun = doc.nouns().random();
  // console.log("Random noun.terms length= " + randomNoun.terms().length);

  while (randomNoun.terms().length > 1) {
    randomNoun = randomNoun.terms().nouns().random();
  }

  if (randomNoun.isPlural().length > 0) {
    randomNoun.replaceWith(apiData.Bot.KEYWORD_PLURAL);
  } else {
    randomNoun.replaceWith(apiData.Bot.KEYWORD_SINGULAR);
  }

  // console.log("Random noun text after loop = " + randomNoun.text());

  server.say(apiData.Bot.CHANNEL, doc.text());
  return true;
}

// /*
// bot commands:
//   @trsh_bot:
//               yes
//               no
//               count
//               ty
//               ricky

//               botCommands = [yes, no, count, ty]

// */

// // @trsh_bot:
// // yes/ no   commands(count, etc.)

// /*
// [
//   '#trshpuppy',
//   {
//     'badge-info': { subscriber: '4' },
//     badges: { broadcaster: '1', subscriber: '3000' },
//     'client-nonce': 'x',
//     color: '#8A2BE2',
//     'display-name': 'TrshPuppy',
//     emotes: null,
//     'first-msg': false,
//     flags: null,
//     id: 'x-x-x',
//     mod: false,
//     'returning-chatter': false,
//     'room-id': 'x',
//     subscriber: true,
//     'tmi-sent-ts': 'x',
//     turbo: false,
//     'user-id': 'x',
//     'user-type': null,
//     'emotes-raw': null,
//     'badge-info-raw': 'subscriber/4',
//     'badges-raw': 'broadcaster/1,subscriber/3000',
//     username: 'trshpuppy',
//     'message-type': 'chat'
//   },
//   'tiddies'
// ]
// */
