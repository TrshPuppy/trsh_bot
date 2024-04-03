import { server } from "./server.js";
import apiData from "./data/api.json" assert { type: "json" };
import quotesDBData from "./data/quotesDB.json" assert { type: "json" };
import { findCommandByAlias } from "./messages.js";
import fs from "node:fs";
import addPrompt, {
    getPromptFromDB,
    markPromptIncomplete,
} from "./promptQueue.js";
import { get } from "node:http";

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
                        server.say(
                            apiData.Bot.CHANNEL,
                            `${commands[alias].manual()}`
                        );
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
        aliases: () => [
            "hi",
            "hello",
            "hey",
            "goodmorning",
            "yo",
            "gm",
            "whatup",
            "hihi",
        ],
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
                `@${c.tags["display-name"]}, checkout the little box next to my cam source, it should say what's playing right now!`
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
                "Today we're coding NetPuppy; a CLI tool for establishing a TCP connection b/w 2 peers w/ the option for starting a reverse shell on one! --> github.com/trshpuppy/netpuppy"
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
                indxIntoQuotesDB = Math.floor(
                    Math.random() * quotesDBData.length
                );
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

            const randIndx = Math.floor(
                Math.random() * thisAuthorsQuotes.length
            );
            let randomQuote =
                quotesDBData[indxIntoQuotesDB].quotes[randIndx].quote;

            // Check to see if the quote is actually a quote from the bot
            // changing the keyword in a chatter's original message
            const feat = quotesDBData[indxIntoQuotesDB].quotes[randIndx].feat;

            if (feat) {
                server.say(
                    apiData.Bot.CHANNEL,
                    `"${randomQuote}" - @${currentAuthor} ft. @${apiData.Bot.BOT_USERNAME}`
                );
            } else {
                server.say(
                    apiData.Bot.CHANNEL,
                    `"${randomQuote}" - @${currentAuthor}`
                );
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
            const authorRgx = /@[\da-zA-Z]\w{3,24}/g; // @[\da-zA-Z]\w{3,24}
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
                    console.error(
                        `ERROR: Unable to write object to file. Error: ${err}`
                    );
                    server.say(
                        apiData.Bot.CHANNEL,
                        `Sorry @${context.tags["display-name"]}, I couldn't add that quote :(`
                    );
                } else {
                    server.say(
                        apiData.Bot.CHANNEL,
                        `Thanks @${context.tags["display-name"]}, your ICONIC quote was added to my database ;)`
                    );
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
            const success = handleAddPrompt(context);
            if (success) {
                server.say(
                    apiData.Bot.CHANNEL,
                    "Your prompt was successfully added to the queue! :)"
                );
            }
            return;
        },
        manual: () => {
            return `Give me a prompt to try with the AI art generator! Syntx: !prompt <prompt>`;
        },
        aliases: () => ["pr", "addprompt"],
    },
    getprompt: {
        exe: async (c) => {
            // Caller should be a mod:
            if (c.tags["mod"] === false) {
                return;
            }

            // If they're a mod, let em cook:
            try {
                const nextPromptInQueue = await getPromptFromDB(); // returns an object including .prompt and .author keys
                console.log("gotprompt:  " + gotprompt);
                if (!nextPromptInQueue) {
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
                `'${nextPromptInQueue.prompt}' - by @${nextPromptInQueue.author}`
            );

            try {
                await markPromptIncomplete(nextPromptInQueue.rowid);
            } catch (err) {
                console.log("Error: marking prompt as complete! " + err);
                return;
            }
            return;
        },
        manual: () => {
            return `Get the next prompt in the queue. Syntax: !getprompt`;
        },
        aliases: () => ["gt", "g"],
    },
    cmds: {
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
        aliases: () => ["commands"],
    },
    website: {
        exe: (contextObj) => {
            server.say(
                apiData.Bot.CHANNEL,
                `Checkout TP's website! The front end is jank but the content is FIRE! --> https://trshpuppy.github.io/`
            );
            return;
        },
        manual: () => {
            return "Get the URL for TP's website";
        },
        aliases: () => ["io", "web"],
    },
    dare: {
        exe: (contextObj) => {
            server.say(
                apiData.Bot.CHANNEL,
                `Hey pleb, I dare you to click this --> https://media.giphy.com/media/riwUvx9DmD1bSTw05Z/giphy.mp4`
            );
            return;
        },
        manual: () => {
            return "Get the URL for TP's website";
        },
        aliases: () => ["gif"],
    },
    bitty: {
        exe: (c) => {
            server.say(
                apiData.Bot.CHANNEL,
                `Go check out Lil_Bitty_Diver! She's my lovely cousin --> https://twitch.tv/lil_bitty_diver`
            );
            return;
        },
        manual: () => {
            return "Find out about my cousin, who is way cooler than me. Syntax: !bitty";
        },
        aliases: () => [],
    },
    welcome: {
        exe: (c) => {
            server.say(
                apiData.Bot.CHANNEL,
                "WELCOME TO THE TRASH HEAP: https://clips.twitch.tv/SuspiciousHungryAnteaterWholeWheat-GmC-jLVZaVJzZwJU"
            );
            return;
        },
        manual: () => {
            return "See the Official Welcome Clip for the Trash Heap! Syntax: !welcome";
        },
        aliases: () => [],
    },
    nerd: {
        exe: (c) => {
            server.say(
                apiData.Bot.CHANNEL,
                "TP is such a nerd, that she's taken notes on coding, cybersecurity, computers, and hacking and made them available for others on GitHub --> https://github.com/trshpuppy/obsidian-notes"
            );
            return;
        },
        manual: () => {
            return "See the Official Welcome Clip for the Trash Heap! Syntax: !welcome";
        },
        aliases: () => ["obsidian", "notes"],
    },
    jits: {
        exe: (c) => {
            server.say(
                apiData.Bot.CHANNEL,
                "Maybe you noticed TP's sick AF black eye? Here's the story: https://x.com/trshpuppy/status/1725661274669764913?s=20"
            );
        },
        man: () => {
            return "Find out about the shiner. Syntax: !jits";
        },
        aliases: () => ["bjj", "blackeye", "shiner", "eye"],
    },
    discord: {
        exe: (c) => {
            server.say(
                apiData.Bot.CHANNEL,
                "Join TP in the Claw Team Discord! --> https://discord.gg/theclaw"
            );
        },
        manual: () => {
            return "Get the link to the Claw Team Discord. Syntax: !discord";
        },
        aliases: () => [],
    },
    socials: {
        exe: (c) => {
            server.say(
                apiData.Bot.CHANNEL,
                "Twitter -> twitter.com/trshpuppyzYouTube -> youtube.com/@trshpuppy GitHub -> github.com/trshpuppy WebSite -> TrshPuppy.github.io"
            );
        },
        manual: () => {
            return "Get a list of TP's social links. Syntax: !socials";
        },
        aliases: () => ["social", "twitter", "github", "website"],
    },
    secstreams: {
        exe: (c) => {
            server.say(
                apiData.Bot.CHANNEL,
                "Checkout other infosec Twitch streamers!! --> https://infosecstreams.com/"
            );
        },
        manual: () => {
            return "Want to know who else streams infosec on Twitch? Syntax: !seecstreams";
        },
        aliases: () => ["sec", "streams", "livenow", "wheremyhackersat"],
    },
    workindog: {
        exe: (c) => {
            if (
                c.tags["display-name"].toLowerCase() ===
                apiData.Bot.STREAMER_NICK.toLowerCase()
            ) {
                server.say(
                    apiData.Bot.CHANNEL,
                    "BORK BORK BORK! --> https://www.youtube.com/watch?v=R8f9l9uIKok"
                );
            } else {
                server.say(
                    apiData.Bot.CHANNEL,
                    "Sorry, you don't have the authori-tah :("
                );
            }
            return;
        },
        manual: () => {
            return "Find out what a working dog means. Syntax: !workindog";
        },
        aliases: () => ["cutedog"],
    },
    pnpt: {
        exe: (c) => {
            server.say(
                apiData.Bot.CHANNEL,
                `@${c.tags["display-name"]}, TP is currently studying for the PNPT cert from TCM Security --> https://certifications.tcm-sec.com/wp-content/uploads/2022/01/TCMS-PNPT-Training-Overview.pdf`
            );
            return;
        },
        manual: () => {
            return "Find out about the PNPT certification which TP is studying for. Syntax: !pnpt";
        },
        aliases: () => ["tcm", "pnpt", "cert", "certification"],
    },
    affiliate: {
        exe: (c) => {
            server.say(
                apiData.Bot.CHANNEL,
                `Interested in the PNPT & other cybersecurity certifications from TCM Security? Use my affiliate link when you decide to purchase TCM's course work! --> https://academy.tcm-sec.com/courses/?affcode=770707_rpgcmrcd Thank you so much for the support! <3`
            );
            return;
        },
        manual: () => {
            return "Get my affiliate link for TCM Security. Syntax: !affiliate";
        },
        aliases: () => ["support"],
    },
    stderr: {
        exe: (c) => {
            server.say(
                apiData.Bot.CHANNEL,
                `Today's challenge from @stderr: 󵔫󳅆󳑁󳤠󶥳󲃰􁾒`
            );
            return;
        },
        manual: () => {
            return "Get the current challenge from stderr. Syntax: !stderr";
        },
        aliases: () => ["challenge"],
    },
};
export default commands;

