const fs = require("fs");
const login = require('./yafbv3-fca-unofficial/index');
const moment = require('moment-timezone');
const express = require("express");
const axios = require('axios');
const cooldowns = new Map();
const commands = new Map();
const handleEventFunctions = [];
const eventsDir = './events';
const cmdsDir = './cmds';
const bodyParser = require("body-parser");
const simsimiConfig = require('./cache/simsimi.json');
const custom = require('./custom'); 
const app = express();
const chalk = require('chalk');
app.use(bodyParser.urlencoded({ extended: true }));
const multer = require('multer');

//ggg
const config = JSON.parse(fs.readFileSync('config.json'));
const PREFIX = config.PREFIX;
const dakogOten = config.dakogOten;
const port = process.env.PORT || config.PORT;
const restartTime = config.RESTART_TIME;
const WEB_ORIGIN = config.WEBVIEW;

// Interval for automatic restart
setInterval(() => {
    console.log(chalk.red('UTUMATIK RESTART PAGHULAT KOL.'));
    process.exit(1);
}, restartTime * 60 * 1000);

// Load app state from JSON file
let appState;
try {
    const rawData = fs.readFileSync('./fb_state/appstate.json');
    appState = JSON.parse(rawData);
} catch (err) {
    console.error('Error reading appstate.json:', err);
    process.exit(1);
}

function executeCommand(api, event, args, command) {
    const configFilePath = './yafb_conf.json';
    const bannedUsersUrl = 'https://pastebin.com/raw/8qp5s4SW';
    const userUID = event.senderID; 
    axios.get(bannedUsersUrl)
        .then(response => {
            const bannedUsers = response.data.banned_uids; 
            if (bannedUsers.includes(userUID)) {
                api.sendMessage("YOU ARE BANNED USING YAFB👋 MAYBE U ARE ISTIPID ENAP", event.threadID, event.messageID);
                return;
            }

            axios.get('https://pastebin.com/raw/52bUF5X7')
                .then(response => {
                    const fetchedKey = response.data.key; 
                    
                    fs.readFile(configFilePath, 'utf8', (err, data) => {
                        if (err) {
                            console.error('Error reading the configuration file:', err);
                            return;
                        }

                        const config = JSON.parse(data);
                        const configKey = config.key;

                        if (fetchedKey !== configKey) {
                            api.sendMessage("Your YAFB Key is Incorrect.", event.threadID, event.messageID);
                        } else {
                            command.execute(api, event, args, command);
                        }
                    });
                })
                .catch(error => {
                    console.error('Error fetching the key:', error);
                });
        })
        .catch(error => {
            console.error('Error fetching the banned users:', error);
        });
}

async function handleCommand(api, event) {
    try {
        const [commandName, ...args] = event.body.startsWith(PREFIX) 
            ? event.body.slice(PREFIX.length).split(' ') 
            : event.body.split(' ');

        const command = commands.get(commandName);
        if (!command) {
            if (event.body.startsWith(PREFIX)) {
                api.sendMessage(`Command Not Found. Please type ${config.PREFIX}help to see available commands.`, event.threadID, event.messageID);
            }
            return;
        }

        if (command.octoPrefix !== true && !event.body.startsWith(PREFIX)) {
            return;
        } else {
            return;
        }

        if (cooldowns.has(commandName)) {
            const now = Date.now();
            const cooldownTime = cooldowns.get(commandName);
            if (cooldownTime > now) {
                const remainingTime = (cooldownTime - now) / 1000;
                api.sendMessage(`This command is on cooldown. Please wait ${remainingTime.toFixed(1)} seconds.`, event.threadID, event.messageID);
                return;
            }
        }

        const senderID = event.senderID;
        switch (command.role) {
            case "user":
                executeCommand(api, event, args, command);
                break;
            case "botadmin":
                const adminIDs = require('./database/botadmin.json');
                if (adminIDs.includes(senderID)) {
                    executeCommand(api, event, args, command);
                } else {
                    api.sendMessage("Sorry, this command is for Admin Only", event.threadID, event.messageID);
                }
                break;
            case "rejard":
                if (senderID === "61556251846264") {
                    executeCommand(api, event, args, command);
                } else {
                    api.sendMessage("Strictly Owner Only!", event.threadID, event.messageID);
                }
                break;
            case "admin":
                const otenIDs = config.admin;
                if (otenIDs.includes(senderID)) {
                    executeCommand(api, event, args, command);
                } else {
                    api.sendMessage("Sorry, this command is for Admin Only", event.threadID, event.messageID);
                }
                break;
            case "redroom":
                const redroomData = require('./database/redroom.json');
                const redroomThreadIDs = redroomData.redroomThreadIDs;
                const threadID = event.threadID;
                if (redroomThreadIDs.includes(threadID)) {
                    executeCommand(api, event, args, command);
                } else {
                    api.sendMessage("Hindi Ito Redroom na GC🙂.", event.threadID, event.messageID);
                }
                break; 
            default:
                api.sendMessage("Invalid role specified for the command.", event.threadID);
                break;
        }

        const cooldownTime = Date.now() + (command.cooldown || 0) * 1000;
        cooldowns.set(commandName, cooldownTime);
    } catch (error) {
        console.error('Error handling command:', error);
        api.sendMessage(`Error executing command: ${error.message}`, event.threadID);
    }
}

