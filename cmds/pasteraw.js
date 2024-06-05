const axios = require('axios');

module.exports = {
    description: "Generate a raw link that contains the user inputs.",
    role: "user", // or admin botadmin
    cooldown: 5,
    credits: "User",
    execute: async function(api, event, args, commands) {
        const text = args.join(" ");
        if (!text) {
            return api.sendMessage("❓| Please provide text to generate the raw link.", event.threadID, event.messageID);
        }

        const url = `https://apis-samir.onrender.com/paste?text=${encodeURIComponent(text)}`;

        api.sendMessage("🔄| Creating...", event.threadID, event.messageID, async (err, info) => {
            if (err) {
                console.error("Error sending loading message:", err);
                return;
            }

            const loadingMessageID = info.messageID;

            try {
                console.log("Requesting URL:", url);
                const response = await axios.get(url);
                const result = response.data;

                console.log("Response received:", result);

                if (!result.success) {
                    throw new Error("Failed to generate the link.");
                }

                const successMessage = `✅ | Generated Link Success!\nUrl: ${result.url}`;
                api.sendMessage(successMessage, event.threadID, event.messageID);
            } catch (error) {
                console.error("Error generating link:", error);
                api.sendMessage(`❌| Error: ${error.message}`, event.threadID, event.messageID);
            }
        });
    }
};
