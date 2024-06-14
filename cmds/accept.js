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
        const list = [
            ...(await api.getThreadList(1, null, ['PENDING'])),
            ...(await api.getThreadList(1, null, ['OTHER']))
        ];
        if (list[0]) {
            list.forEach(thread => {
                const info = await api.getUserInfo(participant.userFbId);
                const { name, gender } = info[participant.userFbId];

                    if (participant.userFbId === api.getCurrentUserID()) {
                        // Get group info
                        const threadInfo = await api.getThreadInfo(event.threadID);
                        const groupName = threadInfo.threadName;
                        const memberCount = threadInfo.participantIDs.length;

                        // If the bot is added to the group
                        api.sendMessage(`✅ Hello! This bot is now Online in ${groupName}\nMembers: ${memberCount}\n—————————————\nℹ️• Feel free to use it anytime!\nℹ️• 24/7 Active!\nℹ️• Owner: https://www.facebook.com/carljohn.villavito \nℹ️• Co-owner: https://www.facebook.com/61557924257806 \n—————————————`, thread.threadID, async () => {
                            // Change the bot's nickname to the default
                            const botInfo = await api.getUserInfo(api.getCurrentUserID());
                            const firstName = botInfo[api.getCurrentUserID()].firstName;
                            const defaultNickname = `${config.PREFIX} - ${firstName}-chan`;
                            await api.changeNickname(defaultNickname, event.threadID, api.getCurrentUserID());
                        });
            });
           api.sendMessage("Threads Accepted Successfully.", event.threadID, event.messageID);
        } else {
            api.sendMessage("There are no pending thread requests.", event.threadID, event.messageID);
        }
    }
};
