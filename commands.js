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
      if (foundName === undefined) {
        return false;
      }

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
  { author: "rulerlefi", quotes: ["stop flexing your python"] },
];

const yesCommand = new Command("yes", [], () =>
  server.say(process.env.CHANNEL, ":)")
);
const noCommand = new Command("no", [], () =>
  server.say(process.env.CHANNEL, ":(")
);
const quoteCommand = new QuoteCommand("quote", [], handleQuoteCommand);

// ("quote", [], handleQuoteCommand);

// quoteCommand.addArg("rulerlefi");
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

  const indxIntoQuotes = quotesDB.findIndex((x) => x.author == message[2]);
  const randomQuote =
    quotesDB[indxIntoQuotes].quotes[Math.floor(Math.random() * 1)];

  //Math.floor(Math.random() * validIndices.length)

  server.say(channel, `${randomQuote} -@${message[2]}`);
}

// const CALL_BACK = () => server.say(channel, ":)");
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
