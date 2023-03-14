// Imports:
import checkOAuthStatus from "./api.js";
import checkForFileSystem from "./fileCheck.js";
import createServer from "./server.js";

try {
  await checkForFileSystem();
  console.log("Hello?");
  await checkOAuthStatus();
} catch (err) {
  console.log("Unknown error: " + err);
  throw err;
}

createServer();

// make async

//Setting up TMI to listen to channel chat
