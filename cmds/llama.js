const axios = require('axios');

module.exports = {
    description: "Talk to Llama",
    role: "user",
    cooldown: 5,
    credits: "Carl John Villavito & Chico",
    execute(api, event, args, commands) {
        if (args.length === 0) {
            api.sendMessage("Llama | Please provide a question.", event.threadID);
            return;
        }
        
        const myOten = event.senderID;
        const question = args.join(" ");
        const searchMessage = "Llama | Generating•••";
        api.sendMessage(searchMessage, event.threadID, event.messageID);
 
        const apiUrl = `https://apis-samir.onrender.com/llama3?prompt=${encodeURIComponent(question)}`;

        axios.get(apiUrl)
            .then(response => {
                const data = response.data;
                const message = data.completion || "Sorry, I couldn't understand the question.";

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
