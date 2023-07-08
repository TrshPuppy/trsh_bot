export default class BotCommand {
  constructor(name, args, callBack, authority) {
    this.name = name;
    this.args = args;
    this.thatShitFunctionToExecute = callBack;
    this.authority = authority;
  }

  aliases = [];

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
