// This module checks for required files and create them if they aren't present.
import * as fs from "fs";
import { createPromptDB } from "./testRequire.js";

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
        console.error("Api.json already exists!");
        return;
      }
      throw err;
    }
  });
  console.log(
    "api.json file created, but needs to be filled with credentials!"
  );
  return true;
}

// Check for promptQueue.json, if it doesn't exist, make it.
function checkForPromptQueue() {
  // createPromptDB();
  return true;
  // fs.open("promptQueue.json", "wx", (err, fd) => {
  //   if (err) {
  //     if (err.code === "EEXIST") {
  //       console.error("PromptQueue.json already exists!");
  //       return;
  //     }
  //     throw err;
  //   }
  // });
  // console.log("PromptQueue.json file created. Currently empty.");
  // return true;
}

// Check for quotesDB.json, if it doesn't exist, make it.
function chcekForQuotesDb() {
  fs.open("quotesDB.json", "wx", (err, fd) => {
    if (err) {
      if (err.code === "EEXIST") {
        console.error("QuotesDB.json already exists!");
        return;
      }
      throw err;
    }
  });
  console.log("QuotesDB.json file created but is empty!");
  return true;
}
