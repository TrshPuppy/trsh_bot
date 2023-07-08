// Imports:
import checkOAuthStatus from "./api.js";
import checkForFileSystem from "./fileCheck.js";
import createServer from "./server.js";

/*
 * Before running trsh_bot, we need to make sure our file system and Twitch
 * OAuth are in place.
 *
 * checkForFileSystem():
 *                        There are a number of files that trshbot needs in order
 *                        to run and work. This function will check for these files.
 *                        It should also create the files if they don't exist yet
 *                        (like in a new environment when trsh_bot is ran for the
 *                        first time) using Node fs.
 * checkForOAuthStatus():
 *                        This function is useful not only for the first time trsh_bot
 *                        runs, but also for every time. This is because the OAuth token
 *                        (stored in data/api.json) will expire every 4-5 hours. If the
 *                        token is expired, this function & the fileCheck.js module will
 *                        refresh it using the REFRESH_TOKEN (in data/api.json).
 */

try {
  // Check file system first, if data/api.json doesn't exist, trying to check the OAuth status is pointless
  await checkForFileSystem();
  await checkOAuthStatus();
} catch (err) {
  console.log("Unknown error: " + err);
  // Program should terminate with CERTAIN errors from these functions
  throw err;
}

// Create the TMI.js server with an event listener for messages in chat
createServer();

// While trsh_bot is running, make sure the OAuth token hasn't expired & refresh it if it has
const OAuthInterval = setInterval(checkOAuthStatus, 3600000);