function handleAddPrompt(context) {
    const promptText = context.args;

    // Make sure there is a prompt after the command:
    if (promptText.length <= 0) {
        server.say(
            apiData.Bot.CHANNEL,
            `@${context.tags["display-name"]} RTFM!`
        );
        return false;
    }
    console.log("promt text:   " + promptText);
    // Make sure the prompt text is clean (no punctuation/ numbers);
    const filteredPromptArr = [];
    for (let word of promptText) {
        const filtered = word.split("").filter((c) => {
            return (
                (c.charCodeAt(0) >= 65 && c.charCodeAt(0) <= 90) ||
                (c.charCodeAt(0) >= 97 && c.charCodeAt(0) <= 122)
            );
        });

        if (filtered.length > 0) {
            filteredPromptArr.push(filtered.join(""));
        } else {
            server.say(
                apiData.Bot.CHANNEL,
                `Sorry, @${context.tags["display-name"]}, your prompt is invalid :(`
            );
            return false;
        }
    }

    const sparklyCleanPromptText = filteredPromptArr.join(" ");
    console.log("sparkly clean =   " + sparklyCleanPromptText);
    // Create promptObj to be added to DB:
    const promptObj = new Object();

    promptObj.time = new Date() * 1; // in milliseconds
    promptObj.prompt = sparklyCleanPromptText;
    promptObj.author = context.tags["display-name"];
    promptObj.completed = 0;

    // Send promptObj to be added to DB:
    console.log("prompt obj before send:   " + promptObj);
    const wasThePromptAddSuccessful = addPrompt(promptObj);
    return wasThePromptAddSuccessful;
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
