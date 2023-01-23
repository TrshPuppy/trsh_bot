import * as fs from "fs";
import { open, close } from "node:fs";

export default function checkForFileSystem() {
  if (checkForPromptQueue() && checkForAPI() && checkForPackageLock()) {
    console.log("All necessary files are present.");
    return true;
  }
  console.log("All necessary files are NOT PRESENT!");
  return false;
}

// Check for promptQueue.json, if it doesn't exist, make it.
function checkForPromptQueue() {
  fs.open("promptQueue.json", "wx", (err, fd) => {
    if (err) {
      if (err.code === "EEXIST") {
        console.error("PromptQueue.json already exists!");
        return;
      }
      throw err;
    }
  });
  console.log("PromptQueue.json file created. Currently empty.");
  return true;
}

function checkForAPI() {
  return true;
}

function checkForPackageLock() {
  return true;
}
