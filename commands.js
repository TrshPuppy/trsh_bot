// This module handles chat commands and delegates based on their type.

// Imports:
import { server } from "./trshbot.js";
import apiData from "./api.json" assert { type: "json" };
import promptQueue from "./promptQueue.json" assert { type: "json" };
import * as fs from "fs";
import quotesDBData from "./quotesDB.json" assert { type: "json" };

// This class constructs commands directed at the bot ex: "@trsh_bot":
class BotCommand {
  constructor(name, args, callBack) {
    this.name = name;
    this.args = args;
    this.thatShitFunctionToExecute = callBack;
  }

  addArg(arg) {
    this.args.push(arg);
  }

  tryHandleMessage(channel, context, [arg0, arg1, arg2, ...rest]) {
    if (this.args.findIndex((x) => x == arg1) !== -1) {
      this.thatShitFunctionToExecute(channel, context, [
        arg0,
        arg1,
        arg2,
        ...rest,
      ]);
      return true;
    }
    return false;
  }

  addManual(string) {
    this.manual = string;
  }

  getManual() {
    const manualString = `Command syntax: ${this.manual}.`;
    // possible arguments?
    // setter for more uniquee manuals?
    return manualString;
  }
}

//This class constructs commands which start with the "!" prefix:
class ChannelCommand extends BotCommand {
  // constructor / setter should set the command's authority (who can use this command via badge/role)

  tryHandleMessage(channel, context, [arg0, arg1, arg2, ...rest]) {
    if (this.name !== arg0) {
      return false;
    }

    //if ( author of command !have authority){
    //return false
    // }

    this.thatShitFunctionToExecute(channel, context, [
      arg0,
      arg1,
      arg2,
      ...rest,
    ]);

    return true;
  }
}

class QuoteCommand extends ChannelCommand {
  tryHandleMessage(channel, context, [arg0, arg1, arg2, ...rest]) {
    if (this.name === arg0) {
      this.thatShitFunctionToExecute(channel, context, [
        arg0,
        arg1,
        arg2,
        ...rest,
      ]);
      return true;
    }
    return false;
  }
}

const quote = {
  quote: "",
  date: new Date() * 1, // milliseconds
  feat: "",
};

let currentQueueNumber = 0;

const botCommands = [];
const channelCommands = [];

// Create commmands:
const yesCommand = new BotCommand("yes", ["yes", "Yes", "Y", "y", "YES"], () =>
  server.say(apiData.Bot.CHANNEL, ":)")
);
yesCommand.addArg("yes");
yesCommand.addManual("@trsh_bot yes");

const noCommand = new BotCommand("no", ["no", "No", "N", "n", "NO"], () =>
  server.say(apiData.Bot.CHANNEL, ":(")
);
noCommand.addArg("no");
noCommand.addManual("@trsh_bot no");

const quoteCommand = new QuoteCommand("!quote", [], handleQuoteCommand);
quoteCommand.addManual("!quote <author> (author is optional)");

const addQuoteCommand = new QuoteCommand("!addquote", [], handleAddQuote);
addQuoteCommand.addManual("!addquote @<author> <quote>");

const manCommand = new ChannelCommand("!man", [], handleManCommand);
manCommand.addManual("!man <command>");

const promptCommand = new ChannelCommand("!prompt", [], handlePromptCommand);
promptCommand.addManual("!prompt <prompt>");

const hiCommand = new BotCommand(
  "hi",
  ["hey", "hi", "hello", "Hi", "Hey", "Hello"],
  handleHiCommand
);
hiCommand.addManual("@trsh_bot ['hey', 'hi', 'hello', 'Hi', 'Hey', 'Hello']");

// Add commands to command arrays:
botCommands.push(yesCommand, noCommand, hiCommand);
channelCommands.push(manCommand, promptCommand, quoteCommand, addQuoteCommand);

// Functions:
export function handleBotSummons(channel, context, message) {
  for (const command of botCommands) {
    if (command.tryHandleMessage(channel, context, message.split(" "))) {
      return;
    }
  }
}

