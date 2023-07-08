// This module handles chat commands and delegates based on their type.

// Imports:
import { server } from "../server.js";
import apiData from "../data/api.json" assert { type: "json" };
import BotCommand from "./BotCommands.js";
import ChannelCommand from "./ChannelCommands.js";
import QuoteCommand from "./QuoteCommands.js";
import TimerCommand from "./TimerCommands.js";
import addPrompt, {
  markPromptIncomplete,
  getPromptFromDB,
} from "../promptQueue.js";
import * as fs from "fs";
import quotesDBData from "../data/quotesDB.json" assert { type: "json" };

// This class constructs commands directed at the bot ex: "@trsh_bot":
// class BotCommand {
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

// //This class constructs commands which start with the "!" prefix:
// class ChannelCommand extends BotCommand {
//   // constructor / setter should set the command's authority (who can use this command via badge/role)

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

// class QuoteCommand extends ChannelCommand {
//   tryHandleMessage(channel, context, [arg0, arg1, arg2, ...rest]) {
//     if (this.name === arg0) {
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
// }

// class TimerCommand {
//   constructor(message, interval) {
//     this.message = message;
//     this.interval = interval;
//   }

//   sendMessage() {
//     console.log(this.message);
//     server.say(apiData.Bot.CHANNEL, this.message);
//   }
// }

// Globals:
const quote = {
  quote: "",
  date: new Date() * 1, // milliseconds
  feat: "",
};

export const prompt = {
  time: undefined,
  prompt: undefined,
  author: undefined,
  completed: undefined,
};

// const timer = (cb, ms) => {
//   setInterval(cb, ms);
// };

const botCommands = [];
const channelCommands = [];

// Create commmands:
const yesCommand = new BotCommand("yes", ["yes", "Yes", "Y", "y", "YES"], () =>
  server.say(apiData.Bot.CHANNEL, ":)")
);
yesCommand.addArg("yes");
yesCommand.addManual(`@${apiData.Bot.BOT_USERNAME} yes`);

const noCommand = new BotCommand("no", ["no", "No", "N", "n", "NO"], () =>
  server.say(apiData.Bot.CHANNEL, ":(")
);
noCommand.addArg("no");
noCommand.addManual(`@${apiData.Bot.BOT_USERNAME} no`);

const breakTheUniverseCommand = new BotCommand(
  "/0",
  ["divide by 0", "divide by zero", "/zero", "/0"],
  () => server.say(apiData.Bot.CHANNEL, "8008135")
);
breakTheUniverseCommand.addManual(
  `@${apiData.Bot.BOT_USERNAME}  ['/0', 'divide by zero', '/zero', 'divide by 0']`
);

const quoteCommand = new QuoteCommand("!quote", [], handleQuoteCommand);
quoteCommand.addManual("!quote <author> (author is optional)");

const addQuoteCommand = new QuoteCommand("!addquote", [], handleAddQuote);
addQuoteCommand.addManual("!addquote @<author> <quote>");

const manCommand = new ChannelCommand("!man", [], handleManCommand);
manCommand.addManual("!man <command>");

const promptCommand = new ChannelCommand("!prompt", [], handlePromptCommand);
promptCommand.addManual("!prompt <prompt>");

const getPrompt = new ChannelCommand("!g", [], handleTiddies, [
  apiData.Bot.STREAMER_NICK,
]);
getPrompt.addManual(
  `!getprompt (${apiData.Bot.BOT_USERNAME} will respond w/ the next prompt in queue).`
);
getPrompt.addAlias(["!getprompt"]);

const hiCommand = new BotCommand(
  "hi",
  ["hey", "hi", "hello", "Hi", "Hey", "Hello"],
  handleHiCommand
);
hiCommand.addManual(
  `@${apiData.Bot.BOT_USERNAME} ['hey', 'hi', 'hello', 'Hi', 'Hey', 'Hello']`
);

/* .......................................... MIGRATE STREAMLABS ..............................................*/
const clawCommand = new ChannelCommand("!claw", [], () => {
  server.say(
    apiData.Bot.CHANNEL,
    " If you think you like the Trash Heap, you're gonna love the Claw! --> https://www.theclaw.team <-- We code, we build stuff, we love tech!"
  );
});

