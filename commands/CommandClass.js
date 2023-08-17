// import CommandLibrary from "./CommandLibrary.js";

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
function handleTestCommand() {
  console.log("tiddies");
}

const testCommand = new Command("!tiddies", [], handleTestCommand);
export const testLibrary = [];
testLibrary.push(testCommand);

// // CommandLibrary.addCommand(testCommand, "channel");
