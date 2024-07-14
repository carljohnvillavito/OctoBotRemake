const axios = require('axios');

module.exports = {
    description: "Teach Simsimi some words",
    role: "user", // or admin botadmin if required
    cooldown: 5,
    execute: async function(api, event, args, commands) {
        try {
            const text = args.join(" ");
            const separator = ' > ';
            const index = text.indexOf(separator);

            if (index === -1) {
                return api.sendMessage(`Usage: teach hi${separator}hello`, event.threadID, event.messageID);
            }

            const text1 = text.substr(0, index).trim();
            const text2 = text.substr(index + separator.length).trim();

            if (!text1 || !text2) {
                return api.sendMessage(`Usage: teach hi${separator}hello`, event.threadID, event.messageID);
            }

            const response = await axios.get(`https://simsimi-api-pro.onrender.com/teach?ask=${encodeURIComponent(text1)}&ans=${encodeURIComponent(text2)}`);
            
            if (response.data.ask && response.data.ans) {
                api.sendMessage(`Your ask: ${response.data.ask}\nSim respond: ${response.data.ans}\nSuccessfully taught!`, event.threadID, event.messageID);
            } else {
                api.sendMessage("Failed to teach SimSimi. Please try again.", event.threadID, event.messageID);
            }
        } catch (error) {
            console.error("An error occurred:", error);
            api.sendMessage("An error occurred while teaching. Please provide both a question and an answer\nExample: teach hi > hello", event.threadID, event.messageID);
        }
    }
};
