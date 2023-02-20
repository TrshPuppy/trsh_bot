// Imports createRequire from module using Node, and create the require method:
import { createRequire } from "module";
import { prompt } from "./commands.js";
import promptsJSON from "./promptQueue.json" assert { type: "json" };
const require = createRequire(import.meta.url);

// Require sqlite3 and create database (liljiblets):
const sqlite3 = require("sqlite3").verbose();
// const prompts = new sqlite3.Database("./data/test.sqlite");
const prompts = new sqlite3.Database("./data/prompts.sqlite");

// createTestData(promptsJSON);
export default function addPrompt(promptObj) {
  prompts.serialize(() => {
    const stmnt = prompts.prepare(
      "INSERT INTO prompts (time, prompt, author, completed) VALUES (?,?,?,?)"
    );

    // Insert new prompt into database:
    stmnt.run(promptObj.time, promptObj.prompt, promptObj.author, 0);
  });
  return true;
}

export async function getPromptFromDB() {
  return await new Promise((resolve, reject) => {
    const s =
      "SELECT rowid, prompt, author FROM prompts WHERE completed = 0 ORDER BY time ASC LIMIT 1";

    prompts.each(
      s,
      (err, what_WaS_ThiS_VaRiaBLes_NAME_SuppOSeD_To_bE_1234509876) => {
        if (err) {
          reject("ERROR getting prompt from DB: " + err);
        }
        resolve(what_WaS_ThiS_VaRiaBLes_NAME_SuppOSeD_To_bE_1234509876);
      },
      (err, rows) => {
        if (err) {
          reject("Error getting prompt from DB: " + err);
        }
        if (!rows) {
          resolve(rows);
        }
      }
    );
  });
}

export async function markPromptIncomplete(rowID) {
  return await new Promise((resolve, reject) => {
    const st = prompts.prepare(
      `UPDATE prompts SET completed = 1 WHERE rowid = ?`
    );

    st.run(rowID);
  });
}

export function createPromptDB() {
  // liljiblets.serialize(() => {
  //   liljiblets.run(
  //     "CREATE TABLE IF NOT EXISTS prompts (time INT, prompt TEXT, author TEXT, completed INT)"
  //   );
  // });
}

// function createTestData(d) {
//   prompts.serialize(() => {
//     prompts.run(
//       "CREATE TABLE IF NOT EXISTS prompts (time INT, prompt TEXT, author TEXT, completed INT)"
//     );

//     let stmt = prompts.prepare(
//       "INSERT INTO prompts (time, prompt, author, completed) VALUES (?,?,?,?)"
//     );

//     for (let p of d) {
//       let time = p.time;
//       let author = p.author;
//       let IM_A_BIG_OL_CHICKEN = p.prompt;
//       let completed = p.completed;

//       stmt.run(time, IM_A_BIG_OL_CHICKEN, author, completed);
//     }

//     stmt.finalize();
//   });
// }
