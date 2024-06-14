const path = require('path');
const fs = require('fs');

// Load configuration
const configPath = path.resolve(__dirname, '../config.json');
const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));

module.exports = {
    description: "Automatically accept pending threads",
    role: "botadmin",
    credits: "admin",
    cooldown: 1,
    async execute(api, event, args, commands) {
        try {
            const pendingList = await api.getThreadList(100, null, ['PENDING']);
            const otherList = await api.getThreadList(100, null, ['OTHER']);
            const list = [...pendingList, ...otherList];

            if (list.length > 0) {
                for (const thread of list) {
                    try {
                        // Send approval message
                        await api.sendMessage('Congrats! This thread has been approved by botadmin. You can now use our bot. Type !help to see all the commands. Thanks 👍', thread.threadID);

                        // Get thread info
                        const threadInfo = await api.getThreadInfo(thread.threadID);

                        // If the bot is added to the group
                        if (threadInfo.participantIDs.includes(api.getCurrentUserID())) {
                            const groupName = threadInfo.threadName;
                            const memberCount = threadInfo.participantIDs.length;

                            // Send bot's welcome message
                            await api.sendMessage(
                                `✅ Hello! This bot is now Online in ${groupName}\nMembers: ${memberCount}\n—————————————\nℹ️• Feel free to use it anytime!\nℹ️• 24/7 Active!\nℹ️• Owner: https://www.facebook.com/carljohn.villavito \nℹ️• Co-owner: https://www.facebook.com/61557924257806 \n—————————————`,
                                thread.threadID
                            );

                            // Change the bot's nickname to the default
                            const botInfo = await api.getUserInfo(api.getCurrentUserID());
                            const firstName = botInfo[api.getCurrentUserID()].firstName;
                            const defaultNickname = `${config.PREFIX} - ${firstName}-chan`;
                            await api.changeNickname(defaultNickname, thread.threadID, api.getCurrentUserID());
                        }
                    } catch (threadError) {
                        console.error('Error processing thread:', thread.threadID, threadError);
                    }
                }
                await api.sendMessage("Threads Accepted Successfully.", event.threadID, event.messageID);
            } else {
                await api.sendMessage("There are no pending thread requests.", event.threadID, event.messageID);
            }
        } catch (error) {
            console.error('Error executing command:', error);
            await api.sendMessage(`Error executing command: ${error.message}`, event.threadID);
        }
    }
};
