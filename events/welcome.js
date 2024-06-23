const fs = require('fs');
const path = require('path');
const { writeFileSync } = require("fs-extra");

// Load configuration
const configPath = path.resolve(__dirname, '../config.json');
const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));

module.exports = {
    async handleEvent(api, event) {
        if (event.logMessageData?.addedParticipants) {
            for (const participant of event.logMessageData.addedParticipants) {
                try {
                    const userInfo = await api.getUserInfo(participant.userFbId);
                    const user = userInfo[participant.userFbId];

                    if (!user) {
                        console.error(`User information for ID ${participant.userFbId} not found.`);
                        continue;
                    }

                    const { name, gender } = user;

                    if (participant.userFbId === api.getCurrentUserID()) {
                        // Get group info
                        const threadInfo = await api.getThreadInfo(event.threadID);
                        const groupName = threadInfo.threadName;
                        const memberCount = threadInfo.participantIDs.length;

                        // If the bot is added to the group
                        await api.sendMessage(
                            `✅ Hello! This bot is now Online in ${groupName}\nMembers: ${memberCount}\n—————————————\nℹ️• Feel free to use it anytime!\nℹ️• 24/7 Active!\nℹ️• Owner: https://www.facebook.com/yasucraige \n—————————————`,
                            event.threadID,
                            async () => {
                                // Change the bot's nickname to the default
                                const botInfo = await api.getUserInfo(api.getCurrentUserID());
                                const bot = botInfo[api.getCurrentUserID()];
                                if (bot) {
                                    const firstName = bot.firstName;
                                    const defaultNickname = `${config.PREFIX} - ${firstName}-sama`;
                                    await api.changeNickname(defaultNickname, event.threadID, api.getCurrentUserID());
                                }
                            }
                        );
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
                        let welcomeTitle;
                        if (gender === 2) { // 2 typically denotes male in fca-unofficial
                            gifPath = gifsBoy[Math.floor(Math.random() * gifsBoy.length)];
                            welcomeTitle = "Mr.";
                        } else if (gender === 1) { // 1 typically denotes female in fca-unofficial
                            gifPath = gifsGirl[Math.floor(Math.random() * gifsGirl.length)];
                            welcomeTitle = "M'lady";
                        } else {
                            gifPath = gifsBoy[0]; // default to boy gif if gender is unspecified
                            welcomeTitle = "Mr.";
                        }

                        // Get group info
                        const threadInfo = await api.getThreadInfo(event.threadID);
                        const groupName = threadInfo.threadName;
                        const memberCount = threadInfo.participantIDs.length;

                        const welcomeMessage = `Welcome ${welcomeTitle} ${name} to ${groupName}\n\nYou are the ${memberCount}th member, Enjoy your welcome here.\n\nAgain, Welcome!`;

                        // Send welcome message
                        await api.sendMessage(welcomeMessage, event.threadID, async () => {
                            // Send welcome GIF
                            if (fs.existsSync(gifPath)) {
                                await api.sendMessage({
                                    body: '',
                                    attachment: fs.createReadStream(gifPath)
                                }, event.threadID);
                            }

                            // Change new member's nickname
                            const firstName = name.split(' ')[0];
                            const nickname = `${firstName} — member`;
                            await api.changeNickname(nickname, event.threadID, participant.userFbId);
                        });
                    }
                } catch (error) {
                    console.error("Error:", error);
                }
            }
        }
    }
};
