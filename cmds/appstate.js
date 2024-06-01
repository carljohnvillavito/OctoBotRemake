const axios = require('axios');
const fs = require('fs');
const path = require('path');

// Load the config file to get the prefix
const configPath = path.resolve(__dirname, '../config.json');
const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));

module.exports = {
    description: "Retrieve the app state for a Facebook account",
    role: "user",
    cooldown: 6,
    execute: async function(api, event, args, commands) {
        // Extract email and password from the arguments
        const [email, password] = args.join(" ").split("&").map(arg => arg.trim());

        if (!email || !password) {
            return api.sendMessage(`Usage: ${config.PREFIX}appstate {email} & {password}\n\nNOTE: Do not use in public chat like: Group chats for privacy.`, event.threadID, event.messageID);
        }

        try {
            const response = await axios.get(`https://deku-rest-api-3ijr.onrender.com/getcookie`, {
                params: {
                    email,
                    password
                }
            });

            if (response.data.status) {
                const appState = response.data.cookie;

                // Send the app state in the message
                api.sendMessage("Appstate Generated! Here's your Appstate...", event.threadID, event.messageID);
                setTimeout(()=>{
                    api.sendMessage(`${appState}`, event.threadID, event.messageID);
                }, 2000);
            } else {
                api.sendMessage("Failed to retrieve app state. Please check your credentials.", event.threadID, event.messageID);
            }
        } catch (error) {
            console.error("Error retrieving app state:", error);
            api.sendMessage("An error occurred while retrieving the app state.", event.threadID, event.messageID);
        }
    }
};
