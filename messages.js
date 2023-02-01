// This module envelops functions r/t parsing through chat messages in order to delegate functions.

// Imports:
//const pos = require("pos"); // https://github.com/dariusk/pos-js
import { server } from "./trshbot.js";
import {
  handleBotSummons,
  ifThisDoesntWorkItsStevesFault,
} from "./commands.js";
import apiData from "./api.json" assert { type: "json" };

// Module globals:
let Fred = new Date(0); // lastKeywordTime
let keywordLessMessages = 0;

export default function delegateMessage(channel, context, message) {
  message = message.trim();

  if (message[0] === "/" || message[0] === ".") {
    return;
  }
  if (context.username === server.username) {
    return;
  }
  if (/(@\btrsh_bot\b)/i.test(message)) {
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
  if (/([Streamlabs])/g.test(context.username)) {
    return;
  }

  handleKeywordMessages(channel, context, message);
}

function handleKeywordMessages(channel, context, message) {
  keywordLessMessages += 1;

  let secondsFromLastKeyword = (new Date() - Fred) / 1000;
  if (secondsFromLastKeyword >= 300 && keywordLessMessages >= 20) {
    if (keywordQ300(channel, context, message)) {
      Fred = new Date();
      keywordLessMessages = 0;
    }
  }
}

function keywordQ300(channel, context, message) {
  let messageWords = message.split(" ");

  if (messageWords.length === 1 || messageWords.length >= 20) {
    return false;
  }

  let validIndex = findValidIndex(messageWords);
  if (validIndex === null) {
    return false;
  }

  messageWords[validIndex] = `${apiData.Bot.KEYWORD}`;
  server.say(channel, messageWords.join(" "));
  return true;
}

function isValidString(string) {
  ///^[a-z]+$/i (^ is beginning, $ is end)
  if (/[a-z]+/i.test(string)) {
    return true;
  }
  return false;

  /* Words to disclude:
    pronouns
    prepositions
    conjunctions

    OR: select for nouns only
  if
  is
  of
  or
  the
  her
  his
  theirs
  they
  he
  she
  a
  and
  what
  why
  when
  where
  how
  but
  that
  to
  some
  ok
  okay
  are
  hi
  hello
  bye
  goodbye
  did
  do
  does
*/
}

function findValidIndex(messageArray) {
  const validIndices = Array.from({ length: messageArray.length }, (_, i) => i);

  while (validIndices) {
    const randomIndx = Math.floor(Math.random() * validIndices.length);
    if (isValidString(messageArray[validIndices[randomIndx]])) {
      return validIndices[randomIndx];
    } else {
      validIndices.splice(randomIndx, 1);
    }
  }
  return null;
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

//               @trsh_bot quote @arthvadrr

//                   command = [
//                     command: "quote",
//                     args: {author: @whoever,
//                           quoteArray:["i like to imagine jesus as a littlee baby", "I'm on fire"]},
//                           {author: @arthvadrr,
//                             quoteArray" ["CAPS ON SLAPS ON"]}
//                           ]

//                           if( "3h")

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
