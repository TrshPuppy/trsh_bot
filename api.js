import * as dotenv from "dotenv";

//Module Gloabals:
let lastRefreshTime;

dotenv.config();

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
  const totalTimeWindow = lastRefreshTime + process.env.OA_EXPIRE;
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
    body: `grant_type=refresh_token&refresh_token=${process.env.REFRESH_TOKEN}&client_id=${process.env.CLIENT_ID}&client_secret=${process.env.CLIENT_SECRET}`,
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
      updateDotenv(response);
    }
  }

  function updateDotenv(response) {
    process.env.OA_TOKEN = response.access_token;
    process.env.OA_EXPIRE = response.expires_in;

    // dotenv.config();
  }

  lastRefreshTime = new Date() / 1000;
  return;
}

function getNewRefreshToken() {
  console.log("Need new Refresh Token :(");
}