const lurkCommand = new ChannelCommand("!lurk", [], (ch, co, msg) => {
  server.say(
    apiData.Bot.CHANNEL,
    `Puppies are such a handful... @${co.username} has gone to eat some flooring! At least it'll tire them out.`
  );
});

const unlurkCommand = new ChannelCommand("!unlurk", [], (ch, co, msg) => {
  server.say(
    apiData.Bot.CHANNEL,
    `@${co.username} has returned from chewing up the floor. Hope you're feeling happy and full @${co.username}!`
  );
});

const keyWordCommand = new ChannelCommand(
  `!${apiData.Bot.KEYWORD_PLURAL}`,
  [],
  (ch, co, msg) => {
    server.say(
      apiData.Bot.CHANNEL,
      `TP loves ${apiData.Bot.KEYWORD_PLURAL} so much she's devoted at least 6969{count tiddies 5}{count tiddies +1} lines of code to them!`
    );
  }
);

const kataCommand = new ChannelCommand(`!kata`, [], (ch, co, msg) => {
  server.say(
    apiData.Bot.CHANNEL,
    "This is the kata we're doing right now --> https://www.codewars.com/kata/52dc4688eca89d0f820004c6"
  );
});
kataCommand.addAlias([`!codewars`]);

const clanCommand = new ChannelCommand(`!clan`, [], (ch, co, msg) => {
  server.say(
    apiData.Bot.CHANNEL,
    "Join our Codewars clan! Go to: Codewars --> Account Settings --> Clan --> then type in 'TrshPuppies'."
  );
});

const momCommand = new ChannelCommand(`!mom`, [], (ch, co, msg) => {
  server.say(
    apiData.Bot.CHANNEL,
    "TP's mom is in the chat and, from now on, you will refer to her as 'Big Dog' or risk cruel and unusual punishment!"
  );
});
momCommand.addAlias([`!Mom`, "!bigdog", "!BigDog", "!Bigdog"]);
momCommand.addManual("!mom");

const hncCommand = new ChannelCommand("!hnc", [], () => {
  server.say(
    apiData.Bot.CHANNEL,
    "Check out my spooky podcast which I co-host with my cousin! --> https://www.twitch.tv/hauntzncreepz --> https://open.spotify.com/show/7hcpFnIoWhveRQeNRTNpbM"
  );
});

const musicCommand = new ChannelCommand("!music", [], () => {
  server.say(
    apiData.Bot.CHANNEL,
    "We're listening to the delicious synthwave of White Bat Audio --> https://whitebataudio.com/"
  );
});
musicCommand.addAlias(["!song", "!playlist"]);

const behaveCommand = new ChannelCommand(
  "!behave",
  [],
  (ch, co, msg) => {
    server.say(
      apiData.Bot.CHANNEL,
      `${msg[1]} BAD DOG! Don't make TP get the spray bottle!`
    );
    server.say(apiData.Bot.CHANNEL, `/timeout ${msg[1]} 1`);
  },
  [apiData.Bot.MODLIST, apiData.Bot.STREAMER_NICK]
);

const projectCommand = new ChannelCommand("!project", [], () => {
  server.say(apiData.Bot.CHANNEL, "Today we're learning Golang!");
});
projectCommand.addAlias(["!today", `!project`]);

const htbCommand = new ChannelCommand("!htb", [], () => {
  server.say(
    apiData.Bot.CHANNEL,
    "We're working through HTB's starting point, tier 2 --> https://app.hackthebox.com/starting-point"
  );
});

const imoCommand = new ChannelCommand("!imo", [], (ch, co, msg) => {
  server.say(
    apiData.Bot.CHANNEL,
    `Thanks for the suggestion ${co.username}! I'm putting it in the suggestion box for TP to review later :)`
  );
});
imoCommand.addAlias(["!ithink", "!youshould", "!Ithink", "!justdo"]);
imoCommand.addManual('"!imo <your suggestion goes here>"');

