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

  addCallBack(cb) {
    this.thatShitFunctionToExecute = cb;
  }
}

const BOT_COMMANDS = [];
const CHANNEL_COMMANDS = [];

let yes = new Command("yes", [], () => server.say(process.env.CHANNEL, ":)"));

yes.addArg("yes");

BOT_COMMANDS.push(yes);

// BOT_COMMANDS.push(
//   new Command("yes", [], () => server.say(process.env.CHANNEL, ":)")).addArg(
//     "yes"
//   )
//   // .addCallBack(() => server.say(process.env.CHANNEL, ":)"))
// );

console.log(BOT_COMMANDS);

// const BOT_COMMANDS = [{ command: "yes", args: undefined, whatDo: undefined }];

export function handleBotSummons(channel, context, message) {
  // <@trsh_bot><commands><args>
  let messageArgs = message.split(" ");

  if (messageArgs[1] === "yes") {
    let found = BOT_COMMANDS.find((x) => x.name == "yes");
    console.log(found);
    found.thatShitFunctionToExecute();
  }
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
    
*/
