// This module is meant to envelope functions r/t parsing through chat messages in order to delegate functions.

// Imports:
import { server } from "./trshbot.js";
import { handleBotSummons } from "./commands.js";

// Module globals:
let lastTiddyTime = new Date(0);
let tiddieLessMessages = 0;

export default function delegateMessage(channel, context, message) {
  if (context.username === server.username) {
    return;
  }
  if (/(@\btrsh_bot\b)/i.test(message)) {
    handleBotSummons(channel, context, message);
    return;
  }
  if (message[0] === "!") {
    return;
  }

  handleTiddyMessages(channel, context, message);
}

function handleTiddyMessages(channel, context, message) {
  tiddieLessMessages += 1;

  let secondsFromLastTiddy = (new Date() - lastTiddyTime) / 1000;
  if (secondsFromLastTiddy >= 300 && tiddieLessMessages >= 20) {
    if (tiddiesQ300(channel, context, message)) {
      lastTiddyTime = new Date();
      tiddieLessMessages = 0;
    }
  }
}

function tiddiesQ300(channel, context, message) {
  let tiddiesMessage;

  let messageWords = message.split(" ");
  if (messageWords.length === 1 || messageWords.length >= 15) {
    return false;
  }

  let validIndex = findValidIndex(messageWords);

  if (validIndex === null) {
    return false;
  }

  messageWords[validIndex] = "tiddies";

  server.say(channel, messageWords.join(" "));
  return true;
}

function isValidString(string) {
  ///^[a-z]+$/i (^ is beginning, $ is end)
  if (/[a-z]+/i.test(string)) {
    return true;
  }
  return false;
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

/*
bot commands:
  @trsh_bot:
              yes
              no
              count
              ty
              ricky

              botCommands = [yes, no, count, ty]

              @trsh_bot quote @arthvadrr

                  command = [
                    command: "quote",
                    args: {author: @whoever,
                          quoteArray:["i like to imagine jesus as a littlee baby", "I'm on fire"]},
                          {author: @arthvadrr, 
                            quoteArray" ["CAPS ON SLAPS ON"]}
                          ]

                          if( "3h")
          
*/

// @trsh_bot:
// yes/ no   commands(count, etc.)

/*
[
  '#trshpuppy',
  {
    'badge-info': { subscriber: '4' },
    badges: { broadcaster: '1', subscriber: '3000' },
    'client-nonce': 'x',
    color: '#8A2BE2',
    'display-name': 'TrshPuppy',
    emotes: null,
    'first-msg': false,
    flags: null,
    id: 'x-x-x',
    mod: false,
    'returning-chatter': false,
    'room-id': 'x',
    subscriber: true,
    'tmi-sent-ts': 'x',
    turbo: false,
    'user-id': 'x',
    'user-type': null,
    'emotes-raw': null,
    'badge-info-raw': 'subscriber/4',
    'badges-raw': 'broadcaster/1,subscriber/3000',
    username: 'trshpuppy',
    'message-type': 'chat'
  },
  'tiddies'
]
*/
