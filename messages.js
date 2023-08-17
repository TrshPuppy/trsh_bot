/*
 * This module envelops functions r/t parsing through chat messages in order to delegate functions.
 * It is called by the TMI.js server created in server.js
 */

// Imports:
import { server } from "./server.js";
import nlp from "compromise";
import { handleBotSummons } from "./commands/BotCommands.js";
import { handleChannelCommand } from "./commands/commands.js";
// import {
//   // handleBotSummons,
//   ifThisDoesntWorkItsStevesFault,
// } from "./commands/commands.js";
import apiData from "./data/api.json" assert { type: "json" };

// Module globals:
let Fred = new Date(0); // lastKeywordTime
let keywordLessMessages = 0;

/*
 * Called from server.js, the parameters are given to us by the TMI.js server:
 */
export default function delegateMessage(channel, context, message) {
  message = message.trim();

  // Sanitize the message:
  if (message[0] === "/" || message[0] === ".") {
    return;
  }

  // Make sure the bot isn't responding to its own messages.
  if (context.username === server.username) {
    return;
  }

  /*
   * After sanitizing and making sure this is an actual chatter's
   * message, we handle what type of message it is. The different
   * handled types are:
   *   - 'botSummons': a chatter has '@' the bot
   *   - command: a chatter has used the `!` command prefix
   *   - other messages: messages which aren't a bot summons or a
   *                     command are sent to 'handleKeywordMessages'
   *                     where the bot decides whether or not to
   *                     take the chatter's message, change a
   *                     random word to its keyword and
   *                     repost the edited message in chat (think
   *                     buttsbot).
   */

  // botSummons:
  const botSummons = `@${apiData.Bot.BOT_USERNAME}`;
  const messageArr = message.split(" ");
  if (messageArr[0].toLowerCase() === botSummons.toLowerCase()) {
    // Calls a function from /commands/BotCommands.js
    handleBotSummons(channel, context, message);
    return;
  }

  // command:
  if (message[0] === "!") {
    // Calls a function from commands.js
    handleChannelCommand(channel, context, message);
    //ifThisDoesntWorkItsStevesFault(channel, context, message);
    return;
  }

  // regular chat message:
  handleKeywordMessages(channel, context, message);
}

function handleKeywordMessages(channel, context, message) {
  /* If we have a regular message: make sure we aren't:
   */

  // 1) harrassing a first time chatter with our bot:
  if (context[`first-msg`] === true) {
    return;
  }
  // 2) responding to the chat message of another bot:
  if (context.username === "streamlabs") {
    return;
  }

  /*
  * Keyword messages (chat messages trsh_bot takes and edits a random word 
  to the key word in data/api.json and re-posts to chat) happen every
  20 chat messages && every 5 minutes. Both have to be true for 
  trsh_bot to do this.
  */

  // How many regular chat messages have there been since the last time we changed one?
  keywordLessMessages += 1;

  // How many seconds have passed since the last time we changed a message?
  const secondsFromLastKeyword = (new Date() - Fred) / 1000;

  // If it's been 20 messages && 5 minutes, call the function which changes the message & reset the timer & message count:
  if (secondsFromLastKeyword >= 300 && keywordLessMessages >= 20) {
    // Only reset the conditions if keywordQ300 is actually able to change and post a message:
    if (keywordQ300(channel, context, message)) {
      Fred = new Date();
      keywordLessMessages = 0;
    }
  }
}

// This is the function which actually takes the chat message, edits it, and re-posts it as the chat bot:
function keywordQ300(channel, context, message) {
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
  return true;
}

/*
 * Here is an example of what TMI.js gives us when its "message" event handler fires off:
 * See the delegateMessage() function at the top of this module, but simply:
 * this is an array containing the ["channel", context{}, "messge"].
 * The context object is the most useful as you can use the info in it to
 * navigate how the bot responds to the message.
 *
 * [
 *  '#trshpuppy',
 *  {
 *    'badge-info': { subscriber: '4' },
 *    badges: { broadcaster: '1', subscriber: '3000' },
 *    'client-nonce': 'x',
 *    color: '#8A2BE2',
 *    'display-name': 'TrshPuppy',
 *    emotes: null,
 *    'first-msg': false,
 *    flags: null,
 *    id: 'x-x-x',
 *   mod: false,
 *  'returning-chatter': false,
 *    'room-id': 'x',
 *    subscriber: true,
 *    'tmi-sent-ts': 'x',
 *    turbo: false,
 *    'user-id': 'x',
 *    'user-type': null,
 *    'emotes-raw': null,
 *    'badge-info-raw': 'subscriber/4',
 *    'badges-raw': 'broadcaster/1,subscriber/3000',
 *    username: 'trshpuppy',
 *    'message-type': 'chat'
 *  },
 *  'tiddies'
 * ]
 */
