const axios = require('axios');
const fs = require('fs');
const path = require('path');

module.exports = {
    description: "Restart the server",
    role: "admin",
    cooldown: 5,
    async execute(api, event, args, commands) {
        api.sendMessage("Restarting Repo...", event.threadID, event.messageID);
        setTimeout(()=>{
            process.exit(1);
        }, 5000);
};