const emptySuggestionBox = new ChannelCommand(
  "!suggestionbox",
  [],
  (ch, co, msg) => {
    server.say(
      apiData.Bot.CHANNEL,
      `...Dang, where did I put those suggestions...`
    );
    server.say(
      apiData.Bot.CHANNEL,
      `They should be right here where TP keeps the fucks she gives... `
    );
  },
  [apiData.Bot.STREAMER_NICK]
);

const maleCommand = new ChannelCommand("!male", [], (ch, co, msg) => {
  server.say(apiData.Bot.CHANNEL, `male command`);
});
maleCommand.addAlias([
  "!mail",
  "!male",
  "!Mail",
  "!Male",
  "!mailman",
  "!maleman",
]);
maleCommand.addManual("male string manual", true);

const whoamiCommand = new ChannelCommand("!about", [], (ch, co, msg) => {
  server.say(
    apiData.Bot.CHANNEL,
    `Hey ${co.username}! Welcome to my trash heap! TP is a former ER nurse
  learning coding and cybersecurity. All you really need to know is the struggle is real, everything IS
  in fact on fire, and you're welcome to chill as long as you like :)`
  );
});
whoamiCommand.addAlias(["!whoami", "!trshpuppy"]);

const YTCommand = new ChannelCommand("!yt", [], (ch, co, msg) => {
  server.say(
    apiData.Bot.CHANNEL,
    "Checkout my newest video on YT, all about Codewars! --> https://www.youtube.com/watch?v=wTIcR4GxQrI"
  );
});
YTCommand.addAlias(["!youtube"]);

const themeCommand = new ChannelCommand("!theme", [], (ch, co, msg) => {
  server.say(
    apiData.Bot.CHANNEL,
    `TP is using the Vibrancy Continued Extension in VSCode.
  You can check it out here --> https://github.com/illixion/vscode-vibrancy-continued`
  );
});

/* .......................................... TIMED MESSAGES ..............................................*/
// const YTMessage = new TimerCommand(
//   "Checkout my new video about Codewars! --> https://www.youtube.com/watch?v=wTIcR4GxQrI",
//   5000
// );

// console.log(YTMessage.message);
// setInterval(YTMessage.sendMessage, YTMessage.interval);
// // 3600000

// Add commands to command arrays:
botCommands.push(yesCommand, noCommand, hiCommand, breakTheUniverseCommand);
channelCommands.push(
  manCommand,
  quoteCommand,
  addQuoteCommand,
  getPrompt,
  promptCommand,
  clawCommand,
  lurkCommand,
  unlurkCommand,
  kataCommand,
  clanCommand,
  momCommand,
  hncCommand,
  musicCommand,
  behaveCommand,
  projectCommand,
  htbCommand,
  imoCommand,
  emptySuggestionBox,
  maleCommand,
  whoamiCommand,
  YTCommand,
  themeCommand
);

const commandsCommand = new ChannelCommand("!commands", [], (ch, co, msg) => {
  const commandList = channelCommands.map((x) => {
    if (!x.authority) {
      x = x.name.toString() + ", ";
      return x;
    } else {
      return "";
    }
  });

  let commandListString = "";

  for (let c of commandList) {
    commandListString += `${c}`;
  }
  server.say(
    apiData.Bot.CHANNEL,
    `Here is a list of the commands, you can type '!man <command>'
  for more details on each: \n${commandListString}`
  );
});

channelCommands.push(commandsCommand);

// Functions:
const newPromptSuccess = () =>
  server.say(apiData.Bot.CHANNEL, "Your prompt is in the queue!");

const newQuoteSuccess = () =>
  server.say(
    apiData.Bot.CHANNEL,
    "Your quote was added to the database! Congrats on being so ICONIC!"
  );

export function handleBotSummons(channel, context, message) {
  for (const command of botCommands) {
    if (command.tryHandleMessage(channel, context, message.split(" "))) {
      return;
    }
  }
}

//handleChannelCommand
export function ifThisDoesntWorkItsStevesFault(channel, context, message) {
  for (const command of channelCommands) {
    if (command.tryHandleMessage(channel, context, message.split(" "))) {
      break;
    }
  }
}

