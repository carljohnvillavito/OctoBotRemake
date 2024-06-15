const axios = require('axios');

module.exports = {
    description: "Teach Simsimi some words",
    role: "user", // or admin botadmin if required
    cooldown: 5,
    execute: async function(api, event, args, commands) {
        try {
            const text = args.join(" ");
            const text1 = text.substr(0, text.indexOf(' > '));
            const text2 = text.split(" > ").pop();

            if (!text1 || !text2) {
                return api.sendMessage(`Usage: teach hi > hello`, event.threadID, event.messageID);
            }

            const response = await axios.get(`https://mighty-taiga-33992-6547d84cd219.herokuapp.com/teach?q=${encodeURIComponent(text1)}&r=${encodeURIComponent(text2)}`);
            api.sendMessage(`Your ask: ${text1}\nSim respond: ${text2}\nSuccessful teach`, event.threadID, event.messageID);
        } catch (error) {
            console.error("An error occurred:", error);
            api.sendMessage("Please provide both a question and an answer\nExample: teach hi => hello", event.threadID, event.messageID);
        }
    }
};
