const axios = require('axios');

module.exports = {
    description: "Ask the GPT-3.5 Turbo a question (conversational)",
    role: "user",
    cooldown: 5,
    execute(api, event, args, commands) {
        if (args.length === 0) {
            api.setMessageReaction("🔥", event.messageID, ()=>{}, true);
            api.sendMessage("Please provide a question.", event.threadID, event.messageID);
            return;
        }
        
        const myOten = event.senderID;
        const question = args.join(" ");
        const searchMessage = `Generating•••`;
        api.sendMessage(searchMessage, event.threadID, event.messageID);
        
        const apiUrl = `https://joshweb.click/new/gpt-3_5-turbo?prompt=${encodeURIComponent(question)}&uid=${myOten}`;

        axios.get(apiUrl)
            .then(response => {
                if (response.data.status === 200) {
                    const message = response.data.result.reply || "Sorry, I couldn't understand the question.";

                    // sending
                    setTimeout(() => {
                        api.sendMessage(message, event.threadID, event.messageID);
                    }, 3000);
                } else {
                    api.sendMessage("Sorry, an unexpected error occurred.", event.threadID);
                }
            })
            .catch(error => {
                console.error('Error:', error);
                api.sendMessage("Sorry, an error occurred while processing your request.", event.threadID);
            });
    }
};
