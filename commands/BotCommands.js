// import { server } from "../server.js";
// import apiData from "../data/api.json" assert { type: "json" };
// import CommandLibrary from "./CommandLibrary.js";

// export default class BotCommand {
//   constructor(name, args, callBack, authority) {
//     this.name = name;
//     this.args = args;
//     this.thatShitFunctionToExecute = callBack;
//     this.authority = authority;
//   }

//   aliases = [];

//   addArg(arg) {
//     this.args.push(arg);
//   }

//   tryHandleMessage(channel, context, [arg0, arg1, arg2, ...rest]) {
//     if (this.args.findIndex((x) => x == arg1) !== -1) {
//       this.thatShitFunctionToExecute(channel, context, [
//         arg0,
//         arg1,
//         arg2,
//         ...rest,
//       ]);
//       return true;
//     }
//     return false;
//   }

//   addManual(string, altString) {
//     if (altString) {
//       this.altManual = true;
//     }
//     this.manual = string;
//   }

//   getManual() {
//     if (this.altManual) {
//       return this.manual;
//     }
//     return `Command syntax: ${
//       this.manual
//     }. You can also use these aliases: ${this.aliases.map(
//       (a) => (a = ` ${a}`)
//     )}`;
//   }

//   addAlias(aliasArr) {
//     for (let a of aliasArr) {
//       this.aliases.push(a);
//     }
//   }
// }

// const yesCommand = new BotCommand("yes", ["yes", "Yes", "Y", "y", "YES"], () =>
//   server.say(apiData.Bot.CHANNEL, ":)")
// );
// yesCommand.addArg("yes");
// yesCommand.addManual(`@${apiData.Bot.BOT_USERNAME} yes`);

// const noCommand = new BotCommand("no", ["no", "No", "N", "n", "NO"], () =>
//   server.say(apiData.Bot.CHANNEL, ":(")
// );
// noCommand.addArg("no");
// noCommand.addManual(`@${apiData.Bot.BOT_USERNAME} no`);

// const hiCommand = new BotCommand(
//   "hi",
//   ["hey", "hi", "hello", "Hi", "Hey", "Hello"],
//   handleHiCommand
// );
// hiCommand.addManual(
//   `@${apiData.Bot.BOT_USERNAME} ['hey', 'hi', 'hello', 'Hi', 'Hey', 'Hello']`
// );

// const breakTheUniverseCommand = new BotCommand(
//   "/0",
//   ["divide by 0", "divide by zero", "/zero", "/0"],
//   () => server.say(apiData.Bot.CHANNEL, "8008135")
// );
// breakTheUniverseCommand.addManual(
//   `@${apiData.Bot.BOT_USERNAME}  ['/0', 'divide by zero', '/zero', 'divide by 0']`
// );

// const botCommands = [];
// botCommands.push(yesCommand, noCommand, hiCommand, breakTheUniverseCommand);

// export function handleBotSummons(channel, context, message) {
//   for (const command of botCommands) {
//     if (command.tryHandleMessage(channel, context, message.split(" "))) {
//       return;
//     }
//   }
// }

// function handleHiCommand(channel, context, message) {
//   const hiIndx = hiCommand.args.findIndex((arg) => arg == message[1]);

//   server.say(
//     apiData.Bot.CHANNEL,
//     `${hiCommand.args[hiIndx]} @${context.username}!`
//   );
//   return;
// }
