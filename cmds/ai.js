const axios = require('axios');

module.exports = {
    description: "Ask the GPT4 a question(conversational)",
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
 
 
       const apiUrl = `https://markdevs-last-api-cvxr.onrender.com/gpt4?prompt=${encodeURIComponent(question)}&uid=${myOten}`;
       

        axios.get(apiUrl)
            .then(response => {
                const data = response.data;
                const message = data.gpt4 || "Sorry, I couldn't understand the question.";

                // sendinsg
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
