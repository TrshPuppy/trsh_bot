// Imports createRequire from module using Node, and create the require method:
import { createRequire } from "module";
const require = createRequire(import.meta.url);

// Require sqlite3 and create database:
const sqlite3 = require("sqlite3").verbose();
const prompts = new sqlite3.Database("./data/prompts.sqlite");

export default function addPrompt(promptObj) {
    console.log("prompt obj in addprompt:   " + promptObj);
    prompts.serialize(() => {
        const stmnt = prompts.prepare(
            "INSERT INTO prompts (time, prompt, author, completed) VALUES (?,?,?,?)"
        );

        // Insert new prompt into database:
        stmnt.run(promptObj.time, promptObj.prompt, promptObj.author, 0);
    });
    return true;
}

// Return next prompt in queue to calling function from DB:
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

// Once prompt has been used, mark as complete in DB:
export async function markPromptIncomplete(rowID) {
    return await new Promise((resolve) => {
        const st = prompts.prepare(
            `UPDATE prompts SET completed = 1 WHERE rowid = ?`
        );

        resolve(st.run(rowID));
    });
}

// Exported to filecheck.js to create database if it doesn't exist:
export async function createPromptDB() {
    return await prompts.serialize(() => {
        prompts.run(
            "CREATE TABLE IF NOT EXISTS prompts (time INT, prompt TEXT, author TEXT, completed INT)"
        );
    });
}
