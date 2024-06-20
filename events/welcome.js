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
                    const { name, gender } = info[participant.userFbId];

                    if (participant.userFbId === api.getCurrentUserID()) {
                        // Get group info
                        const threadInfo = await api.getThreadInfo(event.threadID);
                        const groupName = threadInfo.threadName;
                        const memberCount = threadInfo.participantIDs.length;

                        // If the bot is added to the group
                        api.sendMessage(`✅ Hello! This bot is now Online in ${groupName}\nMembers: ${memberCount}\n—————————————\nℹ️• Feel free to use it anytime!\nℹ️• 24/7 Active!\nℹ️• Owner: https://www.facebook.com/khdcrg \n—————————————`, event.threadID, async () => {
                            // Change the bot's nickname to the default
                            const botInfo = await api.getUserInfo(api.getCurrentUserID());
                            const firstName = botInfo[api.getCurrentUserID()].firstName;
                            const defaultNickname = `${config.PREFIX} - ${firstName}-sama`;
                            await api.changeNickname(defaultNickname, event.threadID, api.getCurrentUserID());
                        });
                    } else {
                        // Gender-specific GIF paths
                        const gifsBoy = [
                            path.resolve(__dirname, '../cache/gifs/kakashi_wc.gif'),
                            path.resolve(__dirname, '../cache/gifs/meliodas_wc.gif'),
                            path.resolve(__dirname, '../cache/gifs/maskman_wc.gif')
                        ];

                        const gifsGirl = [
                            path.resolve(__dirname, '../cache/gifs/girlanime_wc.gif'),
                            path.resolve(__dirname, '../cache/gifs/welcome-anime.gif')
                        ];

                        let gifPath;
                        if (gender === 2) { // 2 typically denotes male in fca-unofficial
                            gifPath = gifsBoy[Math.floor(Math.random() * gifsBoy.length)];
                        } else if (gender === 1) { // 1 typically denotes female in fca-unofficial
                            gifPath = gifsGirl[Math.floor(Math.random() * gifsGirl.length)];
                        } else {
                            gifPath = gifsBoy[0]; // default to boy gif if gender is unspecified
                        }

                        // Check if GIF file exists
                        if (fs.existsSync(gifPath)) {
                            api.sendMessage(`Welcome ${name} to the group!`, event.threadID, () => {
                                api.sendMessage({
                                    body: '',
                                    attachment: fs.createReadStream(gifPath)
                                }, event.threadID);
                            });
                        } else {
                            api.sendMessage(`Welcome ${name} to the group!`, event.threadID);
                        }
                    }
                } catch (error) {
                    console.error("Error:", error);
                }
            });
        }
    }
};
