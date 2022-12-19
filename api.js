// This module is for handling Twitch API/ OAuth/ HTTP POST requests:

//Module Gloabals:
let timeSinceLastRefresh;
let lastRefreshTime;

export default function checkOAuthStatus() {
  if (!isOAuthValid()) {
    // If Oauth is due to expire OR OAuth returns a 404, then:
    refreshOAuth();
  }
}

function isOAuthValid() {
  // Check if OAuth is due to expire:
  const currentTime = new Date();
  const totalTimeWindow = lastRefreshTime + process.env.OA_EXPIRE;
  const fiveMinsBeforeExp = totalTimeWindow - 300;

  if (currentTime >= fiveMinsBeforeExp) {
    return false;
  }

  // Make Call to API and check for 404:
  // if(call to API === 404){
  //return false;
  //}

  return true;
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
    .then(updateDotenv);

  function updateDotenv(response) {
    process.env.OA_TOKEN = response.access_token;
    process.env.OA_EXPIRE = response.expires_in;
  }

  lastRefreshTime = new Date() / 1000;
}
