const axios = require('axios');
const fs = require('fs');
const path = require('path');

const configPath = path.resolve(__dirname, '../config.json');
const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));

module.exports = {
    description: "Ask the GPT4o a question (realtime web search)",
    role: "user",
    cooldown: 8,
    execute: async function (api, event, args, commands) {
        if (args.length === 0) {
            api.sendMessage(`Hi! You are using ChatGPT's GPT4o Model.\nPlease provide a question.\nUsage: ${config.PREFIX}gpt4o What is life?`, event.threadID);
            return;
        }

        const question = args.join(" ");
        const apiUrl = `https://hiroshi-rest-api.replit.app/ai/gpt4o?ask=${encodeURIComponent(question)}`;

        api.sendMessage('Generating•••', event.threadID, event.messageID);

        try {
            const response = await axios.get(apiUrl);
            const data = response.data;
            const message = data.response || "Sorry, I couldn't understand the question.";

            setTimeout(() => {
                api.sendMessage(message, event.threadID, event.messageID);
            }, 3000);
        } catch (error) {
            console.error('Error:', error);
            api.sendMessage("Sorry, an error occurred while processing your request.", event.threadID);
        }
    }
};
