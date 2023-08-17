// import BotCommand from "./BotCommands.js";

// //This class constructs commands which start with the "!" prefix:
// export default class ChannelCommand extends BotCommand {
//   tryHandleMessage(channel, context, [arg0, arg1, ...rest]) {
//     if (this.name !== arg0) {
//       if (this.aliases.findIndex((a) => a == arg0) === -1) {
//         return false;
//       }
//     }
//     if (this.authority !== undefined) {
//       // if (context.username.toLowerCase() !== this.authority.toLowerCase()) {
//       //   return false;
//       // }

//       if (this.authority.find((x) => (x = context.username)) === -1) {
//         return false;
//       }
//     }

//     this.thatShitFunctionToExecute(channel, context, [arg0, arg1, ...rest]);

//     return true;
//   }
// }
