// Imports:
import { server } from "./trshbot.js";
import apiData from "./api.json" assert { type: "json" };

// This class constructs commands directed at the bot ex: "@trsh_bot":
class BotCommand {
  constructor(name, args, callBack) {
    this.name = name;
    this.args = [];
    this.thatShitFunctionToExecute = callBack;
  }

  addArg(arg) {
    this.args.push(arg);
  }

  tryHandleMessage(channel, context, [arg0, arg1, arg2, ...rest]) {
    if (this.name === arg1) {
      this.thatShitFunctionToExecute();
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

class QuoteCommand extends BotCommand {
  tryHandleMessage(channel, context, [arg0, arg1, arg2, ...rest]) {
    if (this.name === arg1) {
      const foundName = quotesDB.find((x) => x.author == arg2);
      console.log(foundName);
      //   if (foundName === undefined) {

      //     return false;
      //   }

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

//This class constructs commands which start with the "!" prefix:
class ChannelCommand extends BotCommand {
  // constructor / setter should set the command's authority (who can use this command via badge/role)

  tryHandleMessage(channel, context, [arg0, arg1, arg2, ...rest]) {
    if (this.name !== arg0) {
      return false;
    }
    if (channelCommands.find((x) => x.name == arg0) === -1) {
      return false;
    }
    //if ( author of command !have authority){
    //return false
    // }
    return true;
  }
}

// Current database:
const botCommands = [];
const channelCommands = [];
const quotesDB = [
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
      "I was going to say 'FUCK SAVING LIVES, tiddies is living.'",
      "tiddies is iconic",
      "tiddies BIG MOOD",
      "I can help with some tiddies art.",
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
    ],
  },
]; // taladeganights, office spaces

const yesCommand = new BotCommand("yes", [], () =>
  server.say(apiData.Bot.CHANNEL, ":)")
);
yesCommand.addArg("yes");

const noCommand = new BotCommand("no", [], () =>
  server.say(apiData.Bot.CHANNEL, ":(")
);
noCommand.addArg("no");

const quoteCommand = new QuoteCommand("quote", [], handleQuoteCommand);

const manCommand = new ChannelCommand("!man", [], handleManCommand);

botCommands.push(yesCommand, noCommand, quoteCommand);
channelCommands.push(manCommand);

// Functions:
export function handleBotSummons(channel, context, message) {
  for (const command of botCommands) {
    if (command.tryHandleMessage(channel, context, message.split(" "))) {
      return;
    }
  }
}

export function handleChannelCommand(channel, context, message) {}

function handleQuoteCommand(channel, context, message) {
  //USE FIND INDEX INSTEAD
  // HANDLE FINDINDEX returning -1
  let randomQuote;
  let currentAuthor;
  let indxIntoQuotesDB;

  if (message[2] === undefined) {
    indxIntoQuotesDB = Math.floor(Math.random() * quotesDB.length);
  } else {
    indxIntoQuotesDB = quotesDB.findIndex(
      (x) => x.author.toLowerCase() == message[2].toLowerCase()
    );
  }

  if (indxIntoQuotesDB === -1) {
    server.say(
      channel,
      `I guess @${message[2]} isn't ICONIC enough to be in my database :(`
    );
    return;
  }

  const quotesArrLength = quotesDB[indxIntoQuotesDB].quotes.length;
  currentAuthor = quotesDB[indxIntoQuotesDB].author;
  randomQuote =
    quotesDB[indxIntoQuotesDB].quotes[
      Math.floor(Math.random() * quotesArrLength)
    ];

  server.say(channel, `${randomQuote} - @${currentAuthor}`);
}

function handleManCommand() {
  // "!man quote"
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

// QUOTES MOCKUP:

//     QUOTES = [];

//     [{author: "@steve7411",
//         quotes: ["JSON file?", "I am deeeply upset by this"]}]
// */
