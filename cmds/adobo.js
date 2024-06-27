const axios = require('axios');

module.exports = {
    description: "Talk to Adobo GPT using realtime information!",
    role: "user",
    octoPrefix: true,
    cooldown: 5,
    credits: "Carl John Villavito & Chico",
    execute(api, event, args, commands) {
        if (args.length === 0) {
            api.setMessageReaction("🍗", event.messageID, ()=>{}, true);
            api.sendMessage("Adobo🍗 | Please provide a question.", event.threadID);
            return;
        }
        
        const myOten = event.senderID;
        const question = args.join(" ");
        const searchMessage = "Adobo🍗 | Generating•••";
        api.sendMessage(searchMessage, event.threadID, event.messageID);
 
        const apiUrl = `https://markdevs-api.onrender.com/api/adobo/gpt?query=${encodeURIComponent(question)}`;

        axios.get(apiUrl)
            .then(response => {
                const data = response.data;
                const message = data.result || "Sorry, I couldn't understand the question.";

                setTimeout(() => {
                    api.sendMessage(message, event.threadID, event.messageID);
                }, 3000);
            })
            .catch(error => {
                console.error('Error:', error);
                api.sendMessage("Sorry, an error occurred while processing your request.", event.threadID);
            });
    }
};
