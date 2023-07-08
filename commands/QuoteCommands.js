import ChannelCommand from "./ChannelCommands.js";
import quotesDBData from "../data/quotesDB.json" assert { type: "json" };

const quoteCommands = [];

export default class QuoteCommand extends ChannelCommand {
  tryHandleMessage(channel, context, [arg0, arg1, arg2, ...rest]) {
    if (this.name === arg0) {
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
}

const newQuoteSuccess = () =>
  server.say(
    apiData.Bot.CHANNEL,
    "Your quote was added to the database! Congrats on being so ICONIC!"
  );

const getQuoteCommand = new QuoteCommand("!quote", [], handleQuoteCommand);
getQuoteCommand.addManual("!quote <author> (author is optional)");

const addQuoteCommand = new QuoteCommand("!addquote", [], handleAddQuote);
addQuoteCommand.addManual("!addquote @<author> <quote>");

quoteCommands.push(getQuoteCommand, addQuoteCommand);

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
