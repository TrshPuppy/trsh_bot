export default class CommandLibrary {
  // static allCommands = [];
  static allBotCommands = [];
  static allChannelCommands = [];
  static allQuoteCommands = [];
  static allTimerCommands = [];

  static getAllCommandsOfType(type) {
    switch (type) {
      case "bot":
        return CommandLibrary.allBotCommands;
      case "channel":
        return CommandLibrary.allChannelCommands;
      case "quote":
        return CommandLibrary.allQuoteCommands;
      case "timer":
        return CommandLibrary.allTimerCommands;
      case "all":
        const allCommandsReturnArr = [];
        allCommandsReturnArr.push(CommandLibrary.getAllCommandsOfType("bot"));
        allCommandsReturnArr.push(
          CommandLibrary.getAllCommandsOfType("channel")
        );
        allCommandsReturnArr.push(CommandLibrary.getAllCommandsOfType("quote"));
        allCommandsReturnArr.push(CommandLibrary.getAllCommandsOfType("timer"));

        allCommandsReturnArr.flatMap((a) => (a = a));
        return allCommandsReturnArr;
      default:
        console.log(`No commands of type: ${type}.`);
    }
  }

  static addCommand(command, type) {
    switch (type) {
      case "bot":
        CommandLibrary.allBotCommands.push(command);
        break;
      case "channel":
        CommandLibrary.allChannelCommands.push(command);
        break;
      case "quote":
        CommandLibrary.allQuoteCommands.push(command);
        break;
      case "timer":
        CommandLibrary.allTimerCommands.push(command);
        break;
      default:
        console.log(
          `The command type: ${type} does not exist. Command not added.`
        );
    }
  }

  static deleteCommand(command, type) {}
}
