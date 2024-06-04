const axios = require("axios");

module.exports = {
    description: "TikTok Video Downloader",
    role: "user", // or admin botadmin
    cooldown: 4, // 4 seconds cooldown
    execute: async function(api, event, args, commands) {
        if (!args[0]) {
            return api.sendMessage("Please provide a TikTok link!", event.threadID, event.messageID);
        }
        const tiktokLink = args[0];
        const response = await axios.get(`https://eurix-api.replit.app/tikdl?link=${tiktokLink}`);
        if (response.data.code === "200") {
            const videoUrl = response.data.data.url;
            api.sendMessage(`Downloading video...`, event.threadID, event.messageID);
            setTimeout(() => {
                api.sendMessage(`Video downloaded: ${videoUrl}`, event.threadID, event.messageID);
            }, 4000);
        } else {
            api.sendMessage(`Error: ${response.data.msg}`, event.threadID, event.messageID);
        }
    }
};
