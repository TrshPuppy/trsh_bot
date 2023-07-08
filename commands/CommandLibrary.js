export default class CommandLibrary {
  // static allCommands = [];
  static allBotCommands = [];
  static allChannelCommands = [];
  static allQuoteCommands = [];
  static allTimerCommands = [];

  static getAllCommandsOfType(type) {
    switch (type) {
      case "bot":
        return CommandLibrary.allBotCommands;
      case "channel":
        return CommandLibrary.allChannelCommands;
      case "quote":
        return CommandLibrary.allQuoteCommands;
      case "timer":
        return CommandLibrary.allTimerCommands;
      case "all":
        const allCommandsReturnArr = [];
        allCommandsReturnArr.push(CommandLibrary.getAllCommandsOfType("bot"));
        allCommandsReturnArr.push(
          CommandLibrary.getAllCommandsOfType("channel")
        );
        allCommandsReturnArr.push(CommandLibrary.getAllCommandsOfType("quote"));
        allCommandsReturnArr.push(CommandLibrary.getAllCommandsOfType("timer"));

        allCommandsReturnArr.flatMap((a) => (a = a));
        return allCommandsReturnArr;
      default:
        console.log(`No commands of type: ${type}.`);
    }
  }

  static addCommand(command, type) {
    switch (type) {
      case "bot":
        CommandLibrary.allBotCommands.push(command);
        break;
      case "channel":
        CommandLibrary.allChannelCommands.push(command);
        break;
      case "quote":
        CommandLibrary.allQuoteCommands.push(command);
        break;
      case "timer":
        CommandLibrary.allTimerCommands.push(command);
        break;
      default:
        console.log(
          `The command type: ${type} does not exist. Command not added.`
        );
    }
  }

  static deleteCommand(command, type) {}
}

/*
Notes:
    Add library class for each type of command? (each command type has a librarian
    keeping track of them == OOP?)

    Each command type class already extends channel command class, so why not just
    use that class to make all commands?

    Difference by command class type:
        Bot command: parent class
            - has constructor
                name, args, callback, authority
            - has alias
            - has addArg
            - has tryHandleMsg
            - has addManual
            - has getManual
            - has addAlias

            "handleBotSummons" called w/ @ sign in message
            (been implicitly treating these as bot commands
                vs channel commands but thats the only difference
                in how they're made...)
        
        Channel Command: child
            - try handle message is different:
                checks for authority and handles alias 
                (probably could be moved to bot command class)

                JK Try handle message in botCommand checks arg1 in message
                (messsage is @Trsh_bot <command>) <-- can be taken care of
                before making the command (i.e. shift off arg0 of the msg
                    if arg0 ==== '@Trsh_bot')

            "handleChannelCommand" ('if this shit function') triggered
            by "!" (bot prefix) at beginning of message. 

            Each channel command has fully fleshed out functions to handle
            especially !prompt and the quote commands

        Quote Command: grandchild:
                - extends channel command but actually isn't any different
                
            again, probably conflating goals of the commands with 
            structure of commands
        
        Timer Command:
            not really a thing yet
            - would need to handle an interval which isn't in the original
                BotCommand constructor

    
    New Command structure?
        - basic bot commands (ships w/ every trsh_bot)
        - unique commands (not basic bot required commands)
        - constructor can handle prefix?
        - constructor can handle interval?
                - or callback is just called in an interval?
                - but this should probably be set/ changeable
                    (ie this command fires q 5 mins. this on q 10)
        
        * also: what about count commands which keep track of a count?
            i.e. this command has been used 69 times!

        - need channel commands for adding commands from chat
                - !add command
                - !delete command
            - limited by authority
            - needs to take parameters like name, callback?, message, interval, etc.
    
    class Command{
        constructor(name, args, cb, authority){

        }
        this.aliases = []

        tryHandleMessage(){
            - check authority
            - check arg0 against name
                - if name fails, check aliases
            - call callback (on command instance)
        }

        *AddArg(){} --> doesn't really do anythign rn

        addManual(manual string, alt manual string){
            manual and
            alt manual
        }

        getMAnual(){
            builds manual:
                if this.altmanual exists, returns that
            also returns aliases
        }

        addAlias(){
            this needs to be cleaned, doesn't
            sanitize input!
            (okay for now unless we make a command
                to add an alias from the twitch chat
                then its dangerous security risk)
        }
    }

    What command types deviate from the above class?
        - commands which need more info in order to work:
            - timer comamnds (cb fires at a set interval)
                - needs an interval
            - count commands which keep track of a count
                - needs a starting count
                - needs to store count data in persistent state
                    (JSON?)

            *unsure:
            - commands which allow adding/ deleting/ changing commands
                from twitch chat
                - authority is important
                - command to be added is gonna need:
                    - type of command to make
                    - command arguments
                    - command callback
                - command to delete is gonna need:
                    - the command name toe delete
                    - authority

    TimerCommand Class:
        This class isn't really a command class, it just posts a set message
        to chat q <interval> time.

    class TimerCommand/ TimedMessage {
        constructor(interval, message){
            this.interval = interval
            this.message = message * <----------- make sure we sanitize if this becomes a
                                                    class instance we can create from the 
                                                    Twitch chat
        }

        * How do we call this?
            - trsh_bot has to call it q interval
            - could use chat messages as trigger?
                -NO: the interval is the trigger

        postMessage(){
            server.say(message)
        }

        fireMessage = setInterval(postMessage, this.interval)
    }
                
    class CountCommand (does not extend Command class){
        constructor(name, message){
            this.name = name
            this.message = message
        }

        this.count = commandData.json.this.name.count
        
        getCount(){
            return this.count
        }

        incrementCount(){
            whenever this command is called
            increment the count in the JSON
        }

        getMessage(){
            * not sure how to handle this, but maybe the message can have
                a marker in it like "count" or "%c" we can replace with 
                this.count so the message can change for each count Command

            splitMsg = this.message.split(" ");
            splitMsg.map((w) =>{
                if(w == "%c"){
                    w = this.getCount
                    return w
                }
            })

            return splitMsg.join(" ")
            }
        }
    }

    The callback for this class type needs to call getMessage, 
    and then post the message in the chat

        cb = {
            server.say(countCommand.getMessage)
            countCommand.incrementCount
        }
*/