function handleQuoteCommand(channel, context, message) {
  let randomQuote;
  let currentAuthor;
  let indxIntoQuotesDB;
  let fixedAuthorName;

  if (message[1] === undefined) {
    indxIntoQuotesDB = Math.floor(Math.random() * quotesDBData.length);
  } else {
    const authorArr = message[1].split("");

    if (authorArr[0] === "@") {
      fixedAuthorName = authorArr.slice(1).join("");
    } else {
      fixedAuthorName = authorArr.join("");
    }

    indxIntoQuotesDB = quotesDBData.findIndex(
      (x) => x.author.toLowerCase() == fixedAuthorName.toLowerCase()
    );
  }

  if (indxIntoQuotesDB === -1) {
    server.say(
      apiData.Bot.CHANNEL,
      `I guess @${fixedAuthorName} isn't ICONIC enough to be in my database :(`
    );
    return;
  }

  const quotesArrLength = quotesDBData[indxIntoQuotesDB].quotes.length;
  currentAuthor = quotesDBData[indxIntoQuotesDB].author;
  const randomIndx = Math.floor(Math.random() * quotesArrLength);
  randomQuote = quotesDBData[indxIntoQuotesDB].quotes[randomIndx].quote;

  const feat =
    quotesDBData[indxIntoQuotesDB].quotes[randomIndx].feat === 1
      ? `@${apiData.Bot.CHANNEL}`
      : undefined;

  if (feat) {
    server.say(
      apiData.Bot.CHANNEL,
      `${randomQuote} - @${currentAuthor} ft. @${apiData.Bot.BOT_USERNAME}`
    );
  } else {
    server.say(apiData.Bot.CHANNEL, `${randomQuote} - @${currentAuthor}`);
  }
  // taladeganights, office spaces
  // Remember, the field mouse is fast, but the owl sees at night...
  // Leaderboard for most iconic chatters
  // chatter quotes featuring TB
  // !TZ=Europe/Copenhagen date <- command request
  // feature request, command: !/bin/bash response: she-bang
}

function handleAddQuote(channel, context, message) {
  const quoteString = message.slice(2).join(" ");

  if (!isThisInputClean(quoteString, context)) {
    return;
  }

  const quoteToAdd = Object.create(quote);
  let authorSanitized;

  quoteToAdd.quote = quoteString;
  quoteToAdd.date = new Date();
  quoteToAdd.feat = 0;

  if (message[1].startsWith("@")) {
    authorSanitized = message[1].slice(1);
  } else {
    server.say(
      apiData.Bot.CHANNEL,
      `${context.username}, please indicate the author by adding '@' before their username, ya scrub.`
    );
    return;
  }

  if (
    quotesDBData.find(
      (x) => x.author.toLowerCase() == authorSanitized.toLowerCase()
    ) !== undefined
  ) {
    const authorIndx = quotesDBData.findIndex(
      (y) => y.author.toLowerCase() == authorSanitized.toLowerCase()
    );
    quotesDBData[authorIndx].quotes.push(quoteToAdd);
  } else {
    const authorObj = { author: authorSanitized, quotes: [quoteToAdd] };
    quotesDBData.push(authorObj);
  }

  overwriteQuotesJson(newQuoteSuccess);
}

function handleManCommand(channel, context, message) {
  if (message[1] === undefined) {
    server.say(
      apiData.Bot.CHANNEL,
      `Sorry @${context.username}, @${apiData.Bot.STREAMER_NICK} already has a man :( Try again?`
    );
    return;
  }
  let requestedCommand = message[1].startsWith("!")
    ? message[1].toLowerCase()
    : "!" + message[1].toLowerCase();

  let manMessage;

  // Check Bot commands for requested command:
  let commandIndx = botCommands.findIndex(
    (com) =>
      com.name == requestedCommand || com.name == requestedCommand.slice(1)
  );

  // Check Channel commands for request command (if not in Bot commands):
  if (commandIndx !== -1) {
    manMessage = botCommands[commandIndx].getManual();
  } else {
    commandIndx = channelCommands.findIndex(
      (c) => c.name == requestedCommand || c.name == requestedCommand.slice(1)
    );
    if (commandIndx !== -1) {
      manMessage = channelCommands[commandIndx].getManual();
    } else {
      manMessage = "That command doesn't exist, sorry bub.";
    }
  }
  server.say(apiData.Bot.CHANNEL, manMessage);
  return;
}

