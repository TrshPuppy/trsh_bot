import sqlite3 from "sqlite3";
import { open } from "sqlite";

export default async function addPrompt(db, promptObj) {
  console.log("prompt obj in addprompt:   " + promptObj);
  const stmnt = db.prepare(
    "INSERT INTO prompts (time, prompt, author, completed) VALUES (?,?,?,?)",
  );

  // Insert new prompt into database:
  await stmnt.run(promptObj.time, promptObj.prompt, promptObj.author, 0);
  return true;
}

// Return next prompt in queue to calling function from DB:
export async function getPromptFromDB(db) {
  const queryString =
    "SELECT rowid, prompt, author FROM prompts WHERE completed = 0 ORDER BY time ASC LIMIT 1";

  return db.get(queryString);
}

// Once prompt has been used, mark as complete in DB:
export async function markPromptIncomplete(db, rowID) {
  const st = db.prepare(`UPDATE prompts SET completed = 1 WHERE rowid = ?`);

  return st.run(rowID);
}

// Exported to filecheck.js to create database if it doesn't exist:
export async function createPromptDB() {
  return db.run(
    "CREATE TABLE IF NOT EXISTS prompts (time INT, prompt TEXT, author TEXT, completed INT)",
  );
}
