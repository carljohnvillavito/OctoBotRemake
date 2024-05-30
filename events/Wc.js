const fs = require('fs');
const path = require('path');

// Load configuration
const configPath = path.resolve(__dirname, '../config.json');
const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));

module.exports = {
    async handleEvent(api, event) {
        if (event.logMessageData?.addedParticipants) {
            event.logMessageData.addedParticipants.forEach(async (participant) => {
                try {
                    const info = await api.getUserInfo(participant.userFbId);
                    const { name } = info[participant.userFbId];

                    if (participant.userFbId === api.getCurrentUserID()) {
                        // Get group info
                        const threadInfo = await api.getThreadInfo(event.threadID);
                        const groupName = threadInfo.threadName;
                        const memberCount = threadInfo.participantIDs.length;

                        // If the bot is added to the group
                        api.sendMessage(`✅ Hello! This bot is now Online in ${groupName}\nMembers: ${memberCount}\n—————————————\nℹ️• Feel free to use it anytime!\nℹ️• 24/7 Active!\nℹ️• Owner: https://www.facebook.com/carljohn.villavito \nℹ️• Co-owner: https://www.facebook.com/61557924257806 \n—————————————`, event.threadID, async () => {
                            // Change the bot's nickname to the default
                            const botInfo = await api.getUserInfo(api.getCurrentUserID());
                            const firstName = botInfo[api.getCurrentUserID()].firstName;
                            const defaultNickname = `${config.PREFIX} - ${firstName}-chan`;
                            await api.changeNickname(defaultNickname, event.threadID, api.getCurrentUserID());
                        });
                    } else {
                        // If any other participant is added to the group
                        api.sendMessage(`Welcome ${name} to the group!`, event.threadID);
                    }
                } catch (error) {
                    console.error("Error:", error);
                }
            });
        }
    }
};
