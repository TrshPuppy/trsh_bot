# Trsh_bot

## Trsh_bot is a Twitch chat bot made using JS, tmi.js, node, node fs, and pos.js
This is a personal project for my [Twitch channel](https://www.twitch.tv/trshpuppy) and is being created and maintained by me w/ help and input from interested community members.

### Lessons Learned:
Coding @trsh_bot has taught me:
- OAuth2 and API security
  - HTTP POST
  - maintaining & securing API tokens
  - Automating re-authentication
  - Developer API scope
- Working with JSON
  - Reading and writing to a JSON file
  - JSON.parse() 
  - JSON.stringify()
- Working with SQLite and Databases
- Creating a Docker image and container
- Sanitizing user input
- Secure production environment 
  - localhost
  - formatting evironment variables and use for open-source sharing
  - creating files on startup with node filesystem
...more to come

### Dependencies
This project is configured to use npm with the following installs:
```
tmi.js
```
```
pos.js
```
### Filesystem:
Upon startup the program will create the following EMPTY files w/i the same directory:
```
api.json : for holding secured credentials including API key/ client secret etc. (Please refer to "mockApi.json" as a reference for formatting environment variables).
```
```
promptQueue.json : for holding AI art prompts received from chat using the !prompt command
```
```
quoteDB.json : for holding a DB of quotes added by chat/ viewers whichin include author, date, etc.
```

  
