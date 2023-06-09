// This module checks for required files and create them if they aren't present.
import * as fs from "fs/promises";
import { createPromptDB } from "./promptQueue.js";

export default async function checkForFileSystem() {
  try {
    await checkForAPI();
  } catch (err) {
    if (err.errno === -17) {
      console.log("API.json already exists.");
    } else {
      console.log("Unknown error opening or creating API.json. Err: " + err);
      // throw err;
    }
  }

  try {
    await checkForPromptQueue();
  } catch (err) {
    console.log("Unknown error creating promptDB. Err: " + err);
  }

  try {
    await checkForQuotesDB();
  } catch (err) {
    if (err.errno === -17) {
      console.log("quotesDB.json already exists!");
    } else {
      console.log(
        "Unknown error opening or creating quotesDB.json. Err: " + err
      );
      // throw err;
    }
  }
}

// Check for api.json, if it doesn't exist, make it.
async function checkForAPI() {
  await fs.open("./data/api.json", "wx");
}

// Check for prompts DB; if it doesn't exist, make it.
async function checkForPromptQueue() {
  await createPromptDB();
  return true;
}

// Check for quotesDB.json, if it doesn't exist, make it.
async function checkForQuotesDB() {
  await fs.open("./data/quotesDB.json", "wx");
}
