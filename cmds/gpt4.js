const axios = require('axios');

module.exports = {
    description: "Talk to ChatGPT 4 using realtime information!",
    role: "user",
    octoPrefix: false,
    cooldown: 5,
    credits: "Carl John Villavito & Chico",
    execute(api, event, args, commands) {
        if (args.length === 0) {
            api.setMessageReaction("🤖", event.messageID, ()=>{}, true);
            api.sendMessage("ChatGPT4🤖 | Please provide a question.", event.threadID);
            return;
        }
        
        const myOten = event.senderID;
        const question = args.join(" ");
        const searchMessage = "ChatGPT4🤖 | Generating•••";
        api.sendMessage(searchMessage, event.threadID, event.messageID);
 
        const apiUrl = `https://markdevs-api.onrender.com/gpt4?prompt=${encodeURIComponent(question)}&uid=${encodeURIComponent(myOten)}`;

        axios.get(apiUrl)
            .then(response => {
                const data = response.data;
                const message = data.gpt4 || "Sorry, I couldn't understand the question.";

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
