const axios = require('axios');
const fs = require('fs');
const path = require('path');
const { PassThrough } = require('stream');

module.exports = {
    description: "Download TikTok videos",
    role: "user", // or admin botadmin
    cooldown: 4,
    credits: "to the owner",
    async execute(api, event, args, commands) {
        const tiktokLink = args.join(" ");
        if (!tiktokLink) {
            return api.sendMessage("❓| Please provide a TikTok link.", event.threadID, event.messageID);
        }

        // Send a loading message
        api.sendMessage("⏳| Fetching your video...", event.threadID, async (err, info) => {
            if (err) return console.error(err);

            try {
                const response = await axios.get(`https://markdevs-last-api-a4sm.onrender.com/api/tiktokdl?link=${encodeURIComponent(tiktokLink)}`);
                if (!response.data.url) {
                    throw new Error("Failed to fetch video");
                }

                const videoUrl = response.data.url;
                const username = response.data.username;
                const nickname = response.data.nickname;
                const title = response.data.title;
                const like = response.data.like;
                const comment = response.data.comment;
                const views = response.data.views;

                // Fetch the video as a stream
                const videoResponse = await axios({
                    url: videoUrl,
                    method: 'GET',
                    responseType: 'stream'
                });

                const stream = new PassThrough();
                videoResponse.data.pipe(stream);

                // Send the video as an attachment
                api.sendMessage({
                    body: `📹| TikTok Video by ${nickname} (@${username})\n\n${title}\n\nViews: ${views} | ❤️ ${like} | 💬 ${comment}`,
                    attachment: stream
                }, event.threadID, event.messageID);
            } catch (error) {
                console.error(error);
                api.sendMessage(`❌| Error: ${error.message}`, event.threadID, event.messageID);
            }
        });
    }
};
