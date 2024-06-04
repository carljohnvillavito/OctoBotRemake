const axios = require('axios');

module.exports = {
    description: "Download TikTok videos",
    role: "user", // or admin botadmin
    cooldown: 4,
    credits: "to the owner",
    execute: async function(api, event, args, commands) {
        const tiktokLink = args.join(" ");
        if (!tiktokLink) {
            return api.sendMessage("❓| Please provide a TikTok link.", event.threadID, event.messageID);
        }

        // Send a loading message
        api.sendMessage("⏳| Fetching your video...", event.threadID, async (err, info) => {
            if (err) return console.error(err);

            try {
                const response = await axios.get(`https://eurix-api.replit.app/tikdl?link=${encodeURIComponent(tiktokLink)}`);
                if (response.data.code !== "200") {
                    throw new Error(response.data.msg);
                }

                const videoUrl = response.data.data.url;
                const username = response.data.data.username;
                const nickname = response.data.data.nickname;
                const title = response.data.data.title;
                const duration = response.data.data.duration;
                const heart = response.data.data.heart;
                const comment = response.data.data.comment;
                const share = response.data.data.share;

                // Fetch and send the video
                api.sendMessage({
                    body: `📹| TikTok Video by ${nickname} (@${username})\n\n${title}\n\nDuration: ${duration}s | ❤️ ${heart} | 💬 ${comment} | 🔗 ${share}`,
                    attachment: await global.utils.getStreamFromURL(videoUrl)
                }, event.threadID, event.messageID);
            } catch (error) {
                console.error(error);
                api.sendMessage(`❌| Error: ${error.message}`, event.threadID, event.messageID);
            }
        });
    }
};
