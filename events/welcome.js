const axios = require('axios');
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
                        api.sendMessage(`✅ Hello! This bot is now Online in ${groupName}\nMembers: ${memberCount}\n—————————————\nℹ️• Feel free to use it anytime!\nℹ️• 24/7 Active!\nℹ️• Owner: https://www.facebook.com/61554890228006\n—————————————`, event.threadID, async () => {
                            // Change the bot's nickname to the default
                            const botInfo = await api.getUserInfo(api.getCurrentUserID());
                            const firstName = botInfo[api.getCurrentUserID()].firstName;
                            const defaultNickname = `[${config.PREFIX}] »⟩ ${firstName}`;
                            await api.changeNickname(defaultNickname, event.threadID, api.getCurrentUserID());
                        });
                    } else {
                        // Generate a random avatar URL based on gender
                        const avatarUrlsBoy = [
                            `https://hiroshi-rest-api.replit.app/canvas/avatarwibu?id=90&name=${encodeURIComponent(name)}&signature=${encodeURIComponent(name)}&color=blue`,
                            `https://hiroshi-rest-api.replit.app/canvas/avatarwibu?id=3&name=${encodeURIComponent(name)}&signature=${encodeURIComponent(name)}&color=red`,
                            `https://hiroshi-rest-api.replit.app/canvas/avatarwibu?id=50&name=${encodeURIComponent(name)}&signature=${encodeURIComponent(name)}&color=lime`
                        ];

                        const avatarUrlsGirl = [
                            `https://hiroshi-rest-api.replit.app/canvas/avatarwibu?id=1&name=${encodeURIComponent(name)}&signature=${encodeURIComponent(name)}&color=violet`,
                            `https://hiroshi-rest-api.replit.app/canvas/avatarwibu?id=100&name=${encodeURIComponent(name)}&signature=${encodeURIComponent(name)}&color=pink`,
                            `https://hiroshi-rest-api.replit.app/canvas/avatarwibu?id=8&name=${encodeURIComponent(name)}&signature=${encodeURIComponent(name)}&color=maroon`,
                            `https://hiroshi-rest-api.replit.app/canvas/avatarwibu?id=11&name=${encodeURIComponent(name)}&signature=${encodeURIComponent(name)}&color=brown`
                        ];

                        let avatarUrl;
                        if (gender === 2) { // 2 typically denotes male in fca-unofficial
                            avatarUrl = avatarUrlsBoy[Math.floor(Math.random() * avatarUrlsBoy.length)];
                        } else if (gender === 1) { // 1 typically denotes female in fca-unofficial
                            avatarUrl = avatarUrlsGirl[Math.floor(Math.random() * avatarUrlsGirl.length)];
                        } else {
                            avatarUrl = avatarUrlsBoy[0]; // default to boy avatar if gender is unspecified
                        }

                        const response = await axios.get(avatarUrl, { responseType: 'stream' });

                        const dateNow = new Date().toISOString().replace(/[:.]/g, '-');
                        const imageFilePath = path.resolve(__dirname, `../cache/${dateNow}_wcImage.jpg`);
                        const writer = fs.createWriteStream(imageFilePath);

                        response.data.pipe(writer);

                        writer.on('finish', () => {
                            api.sendMessage(`Welcome ${name} to the group!`, event.threadID, () => {
                                api.sendMessage({
                                    body: '',
                                    attachment: fs.createReadStream(imageFilePath)
                                }, event.threadID);
                            });
                        });

                        writer.on('error', (error) => {
                            console.error("Error writing image file:", error);
                            api.sendMessage(`Welcome ${name} to the group!`, event.threadID);
                        });
                    }
                } catch (error) {
                    console.error("Error:", error);
                }
            });
        }
    }
};
