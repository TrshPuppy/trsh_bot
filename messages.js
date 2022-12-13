// This module is meant to envelope functions r/t parsing through chat messages in order to delegate functions.

// Imports:
import { server } from "./trshbot.js";

// Module globals:
let lastTiddyTime = new Date(0);
let tiddieLessMessages = 0;

export default function delegateMessage(channel, context, message) {
  if (context.username === server.username) {
    return;
  }

  tiddieLessMessages += 1;

  let secondsFromLastTiddy = (new Date() - lastTiddyTime) / 1000;
  if (secondsFromLastTiddy >= 10 && tiddieLessMessages >= 1) {
    if (tiddiesQ300(channel, context, message)) {
      lastTiddyTime = new Date();
      tiddieLessMessages = 0;
    }
  }
}

function tiddiesQ300(channel, context, message) {
  let tiddiesMessage;

  let messageSplitOfRandomShit = message.split(" ");

  let validIndex = findValidIndex(messageSplitOfRandomShit);

  if (validIndex === null) {
    return false;
  }

  messageSplitOfRandomShit[validIndex] = "tiddies";

  server.say(channel, messageSplitOfRandomShit.join(" "));
  return true;
}

function isValidString(string) {
  // does it contain emojis?
  // is it more than one letteer?
  // is it made up of alphabetical characters?
  // if yes return true

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
//tokeen timeline
// (auto refresh)
// tiddies is iconic

// I was going to say, "FUCK SAVING LIVES, tiddies is living"

// tiddies BIG MOOD

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
