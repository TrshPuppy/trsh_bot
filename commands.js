// This module handles chat commands and delegates base on their type.

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

  getManual() {
    const manualString = `To use this command type: '@${apiData.Bot.BOT_USERNAME} ${this.name} <arguments>.'`;
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

const noCommand = new BotCommand("no", ["no", "No", "N", "n", "NO"], () =>
  server.say(apiData.Bot.CHANNEL, ":(")
);
noCommand.addArg("no");

const quoteCommand = new QuoteCommand("!quote", [], handleQuoteCommand);
const addQuoteCommand = new QuoteCommand("!addquote", [], handleAddQuote);
const manCommand = new ChannelCommand("!man", [], handleManCommand);
const promptCommand = new ChannelCommand("!prompt", [], handlePromptCommand);
const hiCommand = new BotCommand(
  "hi",
  ["hey", "hi", "hello", "Hi", "Hey", "Hello"],
  handleHiCommand
);

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

  quoteToAdd.quote = quoteString;
  quoteToAdd.date = new Date();
  quoteToAdd.feat = 0;

  const authorSanitized = message[1].startsWith("@")
    ? message[1].slice(1)
    : message[1];

  if (
    quotesDBData.find(
      (x) => x.author.toLowerCase() == authorSanitized.toLowerCase()
    ) !== undefined
  ) {
    const authorIndx = quotesDBData.findIndex(
      (y) => y.author == authorSanitized
    );
    quotesDBData[authorIndx].quotes.push(quoteToAdd);
  } else {
    const authorObj = { author: authorSanitized, quotes: [quoteToAdd] };
    quotesDBData.push(authorObj);
  }

  if (overWriteQuotesJSON()) {
    server.say(
      channel,
      `Thank you ${context.username}! The quote by @${authorSanitized} has been added to the database!`
    );
  } else {
    server.say(
      channel,
      "Sorry, there was an error adding that quote. Try again?"
    );
    return;
  }
}

function handleManCommand() {
  // "!man quote"
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

/*
[
  {
    "author": "killtop09",
    "quotes": [{ "quote": "real programmers write in tiddies:)", "feat": 0 }]
  },
  {
    "author": "hungryhungryhippo",
    "quotes": [
      {
        "quote": "@x684867 do you drink tiddies",
        "date": "1/27/2023",
        "feat": "@x684867"
      }
    ]
  },
  {
    "author": "rulerlefi",
    "quotes": [
      {
        "quote": "Clicks get chicks or something like that?",
        "date": "12/1/2022",
        "feat": 0
      }
    ]
  },
  {
    "author": "arthvadrr",
    "quotes": [{ "quote": "CAPS ON SLAPS ON", "date": "12/2/2022", "feat": 0 }]
  },
  {
    "author": "TrshPuppy",
    "quotes": [
      {
        "quote": "You gotta respect the bottom.",
        "date": "12/13/2022",
        "feat": 0
      },
      {
        "quote": "Ruler stop flexing your python",
        "date": "11/4/2022",
        "feat": 0
      },
      {
        "quote": "Actually one time, I was really proud, this dude got shot...",
        "date": "10/25/2022",
        "feat": 0
      }
    ]
  },
  {
    "author": "Martyn1842",
    "quotes": [
      {
        "quote": "We're gonna need a bigger stack",
        "date": "12/13/2022",
        "feat": 0
      }
    ]
  },
  {
    "author": "jcblw",
    "quotes": [
      {
        "quote": "You're in her DMs, I'm in her console. We are not the same.",
        "date": "12/9/2022",
        "feat": 0
      }
    ]
  },
  {
    "author": "steve7411",
    "quotes": [
      {
        "quote": "Sometimes I type 'pythong' instead of 'python' because 'thong', so it's muscle memory. I do that all the time...",
        "date": "12/9/2022",
        "feat": 0
      }
    ]
  },
  {
    "author": "plnrnd",
    "quotes": [
      {
        "quote": "tiddies for shoutouts and stuff.",
        "date": "12/13/2022",
        "feat": 1
      }
    ]
  },
  {
    "author": "trsh_bot",
    "quotes": [
      {
        "quote": "Horse-sized tiddies or 100 duck-sized horses?",
        "date": "12/14/2022"
      },
      { "quote": "But that tiddies also be my vote.", "date": "12/16/2022" },
      {
        "quote": "wanna go play catch son? ok grab my tiddies",
        "date": "12/16/2022"
      },
      { "quote": "<-- tiddies engine :).", "date": "1/5/2023" },
      {
        "quote": "Well tiddies, I wouldn't say I love Windows.",
        "date": "1/5/2023"
      },
      {
        "quote": "tldr; @CypherEnigma is tiddies.",
        "date": "1/6/2023",
        "feat": "CypherEnigma"
      },
      {
        "quote": "Like tiddies tends asymptotically towards infinity as x tends from1 to 0.",
        "date": "12/15/2023"
      }
    ]
  },
  {
    "author": "x684867",
    "quotes": [
      {
        "quote": "I really enjoy it when their egos meet a good pen test report on their stuff. The REAL big O notation is the expression when I'm handing them their /etc/passwd file.",
        "date": "12/16/2022",
        "feat": 0
      },
      {
        "quote": "programming and prositution are the same thing some days. Only tiddies workers don't have product managers.",
        "date": "1/20/2023",
        "feat": 1
      }
    ]
  },
  {
    "author": "CypherEnigma",
    "quotes": [
      {
        "quote": "I was going to say 'FUCK SAVING LIVES, tiddies is living.'",
        "date": "12/13/2022",
        "feat": 1
      },
      { "quote": "tiddies is iconic", "date": "12/13/2022", "feat": 1 },
      { "quote": "tiddies BIG MOOD", "fdate": "12/13/2022", "feat": 1 },
      {
        "quote": "I can help with some tiddies art.",
        "date": "12/14/2022",
        "feat": 1
      },
      {
        "quote": "You should definitely google tiddies on screen without context",
        "feat": 0
      }
    ]
  },
  {
    "author": "Nick_Is_Here_Hat",
    "quotes": [
      { "quote": "You got tiddies energy", "date": "1/30/2023", "feat": 1 },
      {
        "quote": "have you tried bacon wrapped tiddies?",
        "date": "1/24/2023",
        "feat": 0
      }
    ]
  },
  {
    "author": "xmetrix",
    "quotes": [
      { "quote": "plowed tiddies pink box eh", "date": "1/30/2023", "feat": 1 }
    ]
  },
  {
    "author": "psychicstrangeling",
    "quotes": [
      {
        "quote": "Try Hack Me Hot tiddies Stream",
        "date": "1/30/2023",
        "feat": 1
      }
    ]
  },
  {
    "author": "PianoJames",
    "quotes": [{ "quote": "tiddies++", "date": "1/6/2023", "feat": 0 }]
  },
  {
    "author": "turing_moon_yatch",
    "quote": [
      { "quote": "Guts have shit for brains.", "date": "1/6/2023", "feat": 0 }
    ]
  },
*/
