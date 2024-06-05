const axios = require('axios');

module.exports = {
    description: "Generate a raw link that contains the given input context.",
    role: "user", // or admin botadmin
    cooldown: 6,
    credits: "CJ & Chico",
    execute: async function(api, event, args, commands) {
        const text = args.join(" ");
        if (!text) {
            return api.sendMessage("❓| Please provide text to generate the raw link.\n\nUsage: pasteraw {your text here}", event.threadID, event.messageID);
        }

        const url = `https://apis-samir.onrender.com/paste?text=${encodeURIComponent(text)}`;

        api.sendMessage("🔄| Creating...", event.threadID, event.messageID, async (err, info) => {
            if (err) return console.error(err);
            const loadingMessageID = info.messageID;

            try {
                const response = await axios.get(url);
                const result = response.data;

                if (!result.success) {
                    throw new Error("Failed to generate the link.");
                }

                const successMessage = `✅ | Generated Link Success!\nUrl: ${result.url}`;
                api.sendMessage(successMessage, event.threadID, event.messageID);
            } catch (error) {
                console.error(error);
                api.sendMessage(`❌| Error: ${error.message}`, event.threadID, event.messageID);
            }
        });
    }
};
