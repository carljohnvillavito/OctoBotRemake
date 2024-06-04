const axios = require('axios');

module.exports = {
    description: "Get Facebook state (fbstate) using email and password",
    role: "user", // or admin botadmin
    cooldown: 5,
    credits: "CJ & Chico",
    execute: async function(api, event, args, commands) {
        if (args.length < 2) {
            return api.sendMessage("❓| Please provide both email and password.", event.threadID, event.messageID);
        }

        const email = args[0];
        const password = args[1];
        const url = `https://deku-rest-api-3ijr.onrender.com/getcookie?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`;

        api.sendMessage("✅| Fetching fbstate...", event.threadID, event.messageID);

        try {
            const response = await axios.get(url);
            const cookies = response.data.cookie;

            if (!cookies || cookies.length === 0) {
                throw new Error("No cookies found in the response.");
            }

            let formattedCookies = cookies.map(cookie => `${cookie.key}=${cookie.value}`).join('; ');

            api.sendMessage(`🍪| Here are your cookies:\n${formattedCookies}`, event.threadID, event.messageID);
        } catch (error) {
            console.error(error);
            api.sendMessage(`❌| Error: ${error.message}`, event.threadID, event.messageID);
        }
    }
};