//handleChannelCommand
export function ifThisDoesntWorkItsStevesFault(channel, context, message) {
  for (const command of channelCommands) {
    if (command.tryHandleMessage(channel, context, message.split(" "))) {
      break;
    }
  }
}

function handleQuoteCommand(channel, context, message) {
  //USE FIND INDEX INSTEAD
  // HANDLE FINDINDEX returning -1
  let randomQuote;
  let currentAuthor;
  let indxIntoQuotesDB;

  if (message[1] === undefined) {
    indxIntoQuotesDB = Math.floor(Math.random() * quotesDBData.length);
  } else {
    indxIntoQuotesDB = quotesDBData.findIndex(
      (x) => x.author.toLowerCase() == message[1].toLowerCase()
    );
  }

  if (indxIntoQuotesDB === -1) {
    server.say(
      apiData.Bot.CHANNEL,
      `I guess @${message[1]} isn't ICONIC enough to be in my database :(`
    );
    return;
  }

  const quotesArrLength = quotesDBData[indxIntoQuotesDB].quotes.length;
  currentAuthor = quotesDBData[indxIntoQuotesDB].author;
  const randomIndx = Math.floor(Math.random() * quotesArrLength);
  randomQuote = quotesDBData[indxIntoQuotesDB].quotes[randomIndx].quote;

  const feat =
    quotesDBData[indxIntoQuotesDB].quotes[randomIndx].feat === 1
      ? `@${apiData.Bot.CHANNEL}`
      : undefined;

  if (feat) {
    server.say(
      apiData.Bot.CHANNEL,
      `${randomQuote} - @${currentAuthor} ft. @${apiData.Bot.BOT_USERNAME}`
    );
  } else {
    server.say(apiData.Bot.CHANNEL, `${randomQuote} - @${currentAuthor}`);
  }
  // taladeganights, office spaces
  // Remember, the field mouse is fast, but the owl sees at night...
  // Leaderboard for most iconic chatters
  // chatter quotes featuring TB
}

function handleAddQuote(channel, context, message) {
  const quoteString = message.slice(2).join(" ");
  const quoteToAdd = Object.create(quote);
  let authorSanitized;

  quoteToAdd.quote = quoteString;
  quoteToAdd.date = new Date();
  quoteToAdd.feat = 0;

  if (message[1].startsWith("@")) {
    authorSanitized = message[1].slice(1);
  } else {
    server.say(
      channel,
      `${context.username}, please indicate the author by adding '@' before their username, ya scrub.`
    );
    return;
  }

  if (
    quotesDBData.find(
      (x) => x.author.toLowerCase() == authorSanitized.toLowerCase()
    ) !== undefined
  ) {
    const authorIndx = quotesDBData.findIndex(
      (y) => y.author.toLowerCase() == authorSanitized.toLowerCase()
    );
    quotesDBData[authorIndx].quotes.push(quoteToAdd);
  } else {
    const authorObj = { author: authorSanitized, quotes: [quoteToAdd] };
    quotesDBData.push(authorObj);
  }

  if (overWriteQuotesJSON()) {
    server.say(
      channel,
      `Thank you ${context.username}! The quote by @${authorSanitized} has been added to the database! #ICONIC`
    );
  } else {
    server.say(
      channel,
      "Sorry, there was an error adding that quote. Try again?"
    );
    return;
  }
}

function handleManCommand(channel, context, message) {
  let requestedCommand = message[1].startsWith("!")
    ? message[1].toLowerCase()
    : "!" + message[1].toLowerCase();

  let manMessage;

  // Check Bot commands for requested command:
  let commandIndx = botCommands.findIndex(
    (com) =>
      com.name == requestedCommand || com.name == requestedCommand.slice(1)
  );

  // Check Channel commands for request command (if not in Bot commands):
  if (commandIndx !== -1) {
    manMessage = botCommands[commandIndx].getManual();
  } else {
    commandIndx = channelCommands.findIndex(
      (c) => c.name == requestedCommand || c.name == requestedCommand.slice(1)
    );
    if (commandIndx !== -1) {
      manMessage = channelCommands[commandIndx].getManual();
    } else {
      manMessage = "That command doesn't exist, sorry bub.";
    }
  }
  server.say(channel, manMessage);
  return;
}