function handlePromptCommand(channel, context, message) {
  if (message[1] === undefined) {
    server.say(apiData.Bot.CHANNEL, `@${context.username} RTFM!`);
    return;
  }

  // Prep message for promptObj:
  message.shift();

  if (!isThisInputClean(message)) {
    server.say(
      apiData.Bot.CHANNEL,
      `Your prompt is invalid @${context.username}!`
    );
    return;
  }

  // Create promptObj to be added to DB:
  const promptObj = Object.create(prompt);

  promptObj.time = new Date() * 1; // in milliseconds
  promptObj.prompt = message.join(" ").trimEnd();
  promptObj.author = context.username;
  promptObj.completed = 0;

  // Send promptObj to be added to DB:
  const wasThePromptAddSuccessful = addPrompt(promptObj);

  wasThePromptAddSuccessful
    ? newPromptSuccess()
    : server.say(
        apiData.Bot.CHANNEL,
        "Sorry, your prompt didn't make it into the queue :("
      );

  // a day where i can imitate trshbot is a good day
  // saratonln
  // : a day where i can imitate tiddies is a good day
  // TommyLuco
  // : maybe trshbot should make some miso soup
  // Trsh_bot
  // : a day tiddies i can imitate tiddies is a good day

  // HARASS RANDOM VIEWER
}

function handleHiCommand(channel, context, message) {
  const hiIndx = hiCommand.args.findIndex((arg) => arg == message[1]);

  server.say(
    apiData.Bot.CHANNEL,
    `${hiCommand.args[hiIndx]} @${context.username}!`
  );
  return;
}

const overwriteSelectedJSON = (target, JSONObj, cb) => {
  const JSONStringData = JSON.stringify(JSONObj);

  fs.writeFile(target, JSONStringData, "utf-8", (err) => {
    if (err) {
      console.error(`Unable to write object to file. Error: ${err}`);
    } else {
      cb?.();
      console.log(`Success writing obje to file: ${target}`);
    }
  });
};

function overwritePromptJson(cb) {
  // overwriteSelectedJSON("./promptQueue.json", promptQueueData, cb);
}

function overwriteQuotesJson(cb) {
  overwriteSelectedJSON("./data/quotesDB.json", quotesDBData, cb);
}

// handleGetPrompt()
async function handleTiddies() {
  let currentPromptInQueue;
  try {
    currentPromptInQueue = await getPromptFromDB();
    if (!currentPromptInQueue) {
      server.say(
        apiData.Bot.CHANNEL,
        "There are no more prompts in the queue :("
      );
      return;
    }
  } catch (err) {
    server.say(
      apiData.Bot.CHANNEL,
      "Oops! There was an error getting the next prompt"
    );
    console.log("Error: getting prompt from DB! " + err);
    return;
  }

  server.say(
    apiData.Bot.CHANNEL,
    `'${currentPromptInQueue.prompt}' - by ${currentPromptInQueue.author}`
  );

  try {
    await markPromptIncomplete(currentPromptInQueue.rowid);
  } catch (err) {
    console.log("Error: marking prompt as complete! " + err);
    return;
  }
  return;
}

export function isThisInputClean(message) {
  const lastWord = message[0].split(""); //firstWord

  if (
    lastWord[0] === "!" ||
    lastWord[0] === "/" ||
    lastWord[0] === "." ||
    lastWord[0] === "'" ||
    lastWord[0] === `"` ||
    lastWord[0] === "`" ||
    lastWord[0] === "-" ||
    lastWord[0] === "#"
  ) {
    return false;
  }

  if (message.length > 1 || message[1] !== undefined) {
    for (const word of message) {
      const wordArr = word.split("");

      if (wordArr.includes("#")) {
        return false;
      }

      let dashIndx = wordArr.findIndex((x) => (x = "-"));
      if (dashIndx !== -1) {
        if (wordArr[dashIndx + 1] === "-" || wordArr[dashIndx + 1] === "-") {
          return false;
        }
      }
    }
  }

  return true;
}

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

//     !peachfuzz
//         timer?
//     !boingboing
//    !whatstheword (returns a random word)

// */
