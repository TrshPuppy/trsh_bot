// This module is meant to handle chat commands.

// Imports:
import { server } from "./trshbot.js";

class Command {
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
}
class QuoteCommand extends Command {
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
    ],
  },
];

const yesCommand = new Command("yes", [], () =>
  server.say(process.env.CHANNEL, ":)")
);
const noCommand = new Command("no", [], () =>
  server.say(process.env.CHANNEL, ":(")
);
const quoteCommand = new QuoteCommand("quote", [], handleQuoteCommand);

yesCommand.addArg("yes");
noCommand.addArg("no");

botCommands.push(yesCommand, noCommand, quoteCommand);

console.log(botCommands);

export function handleBotSummons(channel, context, message) {
  for (const command of botCommands) {
    if (command.tryHandleMessage(channel, context, message.split(" "))) {
      return;
    }
  }
}

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

/*
Current commands to integrate:
    !lurk / !unlurk
    !tiddies (count)
    !socials
    !so 
        (data to fetch?)
    !raid 
        (DTF?)
    !prompt
    !project
    !editcommand
    !music
    !mom
    !hazelnut (count)
    !discord
    !kata
    !behave
    !to 
        moderation: timeout / mute
    !gamedev
    !theme
    !hnc
    !dolphin
    !clan
    !codewars
    !swearjar / !empty

Others:
    !8ball
    !addquote / !quote
    !peachfuzz
        timer?
    !boingboingg
    



QUOTES MOCKUP:

    QUOTES = [];

    [{author: "@steve7411",
        quotes: ["JSON file?", "I am deeeply upset by this"]}]
*/