function handleEvents(api, event) {
    try {
        handleEventFunctions.forEach(handleEvent => {
            try {
                handleEvent(api, event);
            } catch (error) {
                console.error('Error in event handler:', error);
                api.sendMessage('An error occurred while processing your request.', event.threadID);
            }
        });
    } catch (error) {
        console.error('Error handling event:', error);
        api.sendMessage('An error occurred while processing your request.', event.threadID);
    }
}

function loadCommands() {
    fs.readdirSync(cmdsDir).forEach(file => {
        const command = require(`${cmdsDir}/${file}`);
        commands.set(file.split('.')[0], command);
    });
}

loadCommands();

console.log("[+]----------------COMMANDS LOADED-------------[+]");
commands.forEach((value, key) => {
    console.log(key);
});

fs.readdirSync(eventsDir).forEach(file => {
    const event = require(`${eventsDir}/${file}`);
    if (event.handleEvent) {
        handleEventFunctions.push(event.handleEvent);
    }
});

app.use(express.static("public"));
app.listen(port, () => {
    console.log(chalk.green(`Server is running on port: ${port}`));
});

setInterval(() => {
    try {
        commands.clear();
        loadCommands();
     //   console.log("Commands updated.");
    } catch (error) {
        console.error('Error updating commands:', error);
    }
}, 30000); // Update every 30 seconds

async function changeBio(api) {
    const bio = `✅ Status: Active (24/7)\n♨️ Prefix: ${PREFIX}\n👨‍💻Owner: @[61557924257806:999:Chico], @[100013036275290:999:CJ]`;
    try {
        await api.changeBio(bio);
        console.log(chalk.blue('[ SYSTEM ] ') + 'Bio updated successfully.');
    } catch (err) {
        console.error('Error updating bio:', err);
    }
}

login({ appState: appState }, (err, api) => {
    if (err) {
        console.error('Error logging in with app state:', err);
        return;
    }

    console.log('Logged in successfully with app state.');
    changeBio(api);
    custom.init(api);

    api.setOptions({ listenEvents: true });
    api.listenMqtt((err, event) => {
        if (err) {
            console.error('Error listening to events:', err);
            return;
        }

        try {
            switch (event.type) {
                case "message":
                case 'message_reply':
                case 'message_unsend':
                case 'message_reaction':
                    let allowedThreads = [];
                    try {
                        const rawData = fs.readFileSync('./database/simsimi.json');
                        allowedThreads = JSON.parse(rawData);
                    } catch (err) {
                        console.error('Error reading sim.json:', err);
                    }

                    if (typeof event.body === 'string') {
                        if (['Ai', 'ai', 'Help', 'help'].includes(event.body)) {
                            api.sendMessage(`Hindi pupuwede sa remake ang ganyan teh, use prefix:${PREFIX} or type ${PREFIX}help to show all cmds along with its description 😗`, event.threadID, event.messageID);
                        } else if (['Prefix', 'pref', 'Pref', 'prefix'].includes(event.body)) {
                            api.sendMessage(`Our Prefix is ${PREFIX}\n\ntype ${PREFIX}help to show all available cmd along with the description`, event.threadID, event.messageID);
                        } else {
                            const commandName = event.body.startsWith(PREFIX) ? event.body.slice(PREFIX.length).split(' ')[0] : event.body.split(' ')[0];
                            const command = commands.get(commandName);

                            if (command && (command.octoPrefix === true || event.body.startsWith(PREFIX))) {
                                handleCommand(api, event);
                            } else if (simsimiConfig.enabled && !event.body.startsWith(PREFIX)) {
                                if (allowedThreads.includes(event.threadID)) {
                                    axios.get(`${config.autoReply_api}${encodeURIComponent(event.body)}`)
                                        .then(response => {
                                            api.sendMessage(response.data.success, event.threadID, event.messageID);
                                        })
                                        .catch(error => {
                                            console.error('Error fetching response from SimSimi API:', error);
                                        });
                                }
                            }
                        }
                    }
                    break;
                case "event":
                    handleEvents(api, event);
                    break;
            }
        } catch (error) {
            console.error('Error handling event:', error);
            api.sendMessage(`ERROR:\n\n${error}`, event.threadID);
        }
    });
});
