// This module handles chat commands and delegates based on their type.

// Imports:
import { server } from "./trshbot.js";
import apiData from "./api.json" assert { type: "json" };
import addPrompt, {
  markPromptIncomplete,
  getPromptFromDB,
} from "./testRequire.js";
import * as fs from "fs";
import quotesDBData from "./quotesDB.json" assert { type: "json" };

// This class constructs commands directed at the bot ex: "@trsh_bot":
class BotCommand {
  constructor(name, args, callBack, authority) {
    this.name = name;
    this.args = args;
    this.thatShitFunctionToExecute = callBack;
    this.authority = authority;
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
    return `Command syntax: ${this.manual}.`;
  }
}

//This class constructs commands which start with the "!" prefix:
class ChannelCommand extends BotCommand {
  // constructor / setter should set the command's authority (who can use this command via badge/role)

  tryHandleMessage(channel, context, [arg0, arg1, ...rest]) {
    if (this.name !== arg0) {
      return false;
    }
    if (this.authority !== undefined) {
      if (context.username.toLowerCase() !== this.authority.toLowerCase()) {
        return false;
      }
    }

    this.thatShitFunctionToExecute(channel, context, [arg0, arg1, ...rest]);

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

// Globals:
const quote = {
  quote: "",
  date: new Date() * 1, // milliseconds
  feat: "",
};

export const prompt = {
  time: undefined,
  prompt: undefined,
  author: undefined,
  completed: undefined,
};

const botCommands = [];
const channelCommands = [];

// Create commmands:
const yesCommand = new BotCommand("yes", ["yes", "Yes", "Y", "y", "YES"], () =>
  server.say(apiData.Bot.CHANNEL, ":)")
);
yesCommand.addArg("yes");
yesCommand.addManual(`@${apiData.Bot.BOT_USERNAME} yes`);

const noCommand = new BotCommand("no", ["no", "No", "N", "n", "NO"], () =>
  server.say(apiData.Bot.CHANNEL, ":(")
);
noCommand.addArg("no");
noCommand.addManual(`@${apiData.Bot.BOT_USERNAME} no`);

const breakTheUniverseCommand = new BotCommand(
  "/0",
  ["divide by 0", "divide by zero", "/zero", "/0"],
  () => server.say(apiData.Bot.CHANNEL, "8008135")
);
breakTheUniverseCommand.addManual(
  `@${apiData.Bot.BOT_USERNAME}  ['/0', 'divide by zero', '/zero', 'divide by 0']`
);

const quoteCommand = new QuoteCommand("!quote", [], handleQuoteCommand);
quoteCommand.addManual("!quote <author> (author is optional)");

const addQuoteCommand = new QuoteCommand("!addquote", [], handleAddQuote);
addQuoteCommand.addManual("!addquote @<author> <quote>");

const manCommand = new ChannelCommand("!man", [], handleManCommand);
manCommand.addManual("!man <command>");

const promptCommand = new ChannelCommand("!prompt", [], handlePromptCommand);
promptCommand.addManual("!prompt <prompt>");

const getPrompt = new ChannelCommand(
  "!getprompt",
  [],
  handleTiddies,
  apiData.Bot.STREAMER_NICK
);
getPrompt.addManual(
  `!getprompt (${apiData.Bot.BOT_USERNAME} will respond w/ the next prompt in queue).`
);

const hiCommand = new BotCommand(
  "hi",
  ["hey", "hi", "hello", "Hi", "Hey", "Hello"],
  handleHiCommand
);
hiCommand.addManual(
  `@${apiData.Bot.BOT_USERNAME} ['hey', 'hi', 'hello', 'Hi', 'Hey', 'Hello']`
);

// Add commands to command arrays:
botCommands.push(yesCommand, noCommand, hiCommand, breakTheUniverseCommand);
channelCommands.push(
  manCommand,
  quoteCommand,
  addQuoteCommand,
  getPrompt,
  promptCommand
);

// Functions:
const newPromptSuccess = () =>
  server.say(apiData.Bot.CHANNEL, "Your prompt is in the queue!");

const newQuoteSuccess = () =>
  server.say(
    apiData.Bot.CHANNEL,
    "Your quote was added to the database! Congrats on being so ICONIC!"
  );

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

  if (!isThisInputClean(quoteString, context)) {
    return;
  }

  const quoteToAdd = Object.create(quote);
  let authorSanitized;

  quoteToAdd.quote = quoteString;
  quoteToAdd.date = new Date();
  quoteToAdd.feat = 0;

  if (message[1].startsWith("@")) {
    authorSanitized = message[1].slice(1);
  } else {
    server.say(
      apiData.Bot.CHANNEL,
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

  overwriteQuotesJson(newQuoteSuccess);
}

function handleManCommand(channel, context, message) {
  if (message[1] === undefined) {
    server.say(
      apiData.Bot.CHANNEL,
      `Sorry @${context.username}, @${apiData.Bot.STREAMER_NICK} already has a man :( Try again?`
    );
    return;
  }
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
  server.say(apiData.Bot.CHANNEL, manMessage);
  return;
}

function handlePromptCommand(channel, context, message) {
  if (message[1] === undefined) {
    server.say(apiData.Bot.CHANNEL, `@${context.username} RTFM!`);
    return;
  }

  // Prep message for promptObj:
  message.shift();

  if (!isThisInputClean(message)) {
    server.say(
      apiData.Bot.CHANNEL,
      `Your prompt is invalid @${context.username}!`
    );
    return;
  }

  // Create promptObj to be added to DB:
  const promptObj = Object.create(prompt);

  promptObj.time = new Date() * 1; // in milliseconds
  promptObj.prompt = message.join(" ").trimEnd();
  promptObj.author = context.username;
  promptObj.completed = 0;

  // Send promptObj to be added to DB:
  const wasThePromptAddSuccessful = addPrompt(promptObj);

  wasThePromptAddSuccessful
    ? newPromptSuccess()
    : server.say(
        apiData.Bot.CHANNEL,
        "Sorry, your prompt didn't make it into the queue :("
      );

  // a day where i can imitate trshbot is a good day
  // saratonln
  // : a day where i can imitate tiddies is a good day
  // TommyLuco
  // : maybe trshbot should make some miso soup
  // Trsh_bot
  // : a day tiddies i can imitate tiddies is a good day

  // HARASS RANDOM VIEWER
}

function handleHiCommand(channel, context, message) {
  const hiIndx = hiCommand.args.findIndex((arg) => arg == message[1]);

  server.say(
    apiData.Bot.CHANNEL,
    `${hiCommand.args[hiIndx]} @${context.username}!`
  );
  return;
}

const overwriteSelectedJSON = (target, JSONObj, cb) => {
  const JSONStringData = JSON.stringify(JSONObj);

  fs.writeFile(target, JSONStringData, "utf-8", (err) => {
    if (err) {
      console.error(`Unable to write object to file. Error: ${err}`);
    } else {
      cb?.();
      console.log(`Success writing obje to file: ${target}`);
    }
  });
};

function overwritePromptJson(cb) {
  // overwriteSelectedJSON("./promptQueue.json", promptQueueData, cb);
}

function overwriteQuotesJson(cb) {
  overwriteSelectedJSON("./quotesDB.json", quotesDBData, cb);
}

// handleGetPrompt()
async function handleTiddies() {
  let currentPromptInQueue;
  try {
    currentPromptInQueue = await getPromptFromDB();
    if (!currentPromptInQueue) {
      server.say(
        apiData.Bot.CHANNEL,
        "There are no more prompts in the queue :("
      );
      return;
    }
  } catch (err) {
    server.say(
      apiData.Bot.CHANNEL,
      "Oops! There was an error getting the next prompt"
    );
    console.log("Error: getting prompt from DB! " + err);
    return;
  }

  server.say(
    apiData.Bot.CHANNEL,
    `'${currentPromptInQueue.prompt}' - by ${currentPromptInQueue.author}`
  );

  try {
    await markPromptIncomplete(currentPromptInQueue.rowid);
  } catch (err) {
    console.log("Error: marking prompt as complete! " + err);
    return;
  }
  return;
}

export function isThisInputClean(message) {
  const lastWord = message[0].split(""); //firstWord

  if (
    lastWord[0] === "!" ||
    lastWord[0] === "/" ||
    lastWord[0] === "." ||
    lastWord[0] === "'" ||
    lastWord[0] === `"` ||
    lastWord[0] === "`" ||
    lastWord[0] === "-" ||
    lastWord[0] === "#"
  ) {
    return false;
  }

  if (message.length > 1 || message[1] !== undefined) {
    for (const word of message) {
      const wordArr = word.split("");

      if (wordArr.includes("#")) {
        return false;
      }

      let dashIndx = wordArr.findIndex((x) => (x = "-"));
      if (dashIndx !== -1) {
        if (wordArr[dashIndx + 1] === "-" || wordArr[dashIndx + 1] === "-") {
          return false;
        }
      }
    }
  }

  return true;
}

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
