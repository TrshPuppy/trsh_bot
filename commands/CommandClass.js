// import CommandLibrary from "./CommandLibrary.js";

import { server } from "../server.js";
import apiData from "../data/api.json" assert { type: "json" };

// /*
//  *   Definition of a command:
//  *       - Must come from chat
//  *       - must start with the prefix set in api.json
//  */

export default class Command {
  constructor(name, args, callBack, authority) {
    this.name = name;
    this.args = args;
    this.thatShitFunctionToExecute = callBack;
    this.authority = authority;
  }

  aliases = [];

  tryHandleMessage(channel, context, [arg0, arg1, arg2, ...rest]) {
    /* Check authority first, then name, then aliases
     *  before executing this.thatShit... (callback)
     */
    if (this.authority !== undefined) {
      if (
        this.authority.find(
          (auth) => context.username.toLowerCase() == auth.toLowerCase()
        ) === -1
      ) {
        return false;
      }
    }

    if (this.name !== arg0) {
      if (this.aliases.findIndex((a) => a == arg0) === -1) {
        return false;
      }
    }

    this.thatShitFunctionToExecute(channel, context, [arg0, arg1, ...rest]);

    return true;
  }

  addManual(string, altString) {
    if (altString) {
      this.altManual = true;
    }
    this.manual = string;
  }

  getManual() {
    if (this.altManual) {
      return this.manual;
    }
    return `Command syntax: ${
      this.manual
    }. You can also use these aliases: ${this.aliases.map(
      (a) => (a = ` ${a}`)
    )}`;
  }

  addAlias(aliasArr) {
    for (let a of aliasArr) {
      this.aliases.push(a);
    }
  }
}

//testCommand command:
function handleTestCommand(ch, co, msg) {
  server.say(apiData.Bot.CHANNEL, "Hello Tiddies, it's me trshbot");
  console.log("tiddies");
}

const testCommand = new Command("!tiddies", [], handleTestCommand);
testCommand.addManual("RTFM!");
export const commandLibrary = [];

commandLibrary.push(testCommand);

// Commands:
const manCommand = new Command("!man", [], handleManCommand);
manCommand.addManual("!man <command>");
commandLibrary.push(manCommand);

const maleCommand = new Command("!male", [], handleMaleCommand);

function handleManCommand(ch, co, msg) {
  if (msg[1] === undefined) {
    server.say(
      apiData.Bot.CHANNEL,
      `Sorry @${co.username}, @${apiData.Bot.STREAMER_NICK} already has a man :( Try again?`
    );
    return;
  }
  let requestedCommand = msg[1].startsWith("!")
    ? msg[1].toLowerCase()
    : "!" + msg[1].toLowerCase();

  let manMessage;

  // Check Bot commands for requested command:
  let commandIndx = commandLibrary.findIndex(
    (com) =>
      com.name == requestedCommand || com.name == requestedCommand.slice(1)
  );

  // Check Channel commands for request command (if not in Bot commands):
  if (commandIndx !== -1) {
    manMessage = commandLibrary[commandIndx].getManual();
  } else {
    commandIndx = commandLibrary.findIndex(
      (c) => c.name == requestedCommand || c.name == requestedCommand.slice(1)
    );
    if (commandIndx !== -1) {
      manMessage = commandLibrary[commandIndx].getManual();
    } else {
      manMessage = "That command doesn't exist, sorry bub.";
    }
  }
  server.say(apiData.Bot.CHANNEL, manMessage);
  return;
}

function handleMaleCommand(ch, co, msg) {}
