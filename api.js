// import * as dotenv from "dotenv";
import fetch from "node-fetch";
import apiData from "./api.json" assert { type: "json" };
// import testData from "./test.json" assert { type: "json" };
import * as fs from "fs";

//Module Gloabals:
// let lastRefreshTime = new Date() / 1000 - 14106;

export default function checkOAuthStatus() {
  if (isOAuthExpired()) {
    // If Oauth is due to expire OR OAuth returns a 404, then:
    refreshOAuth();
    console.log("line 16 is where im at yo");
  }
  return;
}

function isOAuthExpired() {
  // Check if OAuth is due to expire:
  const currentTime = new Date() / 1000; // in seconds
  // const totalTimeWindow = lastRefreshTime / 1000 + apiData.OA_EXPIRE;
  // const fiveMinsBeforeExp = totalTimeWindow - 300;
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
  const TWITCH_REFRESH_URL = `https://id.twitch.tv/oauth2/token`;

  fetch(TWITCH_REFRESH_URL, {
    method: "POST",
    body: `client_id=${apiData.CLIENT_ID}&client_secret=${apiData.CLIENT_SECRET}&grant_type=refresh_token&refresh_token=${apiData.REFRESH_TOKEN}`,
    headers: {
      "Content-Type": `application/x-www-form-urlencoded`,
    },
  })
    .then(function (response) {
      return response.json();
    })
    .then(checkRefreshResponse)
    .catch((error) => console.log(`error during fetch = ${error}`));

  function checkRefreshResponse(response) {
    if (response.message === `Invalid refresh token`) {
      getNewRefreshToken();
    } else {
      updateJSON(response);
    }
  }
  return;
}

function updateJSON(response) {
  // Update values in JSON object w/ values from API response:
  apiData.OA_TOKEN = response.access_token;
  apiData.OA_EXPIRE = response.expires_in;
  apiData.LAST_REFRESH = new Date() / 1000; // in seconds

  const JSONObj = JSON.stringify(apiData);
  const targetFile = "./api.json";

  fs.writeFile(targetFile, JSONObj, "utf-8", (error) => {
    if (error) {
      console.log("Error, failed to write new data to api.json.");
      return;
    }
    console.log("Successfully wrote new data to api.json file!");
  });

  return;
}

function getNewRefreshToken() {
  console.log("Need new Refresh Token :(");
}
