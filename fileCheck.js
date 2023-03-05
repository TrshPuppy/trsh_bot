// This module checks for required files and create them if they aren't present.
import * as fs from "fs";
import { createPromptDB } from "./promptQueue.js";

export default function checkForFileSystem() {
  if (checkForPromptQueue() && checkForAPI() && chcekForQuotesDb()) {
    console.log("All necessary files are present.");
    return true;
  }
  console.log("The necessary files are NOT PRESENT!");
  return false;
}

// Check for api.json, if it doesn't exist, make it.
function checkForAPI() {
  fs.open("api.json", "wx", (err, fd) => {
    if (err) {
      if (err.code === "EEXIST") {
        return;
      } else {
        console.log(
          "api.json file created, but needs to be filled with credentials!"
        );
      }
      throw err;
    }
  });

  return true;
}

// Check for prompts DB; if it doesn't exist, make it.
function checkForPromptQueue() {
  createPromptDB();
  return true;
}

// Check for quotesDB.json, if it doesn't exist, make it.
function chcekForQuotesDb() {
  fs.open("./data/quotesDB.json", "wx", (err, fd) => {
    if (err) {
      if (err.code === "EEXIST") {
        return;
      } else {
        console.log("QuotesDB.json file created but is empty!");
      }
      throw err;
    }
  });

  return true;
}
