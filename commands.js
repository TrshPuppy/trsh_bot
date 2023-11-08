import { server } from "./server.js";
import apiData from "./data/api.json" assert { type: "json" };
import quotesDBData from "./data/quotesDB.json" assert { type: "json" };
import { findCommandByAlias } from "./messages.js";
import fs from "node:fs";

const commands = {
  man: {
    exe: (contextObj) => {
      if (contextObj.args.length === 0) {
        server.say(
          apiData.Bot.CHANNEL,
          `Sorry @${contextObj.tags["display-name"]}, @${apiData.Bot.STREAMER_NICK} already has a man
            :( Try again?`
        );
        return;
      } else {
        const commandManualed = contextObj.args[0];
        try {
          server.say(
            apiData.Bot.CHANNEL,
            `${commands[commandManualed].manual()}`
          );
        } catch (e) {
          console.log(`ERROR in commands.man.exe: ${e}`);
          const alias = findCommandByAlias(commandManualed);
          if (alias) {
            server.say(apiData.Bot.CHANNEL, `${commands[alias].manual()}`);
          } else {
            server.say(
              apiData.Bot.CHANNEL,
              `Sorry @${contextObj.tags["display-name"]}, there's no manual for that command because it doesn't exist :/`
            );
          }
        }
      }
      return;
    },
    manual: () => {
      return "Get the manual on any command. Syntax: !man <command>";
    },
    aliases: () => ["man"],
  },
  hi: {
    exe: (context) => {
      const responses = [
        `@${context.tags["display-name"]}, how's it hangin bub?`,
        `@${context.tags["display-name"]}, you're lookin fly today my guy!`,
        `How's the weather over there @${context.tags["display-name"]}?`,
        `... Who are you again?`,
        `T.G.I.<insert current day here>. amiright @${context.tags["display-name"]}?`,
        `Talk to me when I've had my coffee @${context.tags["display-name"]} -_-`,
        `Hey @${context.tags["display-name"]}, good to see u! <3`,
      ];
      const rand = Math.floor(Math.random() * responses.length);
      server.say(apiData.Bot.CHANNEL, responses[rand]);
      return;
    },
    manual: () => {
      return `Say hello to '${apiData.Bot.BOT_USERNAME}. Syntax: '@${apiData.Bot.BOT_USERNAME} hey`;
    },
    aliases: () => ["hi", "hello", "hey", "goodmorning", "yo", "gm", "whatup"],
  },
  yes: {
    exe: () => {
      server.say(apiData.Bot.CHANNEL, `:)`);
      return;
    },
    manual: () => {
      return `Syntax: '@${apiData.Bot.BOT_USERNAME} yes`;
    },
    aliases: () => ["yes", "ya", "yeah", "yas", "y"],
  },
  no: {
    exe: () => {
      server.say(apiData.Bot.CHANNEL, ":(");
      return;
    },
    manual: () => {
      return `Syntax: '@${apiData.Bot.BOT_USERNAME} no`;
    },
    aliases: () => ["no", "nah", "nope", "n"],
  },
  male: {
    exe: (contextObj) => {
      server.say(apiData.Bot.CHANNEL, "BORK! BORK! BORK!");
      return;
    },
    manual: () => {
      return "Syntax: BORK BORK BORK!!";
    },
    aliases: () => ["male", "mail", "bork"],
  },
  claw: {
    exe: (context) => {
      server.say(
        apiData.Bot.CHANNEL,
        " If you think you like the Trash Heap, you're gonna love the Claw! --> https://www.theclaw.team <-- We code, we build stuff, we love tech!"
      );
      return;
    },
    manual: () => {
      return "Find out about the Claw stream team!";
    },
    aliases: () => ["claw"],
  },
  lurk: {
    exe: (context) => {
      server.say(
        apiData.Bot.CHANNEL,
        `Puppies are such a handful... @${context.tags["display-name"]} has gone to eat some flooring! At least it'll tire them out.`
      );
      return;
    },
    manual: () => {
      return "Let everyone know you're hungry for some flooring & will be back to chat in a bit. Syntax: !lurk";
    },
    aliases: () => ["lurk"],
  },
  unlurk: {
    exe: (context) => {
      server.say(
        apiData.Bot.CHANNEL,
        `@${context.tags["display-name"]} has returned from chewing up the floor. Hope you're feeling happy and full @${context.tags["display-name"]}!`
      );
      return;
    },
    manual: () => {
      return "Let chat know you're returned and are ready to chat again! Syntax: !unlurk";
    },
    aliases: () => ["unlurk"],
  },
  kata: {
    exe: (con) => {
      server.say(
        apiData.Bot.CHANNEL,
        "This is the kata we're doing right now --> https://www.codewars.com/kata/5648b12ce68d9daa6b000099/train/go"
      );
      return;
    },
    manual: () => {
      return "Get the current Codewars kata. Syntax: !kata";
    },
    aliases: () => ["kata"],
  },
  clan: {
    exe: (c) => {
      server.say(
        apiData.Bot.CHANNEL,
        "Join our Codewars clan! Go to: Codewars --> Account Settings --> Clan --> then type in 'TrshPuppies'."
      );
      return;
    },
    manual: () => {
      return "Get instructions to join the TrshPuppies Codewars clan. Syntax: !clan";
    },
    aliases: () => ["clan"],
  },
  mom: {
    exe: (c) => {
      server.say(
        apiData.Bot.CHANNEL,
        "TP's mom is in the chat and, from now on, you will refer to her as 'Big Dog' or risk cruel and unusual punishment!"
      );
      return;
    },
    manual: () => {
      return "Big Dog in the House WHAT WHAT!??!";
    },
    aliases: () => ["mom", "bigdog"],
  },
  hnc: {
    exe: (c) => {
      server.say(
        apiData.Bot.CHANNEL,
        "Check out my spooky podcast which I co-host with my cousin! --> https://www.twitch.tv/hauntzncreepz --> https://open.spotify.com/show/7hcpFnIoWhveRQeNRTNpbM"
      );
      return;
    },
    manual: () => {
      return "Find out about my spooky podcast. Syntax: !hnc";
    },
    aliases: () => ["hnc", "hauntzncreepz", "hauntzandcreepz"],
  },
  music: {
    exe: (c) => {
      server.say(
        apiData.Bot.CHANNEL,
        "We're listening to synthwave from our boi White Bat Audio --> https://whitebataudio.com"
      );
      return;
    },
    manual: () => {
      return "Want to know what we're listening to? Syntax: !music";
    },
    aliases: () => ["music", "song", "playlist"],
  },
  project: {
    exe: (c) => {
      server.say(
        apiData.Bot.CHANNEL,
        "Today we're working on @trsh_bot --> https://github.com/trshpuppy/trsh_bot"
      );
      return;
    },
    manual: () => {
      return "Find out what we're working on today. Syntax: !project";
    },
    aliases: () => ["project", "today", "htb"],
  },
  about: {
    exe: (c) => {
      server.say(
        apiData.Bot.CHANNEL,
        `Hey ${c.tags["display-name"]}! Welcome to my trash heap! TP is a former ER nurse
        learning coding and cybersecurity. All you really need to know is the struggle is real, everything IS
        in fact on fire, and you're welcome to chill as long as you like :)`
      );
      return;
    },
    manual: () => {
      return "Find out about TP. Syntax: !about";
    },
    aliases: () => ["about", "whoami"],
  },
  theme: {
    exe: (c) => {
      server.say(
        apiData.Bot.CHANNEL,
        `TP is using the Vibrancy Continued Extension in VSCode.
        You can check it out here --> https://github.com/illixion/vscode-vibrancy-continued`
      );
      return;
    },
    manual: () => {
      return "Find out about TP's VSCode theme. Syntax: !theme";
    },
    aliases: () => ["theme"],
  },
  yt: {
    exe: (c) => {
      server.say(
        apiData.Bot.CHANNEL,
        "Checkout my newest YT video: 'My 1st Tech Interview was for a Senior Position'! --> https://www.youtube.com/watch?v=V1MkBvpD-xw"
      );
      return;
    },
    manual: () => {
      return "Find out about my latest YouTube video. Syntax: !yt";
    },
    aliases: () => ["yt", "youtube"],
  },
  quote: {
    exe: (context) => {
      let indxIntoQuotesDB = 0;
      let requestedAuthor = "";

      const chatter = context.tags["display-name"];
      const quoteString = context.args;

      // If the requesting chatter doesn't specify an author, choose a random index into the quotes array:
      if (quoteString[0] === undefined) {
        indxIntoQuotesDB = Math.floor(Math.random() * quotesDBData.length);
      } else {
        // If requesting chatter DID specify an author, allow them to specify one w/ or w/o using `@`
        //  in front of the author's username
        const reqAuthorArr = quoteString[0].split("");

        requestedAuthor =
          reqAuthorArr[0] === "@"
            ? reqAuthorArr.slice(1).join("")
            : reqAuthorArr.join("");

        // Find the index in the quotes array where requested author exists:
        indxIntoQuotesDB = quotesDBData.findIndex((x) => {
          x = x.author
            .toLowerCase()
            .localeCompare(requestedAuthor.toLowerCase());
          return x == 0;
        });

        // Couldn't find requested author:
        if (indxIntoQuotesDB === -1) {
          server.say(
            apiData.Bot.CHANNEL,
            `I guess @${requestedAuthor} isn't ICONIC enough to be in my database :(`
          );
          return;
        }
      }

      // Build the quote to return:
      const currentAuthor = quotesDBData[indxIntoQuotesDB].author;
      const thisAuthorsQuotes = quotesDBData[indxIntoQuotesDB].quotes;

      const randIndx = Math.floor(Math.random() * thisAuthorsQuotes.length);
      let randomQuote = quotesDBData[indxIntoQuotesDB].quotes[randIndx].quote;

      // Check to see if the quote is actually a quote from the bot
      // changing the keyword in a chatter's original message
      const feat = quotesDBData[indxIntoQuotesDB].quotes[randIndx].feat;

      if (feat) {
        server.say(
          apiData.Bot.CHANNEL,
          `"${randomQuote}" - @${currentAuthor} ft. @${apiData.Bot.BOT_USERNAME}`
        );
      } else {
        server.say(apiData.Bot.CHANNEL, `"${randomQuote}" - @${currentAuthor}`);
      }

      return;
    },
    manual: () => {
      return `Get a random quote from chat. You can either ask for a specific author: '!quote @<author>', or let @${apiData.Bot.BOT_USERNAME} choose: '!quote'`;
    },
    aliases: () => ["q"],
  },
  addquote: {
    exe: (context) => {
      // Return if no input:
      if (context.args.length < 2) {
        server.say(
          apiData.Bot.CHANNEL,
          `@${context.tags["display-name"]}, try again or RTFM: '!man addquote'.`
        );
        return;
      }

      // Use Regex to find authors, there can be a max of two (an OG and a feat)
      // The first author will be treated as the OG (the chatter who said the chat originally)
      // the second author is the feat (such as a quote saved where the bot changed a word to the keyword)
      const authorRgx = /(@[A-Za-z0-9]{3,20})/g;
      const authors = context.args.join(" ").matchAll(authorRgx);
      let authorsArr = [];

      for (const match of authors) {
        authorsArr.push(match[0]);
      }

      // If there are more than 2 authors, throw an error in the chat:
      if (authorsArr.length > 2 || authorsArr.length < 1) {
        server.say(
          apiData.Bot.CHANNEL,
          `@${context.tags["display-name"]}, if you're trying to add a quote use this syntax: '!addquote @<author> @<featuring (optional)> <quote string>'`
        );
        return;
      }

      authorsArr = authorsArr.map((a) => {
        a = a.split("");
        a.shift("");
        a = a.join("");
        console.log(`a = ${a}`);
        return a;
      });

      const OG = authorsArr[0];
      const feat = authorsArr[1] !== undefined ? authorsArr[1] : 0;

      // Get the quote string with authors filtered out:
      const dirtyQuoteString = context.args
        .join(" ")
        .replaceAll(authorRgx, "")
        .trim();

      // Clean the string:
      let theNasties = /([@`)(}{[\]#~]*([-]{2})*)(';)*/g;
      const cleanQuoteString = dirtyQuoteString
        .replaceAll(theNasties, "")
        .trim();

      // Build the quote object to go into the json:
      const quoteObj = new Object({
        quote: cleanQuoteString,
        date: new Date(),
        feat: feat,
      });

      let authorFound = 0;
      // Find author in JSON:
      for (const entry of quotesDBData) {
        if (entry["author"].toLowerCase() === OG.toLowerCase()) {
          entry["quotes"].push(quoteObj);
          authorFound = 1;
          break;
        }
      }

      // Create new author object:
      if (!authorFound) {
        const authorObj = new Object({
          author: OG,
          quotes: [quoteObj],
        });

        quotesDBData.push(authorObj);
      }

      // // Now overwrite the JSON:
      const JSONString = JSON.stringify(quotesDBData);

      fs.writeFile("./data/quotesDB.json", JSONString, "utf-8", (err) => {
        if (err) {
          console.error(`ERROR: Unable to write object to file. Error: ${err}`);
        } else {
          console.log(`Success adding new quote to JSON file!`);
        }
      });

      return;
    },
    manual: () => {
      return `Add a quote to the quote database. Syntax: '!addquote @<author's username> @<featured author (optional)> <quote>'. If the quote is a message @${apiData.Bot.BOT_USERNAME} changed, then the syntax is: '!addquote <${apiData.Bot.BOT_USERNAME}> @<original author's username> <quote>'.`;
    },
    aliases: () => ["aq"],
  },
  prompt: {
    exe: (context) => {
      handleAddPrompt(context);
      return;
    },
    manual: () => {},
    aliases: () => ["pr", "addprompt"],
  },
  commands: {
    exe: (contextObj) => {
      const list = Object.getOwnPropertyNames(commands);

      const returnArr = list.map((com) => {
        return `${apiData.Bot.PREFIX}${com}`;
      });

      server.say(
        apiData.Bot.CHANNEL,
        `@${
          contextObj.tags["display-name"]
        }, here is a list of all the commands: ${returnArr.join(" ")}.`
      );
      return;
    },
    manual: () => {
      return "Get a full list of the commands. Syntax: !commands";
    },
    aliases: () => [],
  },
};
export default commands;

function handleAddPrompt(context) {
  const promptText = context.args;

  // Make sure there is a prompt after the command:
  if (promptText.length <= 0) {
    server.say(apiData.Bot.CHANNEL, `@${context.tags["display-name"]} RTFM!`);
    return;
  }

  // Make sure the prompt text is clean (no punctuation/ numbers);
  // const filteredPromptArr = [];
  // for (let word of promptText) {
  //   const filtered = word.split("").filter((c) => {
  //     return (
  //       (c.charCodeAt(0) >= 65 && c.charCodeAt(0) <= 90) ||
  //       (c.charCodeAt(0) >= 97 && c.charCodeAt(0) <= 122)
  //     );
  //   });

  //   if (filtered.length > 0) {
  //     filteredPromptArr.push(filtered.join(""));
  //   }
  // }

  const sparklyCleanPromptText = filteredPromptArr.join(" ");

  // Create promptObj to be added to DB:
  const promptObj = Object.create();

  promptObj.time = new Date() * 1; // in milliseconds
  promptObj.prompt = sparklyCleanPromptText;
  promptObj.author = context.tags["display-name"];
  promptObj.completed = 0;

  // Send promptObj to be added to DB:
  const wasThePromptAddSuccessful = addPrompt(promptObj);
}

// function handlePromptCommand(channel, context, message) {
//   if (message[1] === undefined) {
//     server.say(apiData.Bot.CHANNEL, `@${context.username} RTFM!`);
//     return;
//   }

//   // Prep message for promptObj:
//   message.shift();

//   if (!isThisInputClean(message)) {
//     server.say(
//       apiData.Bot.CHANNEL,
//       `Your prompt is invalid @${context.username}!`
//     );
//     return;
//   }

//   // Create promptObj to be added to DB:
//   const promptObj = Object.create(prompt);

//   promptObj.time = new Date() * 1; // in milliseconds
//   promptObj.prompt = message.join(" ").trimEnd();
//   promptObj.author = context.username;
//   promptObj.completed = 0;

//   // Send promptObj to be added to DB:
//   const wasThePromptAddSuccessful = addPrompt(promptObj);

//   wasThePromptAddSuccessful
//     ? newPromptSuccess()
//     : server.say(
//         apiData.Bot.CHANNEL,
//         "Sorry, your prompt didn't make it into the queue :("
//       );
// }

// This module handles chat commands and delegates based on their type.

// // Imports:
// import { server } from "../server.js";
// import apiData from "../data/api.json" assert { type: "json" };
// import BotCommand from "./BotCommands.js";
// import ChannelCommand from "./ChannelCommands.js";
// import QuoteCommand from "./QuoteCommands.js";
// import TimerCommand from "./TimerCommands.js";
// import addPrompt, {
//   markPromptIncomplete,
//   getPromptFromDB,
// } from "../promptQueue.js";
// import * as fs from "fs";
// import CommandLibrary from "./CommandLibrary.js";
// import Command from "./CommandClass.js";
// import quotesDBData from "../data/quotesDB.json" assert { type: "json" };

// import { commandLibrary } from "./CommandClass.js";

// export function handleChannelCommand(channel, context, message) {
//   // const allCommandsToTry = CommandLibrary.getAllCommandsOfType("channel");

//   for (const command of commandLibrary) {
//     if (command.tryHandleMessage(channel, context, message.split(" "))) {
//       break;
//     }
//   }
// }

// // Globals:
// const quote = {
//   quote: "",
//   date: new Date() * 1, // milliseconds
//   feat: "",
// };

// export const prompt = {
//   time: undefined,
//   prompt: undefined,
//   author: undefined,
//   completed: undefined,
// };

// const channelCommands = [];

// // const quoteCommand = new QuoteCommand("!quote", [], handleQuoteCommand);
// // quoteCommand.addManual("!quote <author> (author is optional)");

// // const addQuoteCommand = new QuoteCommand("!addquote", [], handleAddQuote);
// // addQuoteCommand.addManual("!addquote @<author> <quote>");

// const manCommand = new ChannelCommand("!man", [], handleManCommand);
// manCommand.addManual("!man <command>");

// const promptCommand = new ChannelCommand("!prompt", [], handlePromptCommand);
// promptCommand.addManual("!prompt <prompt>");

// const getPrompt = new ChannelCommand("!g", [], handleTiddies, [
//   apiData.Bot.STREAMER_NICK,
// ]);
// getPrompt.addManual(
//   `!getprompt (${apiData.Bot.BOT_USERNAME} will respond w/ the next prompt in queue).`
// );
// getPrompt.addAlias(["!getprompt"]);

// /* .......................................... MIGRATE STREAMLABS ..............................................*/
// const clawCommand = new ChannelCommand("!claw", [], () => {
//   server.say(
//     apiData.Bot.CHANNEL,
//     " If you think you like the Trash Heap, you're gonna love the Claw! --> https://www.theclaw.team <-- We code, we build stuff, we love tech!"
//   );
// });

// const lurkCommand = new ChannelCommand("!lurk", [], (ch, co, msg) => {
//   server.say(
//     apiData.Bot.CHANNEL,
//     `Puppies are such a handful... @${co.username} has gone to eat some flooring! At least it'll tire them out.`
//   );
// });

// const unlurkCommand = new ChannelCommand("!unlurk", [], (ch, co, msg) => {
//   server.say(
//     apiData.Bot.CHANNEL,
//     `@${co.username} has returned from chewing up the floor. Hope you're feeling happy and full @${co.username}!`
//   );
// });

// const keyWordCommand = new ChannelCommand(
//   `!${apiData.Bot.KEYWORD_PLURAL}`,
//   [],
//   (ch, co, msg) => {
//     server.say(
//       apiData.Bot.CHANNEL,
//       `TP loves ${apiData.Bot.KEYWORD_PLURAL} so much she's devoted at least 6969{count tiddies 5}{count tiddies +1} lines of code to them!`
//     );
//   }
// );

// const kataCommand = new ChannelCommand(`!kata`, [], (ch, co, msg) => {
//   server.say(
//     apiData.Bot.CHANNEL,
//     "This is the kata we're doing right now --> https://www.codewars.com/kata/52dc4688eca89d0f820004c6"
//   );
// });
// kataCommand.addAlias([`!codewars`]);

// const clanCommand = new ChannelCommand(`!clan`, [], (ch, co, msg) => {
//   server.say(
//     apiData.Bot.CHANNEL,
//     "Join our Codewars clan! Go to: Codewars --> Account Settings --> Clan --> then type in 'TrshPuppies'."
//   );
// });

// const momCommand = new ChannelCommand(`!mom`, [], (ch, co, msg) => {
//   server.say(
//     apiData.Bot.CHANNEL,
//     "TP's mom is in the chat and, from now on, you will refer to her as 'Big Dog' or risk cruel and unusual punishment!"
//   );
// });
// momCommand.addAlias([`!Mom`, "!bigdog", "!BigDog", "!Bigdog"]);
// momCommand.addManual("!mom");

// const hncCommand = new ChannelCommand("!hnc", [], () => {
//   server.say(
//     apiData.Bot.CHANNEL,
//     "Check out my spooky podcast which I co-host with my cousin! --> https://www.twitch.tv/hauntzncreepz --> https://open.spotify.com/show/7hcpFnIoWhveRQeNRTNpbM"
//   );
// });

// const musicCommand = new ChannelCommand("!music", [], () => {
//   server.say(
//     apiData.Bot.CHANNEL,
//     "We're listening to the delicious synthwave of White Bat Audio --> https://whitebataudio.com/"
//   );
// });
// musicCommand.addAlias(["!song", "!playlist"]);

// const behaveCommand = new ChannelCommand(
//   "!behave",
//   [],
//   (ch, co, msg) => {
//     server.say(
//       apiData.Bot.CHANNEL,
//       `${msg[1]} BAD DOG! Don't make TP get the spray bottle!`
//     );
//     server.say(apiData.Bot.CHANNEL, `/timeout ${msg[1]} 1`);
//   },
//   [apiData.Bot.MODLIST, apiData.Bot.STREAMER_NICK]
// );

// const projectCommand = new ChannelCommand("!project", [], () => {
//   server.say(apiData.Bot.CHANNEL, "Today we're learning Golang!");
// });
// projectCommand.addAlias(["!today", `!project`]);

// const htbCommand = new ChannelCommand("!htb", [], () => {
//   server.say(
//     apiData.Bot.CHANNEL,
//     "We're working through HTB's starting point, tier 2 --> https://app.hackthebox.com/starting-point"
//   );
// });

// const imoCommand = new ChannelCommand("!imo", [], (ch, co, msg) => {
//   server.say(
//     apiData.Bot.CHANNEL,
//     `Thanks for the suggestion ${co.username}! I'm putting it in the suggestion box for TP to review later :)`
//   );
// });
// imoCommand.addAlias(["!ithink", "!youshould", "!Ithink", "!justdo"]);
// imoCommand.addManual('"!imo <your suggestion goes here>"');

// const emptySuggestionBox = new ChannelCommand(
//   "!suggestionbox",
//   [],
//   (ch, co, msg) => {
//     server.say(
//       apiData.Bot.CHANNEL,
//       `...Dang, where did I put those suggestions...`
//     );
//     server.say(
//       apiData.Bot.CHANNEL,
//       `They should be right here where TP keeps the fucks she gives... `
//     );
//   },
//   [apiData.Bot.STREAMER_NICK]
// );

// const maleCommand = new ChannelCommand("!male", [], (ch, co, msg) => {
//   server.say(apiData.Bot.CHANNEL, `male command`);
// });
// maleCommand.addAlias([
//   "!mail",
//   "!male",
//   "!Mail",
//   "!Male",
//   "!mailman",
//   "!maleman",
// ]);
// maleCommand.addManual("male string manual", true);

// const whoamiCommand = new ChannelCommand("!about", [], (ch, co, msg) => {
//   server.say(
//     apiData.Bot.CHANNEL,
//     `Hey ${co.username}! Welcome to my trash heap! TP is a former ER nurse
//   learning coding and cybersecurity. All you really need to know is the struggle is real, everything IS
//   in fact on fire, and you're welcome to chill as long as you like :)`
//   );
// });
// whoamiCommand.addAlias(["!whoami", "!trshpuppy"]);

// const YTCommand = new ChannelCommand("!yt", [], (ch, co, msg) => {
//   server.say(
//     apiData.Bot.CHANNEL,
//     "Checkout my newest video on YT, all about Codewars! --> https://www.youtube.com/watch?v=wTIcR4GxQrI"
//   );
// });
// YTCommand.addAlias(["!youtube"]);

// const themeCommand = new ChannelCommand("!theme", [], (ch, co, msg) => {
//   server.say(
//     apiData.Bot.CHANNEL,
//     `TP is using the Vibrancy Continued Extension in VSCode.
//   You can check it out here --> https://github.com/illixion/vscode-vibrancy-continued`
//   );
// });

// /* .......................................... TIMED MESSAGES ..............................................*/
// // const YTMessage = new TimerCommand(
// //   "Checkout my new video about Codewars! --> https://www.youtube.com/watch?v=wTIcR4GxQrI",
// //   5000
// // );

// // console.log(YTMessage.message);
// // setInterval(YTMessage.sendMessage, YTMessage.interval);
// // // 3600000

// // Add commands to command arrays:
// // botCommands.push(yesCommand, noCommand, hiCommand, breakTheUniverseCommand);
// channelCommands.push(
//   manCommand,
//   quoteCommand,
//   addQuoteCommand,
//   getPrompt,
//   promptCommand,
//   clawCommand,
//   lurkCommand,
//   unlurkCommand,
//   kataCommand,
//   clanCommand,
//   momCommand,
//   hncCommand,
//   musicCommand,
//   behaveCommand,
//   projectCommand,
//   htbCommand,
//   imoCommand,
//   emptySuggestionBox,
//   maleCommand,
//   whoamiCommand,
//   YTCommand,
//   themeCommand
// );

// const commandsCommand = new ChannelCommand("!commands", [], (ch, co, msg) => {
//   const commandList = channelCommands.map((x) => {
//     if (!x.authority) {
//       x = x.name.toString() + ", ";
//       return x;
//     } else {
//       return "";
//     }
//   });

//   let commandListString = "";

//   for (let c of commandList) {
//     commandListString += `${c}`;
//   }
//   server.say(
//     apiData.Bot.CHANNEL,
//     `Here is a list of the commands, you can type '!man <command>'
//   for more details on each: \n${commandListString}`
//   );
// });

// channelCommands.push(commandsCommand);

// // Functions:
// const newPromptSuccess = () =>
//   server.say(apiData.Bot.CHANNEL, "Your prompt is in the queue!");

// const newQuoteSuccess = () =>
//   server.say(
//     apiData.Bot.CHANNEL,
//     "Your quote was added to the database! Congrats on being so ICONIC!"
//   );

//handleChannelCommand
// export function ifThisDoesntWorkItsStevesFault(channel, context, message) {
//   const allCommandsToTry = CommandLibrary.getAllCommandsOfType("all");

//   for (const command of allCommandsToTry) {
//     if (command.tryHandleMessage(channel, context, message.split(" "))) {
//       break;
//     }
//   }
// }

//testCommand command:
// function handleTestCommand() {
//   console.log("hi!");
// }

// const testCommand = new Command("!tiddies", [], () => {
//   console.log("hi 2");
// });

// CommandLibrary.addCommand(testCommand, "channel");

// function handleQuoteCommand(channel, context, message) {
//   let randomQuote;
//   let currentAuthor;
//   let indxIntoQuotesDB;
//   let fixedAuthorName;

//   if (message[1] === undefined) {
//     indxIntoQuotesDB = Math.floor(Math.random() * quotesDBData.length);
//   } else {
//     const authorArr = message[1].split("");

//     if (authorArr[0] === "@") {
//       fixedAuthorName = authorArr.slice(1).join("");
//     } else {
//       fixedAuthorName = authorArr.join("");
//     }

//     indxIntoQuotesDB = quotesDBData.findIndex(
//       (x) => x.author.toLowerCase() == fixedAuthorName.toLowerCase()
//     );
//   }

//   if (indxIntoQuotesDB === -1) {
//     server.say(
//       apiData.Bot.CHANNEL,
//       `I guess @${fixedAuthorName} isn't ICONIC enough to be in my database :(`
//     );
//     return;
//   }

//   const quotesArrLength = quotesDBData[indxIntoQuotesDB].quotes.length;
//   currentAuthor = quotesDBData[indxIntoQuotesDB].author;
//   const randomIndx = Math.floor(Math.random() * quotesArrLength);
//   randomQuote = quotesDBData[indxIntoQuotesDB].quotes[randomIndx].quote;

//   const feat =
//     quotesDBData[indxIntoQuotesDB].quotes[randomIndx].feat === 1
//       ? `@${apiData.Bot.CHANNEL}`
//       : undefined;

//   if (feat) {
//     server.say(
//       apiData.Bot.CHANNEL,
//       `${randomQuote} - @${currentAuthor} ft. @${apiData.Bot.BOT_USERNAME}`
//     );
//   } else {
//     server.say(apiData.Bot.CHANNEL, `${randomQuote} - @${currentAuthor}`);
//   }
//   // taladeganights, office spaces
//   // Remember, the field mouse is fast, but the owl sees at night...
//   // Leaderboard for most iconic chatters
//   // chatter quotes featuring TB
//   // !TZ=Europe/Copenhagen date <- command request
//   // feature request, command: !/bin/bash response: she-bang
// }

// function handleManCommand(channel, context, message) {
//   if (message[1] === undefined) {
//     server.say(
//       apiData.Bot.CHANNEL,
//       `Sorry @${context.username}, @${apiData.Bot.STREAMER_NICK} already has a man :( Try again?`
//     );
//     return;
//   }
//   let requestedCommand = message[1].startsWith("!")
//     ? message[1].toLowerCase()
//     : "!" + message[1].toLowerCase();

//   let manMessage;

//   // Check Bot commands for requested command:
//   let commandIndx = botCommands.findIndex(
//     (com) =>
//       com.name == requestedCommand || com.name == requestedCommand.slice(1)
//   );

//   // Check Channel commands for request command (if not in Bot commands):
//   if (commandIndx !== -1) {
//     manMessage = botCommands[commandIndx].getManual();
//   } else {
//     commandIndx = channelCommands.findIndex(
//       (c) => c.name == requestedCommand || c.name == requestedCommand.slice(1)
//     );
//     if (commandIndx !== -1) {
//       manMessage = channelCommands[commandIndx].getManual();
//     } else {
//       manMessage = "That command doesn't exist, sorry bub.";
//     }
//   }
//   server.say(apiData.Bot.CHANNEL, manMessage);
//   return;
// }

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

// // handleGetPrompt()
// async function handleTiddies() {
//   let currentPromptInQueue;
//   try {
//     currentPromptInQueue = await getPromptFromDB();
//     if (!currentPromptInQueue) {
//       server.say(
//         apiData.Bot.CHANNEL,
//         "There are no more prompts in the queue :("
//       );
//       return;
//     }
//   } catch (err) {
//     server.say(
//       apiData.Bot.CHANNEL,
//       "Oops! There was an error getting the next prompt"
//     );
//     console.log("Error: getting prompt from DB! " + err);
//     return;
//   }

//   server.say(
//     apiData.Bot.CHANNEL,
//     `'${currentPromptInQueue.prompt}' - by ${currentPromptInQueue.author}`
//   );

//   try {
//     await markPromptIncomplete(currentPromptInQueue.rowid);
//   } catch (err) {
//     console.log("Error: marking prompt as complete! " + err);
//     return;
//   }
//   return;
// }

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
