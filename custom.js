const { CronJob } = require('cron');
const fs = require('fs');
const path = require('path');

// Function to send a message to all threads
function sendGreetingMessage(api, message) {
    api.getThreadList(100, null, ["INBOX"], (err, list) => {
        if (err) {
            console.error('Error fetching thread list:', err);
            return;
        }
        list.forEach(thread => {
            api.sendMessage(message, thread.threadID, (err) => {
                if (err) {
                    console.error(`Error sending greeting message to thread ${thread.threadID}:`, err);
                } else {
                    console.log(`Greeting message sent to thread ${thread.threadID}`);
                }
            });
        });
    });
}

function init(api) {
    const jobs = [
        {
            time: '0 0 6 20 * *', // 6 am
            message: 'Good Morning!'
        },
        {
            time: '0 0 12 * * *', // 12 pm
            message: 'Good Afternoon!'
        },
        {
            time: '0 0 18 * * *', // 6 pm
            message: 'Good Evening!'
        },
        {
            time: '0 0 22 * * *', // 10 pm
            message: 'Good Night!'
        }
    ];

    jobs.forEach(job => {
        new CronJob({
            cronTime: job.time,
            onTick: () => sendGreetingMessage(api, job.message),
            start: true,
            timeZone: 'Asia/Singapore' // GMT+8
        });
    });
}

module.exports = {
    init
};