function handlePromptCommand(channel, context, message) {
  // Prep message for JSON object
  message.shift();

  const firstPrompt = promptQueue[0];

  // Create prompt to be written to JSON file!
  const newPrompt = Object.create(firstPrompt);

  newPrompt.prompt = message.join(" ").trimEnd();
  newPrompt.author = context.username;
  newPrompt.time = new Date() * 1; // milliseconds
  newPrompt.completed = 0;

  promptQueue.push(newPrompt);

  // Write new prompt to JSON Object/Array
  const jSONObj = JSON.stringify(promptQueue);
  const targetFile = "./promptQueue.json";

  fs.writeFile(targetFile, jSONObj, "utf-8", (error) => {
    if (error) {
      console.log(
        "There was an error writing the new prompt to the JSON. FAILED."
      );
      return;
    }
    console.log("New prompt successfully added to the queue!");
    server.say(
      apiData.Bot.CHANNEL,
      `Thanks @${context.username}! Your prompt is in the queue.`
    );
  });

  currentQueueNumber += 1;
  return;
  //

  /*

a day where i can imitate trshbot is a good day
saratonln
: a day where i can imitate tiddies is a good day
TommyLuco
: maybe trshbot should make some miso soup
Trsh_bot
: a day tiddies i can imitate tiddies is a good day


HARASS RANDOM VIEWER







  " !prompt this is a prompt"
// /////////////////////////////////////////'custom-reward-id': '9cd066ae-2645-4aee-87fe-759d64aef086',

  array:
    make an object of queued prompts
    array[0] is the oldest prompt and next in line
      and author?
      ? done or not done
      time submitted

      object gets written to JSON QUeue file

    As we need prompts:
      ask trshbot for the next prompt
      !p
        checks that user is me
        console logs the next valid (not marked done) prompt
        ? marks the prompt as finished

        object gets deleted from queue file and written to finished file
  */
}

function handleHiCommand(channel, context, message) {
  const hiIndx = hiCommand.args.findIndex((arg) => arg == message[1]);

  server.say(
    apiData.Bot.CHANNEL,
    `${hiCommand.args[hiIndx]} @${context.username}!`
  );
  return;
}

function overWriteQuotesJSON() {
  const targetFile = "./quotesDB.json";
  const quotesObj = JSON.stringify(quotesDBData);

  fs.writeFile(targetFile, quotesObj, "utf-8", (err) => {
    if (err) {
      return false;
    }
  });
  return true;
}

// console.log(quoteCommand.getManual());

// /*
// Channel commands:
//   - start w/ "!"
//     - delegate from messages module

//   channeel command class : "args, name, callbackk"
//   ++  check for user's authoritah
//       (need context.mod)

//   Some commands handle data from twitch:
//   !so: shoutout:

//   {user.name} has returned from chewing up the floor. Hope you're feeling happy and full {user.name}!

// */
// /*
// Current commands to integrate:
//     !lurk / !unlurk
//     !tiddies (count)
//     !socials
//     !so
//         (data to fetch?)
//     !raid
//         (DTF?)
//     !prompt
//     !project
//     !editcommand
//     !music
//     !mom
//     !hazelnut (count)
//     !discord
//     !kata
//     !behave
//     !to
//         moderation: timeout / mute
//     !gamedev
//     !theme
//     !hnc
//     !dolphin
//     !clan
//     !codewars
//     !swearjar / !empty

// Others:
//     !8ball
//     !addquote / !quote
//     !peachfuzz
//         timer?
//     !boingboingg
//    !whatstheword (returns a random word)

// QUOTES MOCKUP:

//     QUOTES = [];

//     [{author: "@steve7411",
//         quotes: ["JSON file?", "I am deeeply upset by this"]}]
// */
