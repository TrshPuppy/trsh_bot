// This module handles automating the OAuth2 token and refresh token
console.log("hi");
import fetch from "node-fetch";
import apiData from "./data/api.json" assert { type: "json" };
import * as fs from "fs/promises";

export default async function checkOAuthStatus() {
  if (isOAuthExpired()) {
    // If Oauth is due to expire OR OAuth returns a 404, then:
    const response = await refreshOAuth();

    const json = await response.json();

    await checkRefreshInJSON(json);
  }
}

function isOAuthExpired() {
  const currentTime = new Date() / 1000; // in seconds
  const lastRefreshTime = apiData.LAST_REFRESH;

  // Check to see if the currentTime is within 5 minutes of the expiration or over:
  if (currentTime - lastRefreshTime >= apiData.OA_EXPIRE - 300) {
    console.log("OAuth is expired");
    return true;
  }
  console.log("OAuth is not expired");
  return false;
}

function refreshOAuth() {
  // When OAuth is expired && this function called, build fetch URL:
  const TWITCH_REFRESH_URL = `https://id.twitch.tv/oauth2/token`;

  // Fetch new OAuth token:
  return fetch(TWITCH_REFRESH_URL, {
    method: "POST",
    body: `client_id=${apiData.CLIENT_ID}&client_secret=${apiData.CLIENT_SECRET}&grant_type=refresh_token&refresh_token=${apiData.REFRESH_TOKEN}`,
    headers: {
      "Content-Type": `application/x-www-form-urlencoded`,
    },
  });
  // .then(function (response) {
  //   return response.json();
  // })
  // .then(checkRefreshInJSON)
  // .catch((error) => console.log(`error during fetch = ${error}`));

  // Check response for failure OR update JSON:
}

async function checkRefreshInJSON(json) {
  if (json.message === `Invalid refresh token`) {
    getNewRefreshToken();
  } else {
    await updateJSON(json);
  }
}

async function updateJSON(response) {
  // Update values in JSON object w/ values from API response:
  apiData.OA_TOKEN = response.access_token;
  apiData.OA_EXPIRE = response.expires_in;
  apiData.LAST_REFRESH = new Date() / 1000; // in seconds

  const JSONObj = JSON.stringify(apiData);
  const targetFile = "./data/api.json";

  // Overwrite api.json w/ updated JSON Object:
  await fs.writeFile(targetFile, JSONObj, "utf-8");

  //(error) => {
  //     if (error) {
  //       console.log(
  //         "Error, failed to write new data to api.json. JSON not updated."
  //       );
  //       return;
  //     }
  //     console.log("Successfully wrote new data to api.json file!");
  //   });
}

function getNewRefreshToken() {
  console.log(
    "Need new Refresh Token :(. Not able to refresh token at this time."
  );
}

/*
f wherever you want to access the data you use `getApiData()`, and only in that function you use `require`, and only the first time that it gets called, then `require` will only be called later on in the program's execution, not when the files get loaded as an import


Another option is, create an api.js file. Requiring that file will return the object you store in module.exports inside of that file. Any file that requires api.js will get a reference to that same object. It doesn't matter if that object is empty at the beginning of the project. Later on, you can set values on that object (e.g. module.exports.token = blabla). And any file that required api.js will be able to access whatever data you store in that object.
*/
