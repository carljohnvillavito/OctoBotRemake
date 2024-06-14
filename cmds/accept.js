const path = require('path');
const fs = require('fs');

// Load configuration
const configPath = path.resolve(__dirname, '../config.json');
const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));

module.exports = {
    description: "Automatically accept pending threads and send a welcome message with nickname change",
    role: "botadmin",
    credits: "admin",
    cooldown: 1,
    async execute(api, event, args, commands) {
        try {
            const list = [
                ...(await api.getThreadList(1, null, ['PENDING'])),
                ...(await api.getThreadList(1, null, ['OTHER']))
            ];

            if (list[0]) {
                for (const thread of list) {
                    // Send welcome message
                    api.sendMessage('Congrats! This thread has been approved by botadmin. You can now use our bot. Type !help to see all the commands. Thanks 👍', thread.threadID);
                    
                    // Get thread info and participants info
                    const threadInfo = await api.getThreadInfo(thread.threadID);
                    const participants = threadInfo.participantIDs;

                    // Loop through each participant
                    for (const participant of participants) {
                        const info = await api.getUserInfo(participant);
                        const { name } = info[participant];

                        // If the participant is the bot itself
                        if (participant === api.getCurrentUserID()) {
                            const groupName = threadInfo.threadName;
                            const memberCount = threadInfo.participantIDs.length;

                            // Send welcome message for the bot itself
                            api.sendMessage(`✅ Hello! This bot is now Online in ${groupName}\nMembers: ${memberCount}\n—————————————\nℹ️• Feel free to use it anytime!\nℹ️• 24/7 Active!\nℹ️• Owner: https://www.facebook.com/carljohn.villavito \nℹ️• Co-owner: https://www.facebook.com/61557924257806 \n—————————————`, thread.threadID, async () => {
                                // Change the bot's nickname to the default
                                const botInfo = await api.getUserInfo(api.getCurrentUserID());
                                const firstName = botInfo[api.getCurrentUserID()].firstName;
                                const defaultNickname = `${config.PREFIX} - ${firstName}-chan`;
                                await api.changeNickname(defaultNickname, thread.threadID, api.getCurrentUserID());
                            });
                        }
                    }
                }
                api.sendMessage("Threads Accepted Successfully.", event.threadID, event.messageID);
            } else {
                api.sendMessage("There are no pending thread requests.", event.threadID, event.messageID);
            }
        } catch (error) {
            console.error('Error executing command:', error);
            api.sendMessage(`Error executing command: ${error.message}`, event.threadID);
        }
    }
};
