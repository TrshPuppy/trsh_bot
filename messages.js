/*
 * This module envelops functions r/t parsing through chat messages in order to delegate functions.
 * It is called by the TMI.js server created in server.js
 */

// Imports:
import { server } from "./server.js";
import nlp from "compromise";
import addPrompt from "./promptQueue.js";
import apiData from "./data/api.json" assert { type: "json" };
import commands from "./commands.js";

export default function delegateMessage(channel, tags, message, self) {
    // Make sure the chatter is not the bot
    if (self == true) {
        return;
    }

    // Filter for whether the message starts w/ the correct prefix, or is a message
    // for the bot ('@trsh_bot)
    const correct_prefix = apiData.Bot.PREFIX;

    switch (message[0]) {
        case correct_prefix:
            handleChannelCommand(channel, tags, message, self);
            break;
        case "/":
            return;
        case ".":
            return;
        case ";":
            return;
        // case "!":
        //     handleChannelCommand(channel, tags, message, self);
        //     break;
        case "@":
            // If the message is meant for the bot:
            if (
                message.split(" ")[0].toLowerCase() ==
                `@${apiData.Bot.BOT_USERNAME.toLowerCase()}`
            ) {
                const command = message.split(" ")[1].toLowerCase();
                if (commands[command]) {
                    commands[command].exe({ channel, tags, message, self });
                    return;
                } else {
                    const alias = findCommandByAlias(command);
                    if (alias) {
                        commands[alias].exe({ channel, tags, message, self });
                    } else {
                        // server.say(
                        //     apiData.Bot.CHANNEL,
                        //     `sorry, that command doesn't exist :(`
                        // );
                    }
                    return;
                }
            }
            return;
        default:
            // If none, then it's a regular chat message & we can run our keyword function:
            keywordQ300(channel, tags, message, self);
            break;
    }
    return;
}

let timeSinceLastKeywordMsg = new Date();
let keywordLessMessages = 0;
let timeSinceYTMessage = new Date();

function keywordQ300(channel, tags, message, self) {
    /*
  * Keyword messages (chat messages trsh_bot takes and edits a random word
  to the key word in data/api.json and re-posts to chat) happen every
  20 chat messages && every 5 minutes. Both have to be true for
  trsh_bot to do this.
  */

    /* If we have a regular message: make sure we aren't:
     */
    // 1) harrassing a first time chatter with our bot:
    if (tags[`first-msg`] === true) {
        return;
    }
    // 2) responding to the chat message of another bot:
    if (tags["display-name"] === "streamlabs") {
        return;
    }

    // How many regular chat messages have there been since the last time we changed one?
    keywordLessMessages += 1;

    // How many seconds have passed since the last time we changed a message?
    const secondsFromLastKeyword =
        (new Date() - timeSinceLastKeywordMsg) / 1000;

    // If it's been 20 messages && 5 minutes, call the function which changes the message & reset the timer & message count:
    if (secondsFromLastKeyword >= 300 && keywordLessMessages >= 20) {
        // Make sure we're not re-posting a super long chat message, or a super short one:
        const wordCount = message.split(" ").length;
        if (wordCount === 1 || wordCount >= 20) {
            return false;
        }

        /*
         * We're using compromise js to pick which word to change and how to change it.
         * We want to change a noun in the original message, and we want to preserve
         * whether it was singular or plural. data/api.json has options for both a
         * simgular and plural versions of the keyword.
         *   i.e. if the keyword is "kitten", then our options are "kitten" and "kittens"
         */

        const doc = nlp(message);
        if (!doc.has("#Noun")) {
            return false;
        }

        let randomNoun = doc.nouns().random();

        while (randomNoun.terms().length > 1) {
            randomNoun = randomNoun.terms().nouns().random();
        }

        // Here is the replacement using data/api.json:
        if (randomNoun.isPlural().length > 0) {
            randomNoun.replaceWith(apiData.Bot.KEYWORD_PLURAL);
        } else {
            randomNoun.replaceWith(apiData.Bot.KEYWORD_SINGULAR);
        }

        // Here is trsh_bot reposting the changed message to chat:
        server.say(apiData.Bot.CHANNEL, doc.text());

        timeSinceLastKeywordMsg = new Date();
        keywordLessMessages = 0;

        if (timeSinceYTMessage >= 900) {
            server.say(
                apiData.Bot.CHANNEL,
                `Have you checked out the NetPuppy Dev Log series?! TP just uploaded a new vid all about concurrenvy! --> youtu.be/ADlIelOEb5E`
            );
            timeSinceYTMessage = new Date();
        }

        return true;
    }
    return false;
}

function handleChannelCommand(channel, tags, message, self) {
    // get the name of the command to access it in the commands obj:
    let args = message.split(" ");
    let command = args.shift();
    command = command.split("");
    command.shift();
    command = command.join("").toLowerCase();

    let context = {
        channel,
        tags,
        args,
        self,
    };
    console.log("ATTEMPTINS COMMAND: " + command);
    try {
        commands[command].exe(context);
    } catch (e) {
        console.log(`ERROR in handleChannelCommand try-catch: ${e}`);
        const alias = findCommandByAlias(command);

        if (alias) {
            commands[alias].exe(context);
        } else {
            // server.say(
            //     apiData.Bot.CHANNEL,
            //     `Sorry @${tags["display-name"]}, that command doesn't exist :(`
            // );
        }
        return;
    }
}

// Return a command from the commands object by finding it, or finding its alias:
export function findCommandByAlias(command) {
    for (const [ky, val] of Object.entries(commands)) {
        const als = val["aliases"]();
        let found = als.filter((x) => x == command.toString().toLowerCase());
        if (found.length == 1) {
            return ky;
        }
    }
    return 0;
}
