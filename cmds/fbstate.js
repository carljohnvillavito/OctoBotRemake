const axios = require('axios');

module.exports = {
    description: "Get Facebook appstate (fbstate) using email and password",
    role: "user", // or admin botadmin
    cooldown: 5,
    credits: "User",
    execute: async function(api, event, args, commands) {
        if (args.length < 2) {
            return api.sendMessage("❓| Please provide both email and password.", event.threadID, event.messageID);
        }

        const email = args[0];
        const password = args[1];
        const url = `https://deku-rest-api-3ijr.onrender.com/getcookie?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`;

        api.sendMessage("🔄| Fetching fbstate...", event.threadID, event.messageID, async (err, info) => {
            if (err) return console.error(err);
            const loadingMessageID = info.messageID;

            try {
                const response = await axios.get(url);
                const cookies = response.data.cookie;

                if (!cookies || cookies.length === 0) {
                    throw new Error("No cookies found in the response.");
                }
                api.sendMessage("✅ Success! Here's your Fbstate", event.messageID);
                const appstateMessage = `${JSON.stringify(cookies, null, 2)}`;

                setTimeout(()=>{
                    api.sendMessage(appstateMessage, event.threadID, event.messageID);
                }, 1000);
            } catch (error) {
                console.error(error);
                api.sendMessage(`❌| Error: ${error.message}`, event.threadID, event.messageID);
            }
        });
    }
};