const axios = require('axios');

function getRandomMessage() {
    const messages = [
        "Thank you for using my bot! More commands coming soon. Stay tuned!",
        "Did you know? You can use my bot to automate many tasks!",
        "Stay safe and take care Everyone!",
        "Remember to take breaks and eat on time!",
        "Have a great and nice day!",
        "Goodmorning, Goodafternoon, Goodevening, and Goodnight.",
        "Follow this bot Please. Your support means a lot to us!",
        "Need help? Type !help for a list of commands.",
        "Stay positive and keep moving forward!",
        "We're constantly improving. Thank you for your feedback!"
    ];
    const randomIndex = Math.floor(Math.random() * messages.length);
    return messages[randomIndex];
}

function sendHourlyMessage(api) {
    setInterval(() => {
        const message = getRandomMessage();
        api.getThreadList(100, null, ["INBOX"], (err, list) => {
            if (err) {
                console.error('Error fetching thread list:', err);
                return;
            }
            list.forEach(thread => {
                api.sendMessage(message, thread.threadID, (err) => {
                    if (err) {
                        console.error(`Error sending hourly message to thread ${thread.threadID}:`, err);
                    } else {
                        console.log(`Hourly message sent to thread ${thread.threadID}`);
                    }
                });
            });
        });
    }, 60 * 60 * 1000); // 1 hour interval
}

function init(api) {
    sendHourlyMessage(api);
}

module.exports = {
    init
};
