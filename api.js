// import * as dotenv from "dotenv";
// import apiData from "./api.json" assert {type: 'json'};
import testData from "./test.json" assert { type: "json" };
import * as fs from "fs";

//Module Gloabals:
let lastRefreshTime;

// dotenv.config();

export default function checkOAuthStatus() {
  if (isOAuthExpired()) {
    // If Oauth is due to expire OR OAuth returns a 404, then:
    refreshOAuth();
  }
  return;
}

function isOAuthExpired() {
  // Check if OAuth is due to expire:
  const currentTime = new Date();
  const totalTimeWindow = lastRefreshTime + apiData.OA_EXPIRE;
  const fiveMinsBeforeExp = totalTimeWindow - 300;

  if (currentTime >= fiveMinsBeforeExp) {
    return true;
  }
  return false;
}

function refreshOAuth() {
  const TWITCH_REFRESH_URL = `https://id.twitch.tv/oauth2/token`;

  fetch(TWITCH_REFRESH_URL, {
    method: "POST",
    body: `grant_type=refresh_token&refresh_token=${apiData.REFRESH_TOKEN}&client_id=${apiData.CLIENT_ID}&client_secret=${apiData.CLIENT_SECRET}`,
    headers: {
      "Content-Type": `application/x-www-form-urlencoded`,
    },
  })
    .then(function (response) {
      return response.json();
    })
    .then(checkRefreshResponse);

  function checkRefreshResponse(response) {
    if (response.message === `Invalid refresh token`) {
      getNewRefreshToken();
    } else {
      updateJSON(response);
    }
  }

  function updateJSON(response) {
    // process.env.OA_TOKEN = response.access_token;
    // process.env.OA_EXPIRE = response.expires_in;

    const newRefresh = response.expires_in;
    const newToken = response.access_token;
    // const targetFile = "./api.json";
    const targetFile = JSON.stringify(testData.test);

    fs.open(targetFile);

    // dotenv.config();
  }

  lastRefreshTime = new Date() / 1000;
  return;
}

function getNewRefreshToken() {
  console.log("Need new Refresh Token :(");
}
