// Imports:
import { server } from "./trshbot.js";
import apiData from "./api.json" assert { type: "json" };
import promptQueue from "./promptQueue.json" assert { type: "json" };
import * as fs from "fs";

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
      console.log(this.name);
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
      console.log("yo we made it to the cb");
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

let currentQueueNumber = 0;
// Current database:
const botCommands = [];
const channelCommands = [];
//killtop09: real programmers write in tiddies:)
const quotesDB = [
  {
    author: "hungryhungryhippo",
    quote: "@x684867 do you drink tiddies",
    date: "1/27/23",
    feature: "trsh_bot",
  },
  {
    author: "rulerlefi",
    quotes: ["Clicks get chicks or something like that?"],
  },
  { author: "arthvadrr", quotes: ["CAPS ON SLAPS ON"] },
  {
    author: "TrshPuppy",
    quotes: [
      "You gotta respect the bottom.",
      "Ruler stop flexing your python",
      "Actually one time, I was really proud, this dude got shot...",
    ],
  },
  { author: "Martyn1842", quotes: ["We're gonna need a bigger stack"] },
  {
    author: "jcblw",
    quotes: ["You're in her DMs, I'm in her console. We are not the same."],
  },
  {
    author: "steve7411",
    quotes: [
      "Sometimes I type 'pythong' instead of 'python' because 'thong', so it's muscle memory. I do that all the time...",
    ],
  },
  {
    author: "Trsh_bot",
    quotes: [
      "tiddies for shoutouts and stuff.",
      "Horse-sized tiddies or 100 duck-sized horses?",
      { quote: "But that tiddies also be my vote.", date: "12/16/22" },
      {
        quote: "wanna go play catch son? ok grab my tiddies",
        date: "12/16/22",
      },
      "<-- tiddies engine :).",
      "Well tiddies, I wouldn't say I love Windows.",
    ],
  },
  {
    author: "x684867",
    quotes: [
      {
        quote:
          "I really enjoy it when their egos meet a good pen test report on their stuff. The REAL big O notation is the expression when I'm handing them their /etc/passwd file.",
        date: "12/16/22",
      },
      {
        quote:
          "programming and prositution are the same thing some days. Only tiddies workers don't have product managers.",
        date: "01/23/23",
        feature: "trsh_bot",
      },
    ],
  },
  {
    author: "CypherEnigma",
    quotes: [
      {
        quote: "I was going to say 'FUCK SAVING LIVES, tiddies is living.'",
        feature: "trsh_bot",
      },
      {
        quote: " tiddies is iconic",
        feature: "trsh_bot",
      },
      {
        quote: "tiddies BIG MOOD",
        feature: "trsh_bot",
      },
      {
        quote: "I can help with some tiddies art.",
        feature: "trsh_bot",
      },
      {
        quote: "You should definitely google tiddies on screen without context",
        feature: "CypherEnigma",
      },
    ],
  },
  {
    author: "Nick_Is_Here_Hat",
    quotes: [
      {
        quote: "You got tiddies energy",
        feature: "trsh_bot",
        date: "1/30/23",
      },
    ],
  },
  {
    author: "xmetrix",
    quotes: [
      {
        quote: "plowed tiddies pink box eh",
        feature: "trsh_bot",
        date: "1/30/23",
      },
    ],
  },
  {
    author: "psychicstrangeling",
    quotes: [
      {
        quote: "Try Hack Me Hot tiddies Stream",
        feature: "trsh_bot",
        date: "1/31/2023",
      },
    ],
  },
]; // taladeganights, office spaces
// Remember, the field mouse is fast, but the owl sees at night...
// Leaderboard for most iconic chatters
// chatter quotes featuring TB

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
const manCommand = new ChannelCommand("!man", [], handleManCommand);
const promptCommand = new ChannelCommand("!prompt", [], handlePromptCommand);
const hiCommand = new BotCommand(
  "hi",
  ["hey", "hi", "hello", "Hi", "Hey", "Hello"],
  handleHiCommand
);

// Add commands to command arrays:
botCommands.push(yesCommand, noCommand, hiCommand);
channelCommands.push(manCommand, promptCommand, quoteCommand);

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
  console.log("yo we made it to the cb");
  //USE FIND INDEX INSTEAD
  // HANDLE FINDINDEX returning -1
  let randomQuote;
  let currentAuthor;
  let indxIntoQuotesDB;

  if (message[1] === undefined) {
    indxIntoQuotesDB = Math.floor(Math.random() * quotesDB.length);
  } else {
    indxIntoQuotesDB = quotesDB.findIndex(
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

  const quotesArrLength = quotesDB[indxIntoQuotesDB].quotes.length;
  currentAuthor = quotesDB[indxIntoQuotesDB].author;
  randomQuote =
    quotesDB[indxIntoQuotesDB].quotes[
      Math.floor(Math.random() * quotesArrLength)
    ];

  server.say(apiData.Bot.CHANNEL, `${randomQuote} - @${currentAuthor}`);
}

function handleManCommand() {
  // "!man quote"
  console.log("im a man");
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
