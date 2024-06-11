module.exports = {
    description: "Generates you any greetings...",
    cooldown: 1,
    credits: "CJ & CHICO",
    execute: async function(api, event){
        const messages = [
            'Hi good day too you!',
            'Have a nice day ahead!',
            'Whats good yo?'
        ];

        messages.sort(() => Math.random() - 0.5);

        if(typeof event.body === "string" && ['hi', 'Hello', 'Hi', 'hello', 'Hello there'].includes(event.body)){
            api.sendMessage(messages.join(`\n`), event.threadID, event.messageID);
        }
    }
}