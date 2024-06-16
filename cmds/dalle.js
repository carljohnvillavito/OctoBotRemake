const axios = require('axios');
const { createWriteStream } = require('fs');
const { createReadStream } = require('fs');
const { promisify } = require('util');
const stream = require('stream');
const pipeline = promisify(stream.pipeline);

module.exports = {
  description: "Text to Image",
  role: "user", // or admin botadmin
  cooldown: 5,
  octoPrefix: true,
  execute: async function(api, event, args, commands) {
    const text = args.join(" ");
    if (!text) {
      return api.sendMessage("❓| Please provide a prompt.", event.threadID, event.messageID);
    }

    const prompt = text;

    api.sendMessage("✅| Creating your Imagination...", event.threadID, async (err, info) => {
      if (err) {
        return console.error(err);
      }
      let ui = info.messageID;
      api.setMessageReaction("⏳", event.messageID, () => {}, true);
      try {
        const response = await axios.get(`https://deku-rest-api-3ijr.onrender.com/dalle?prompt=${encodeURIComponent(prompt)}`, { responseType: 'stream' });

        // Create a temporary file to store the image
        const tempFilePath = `/tmp/${Date.now()}.jpg`;
        await pipeline(response.data, createWriteStream(tempFilePath));

        api.setMessageReaction("✅", event.messageID, () => {}, true);
        api.unsendMessage(ui);
        api.sendMessage({
          body: `🖼️ 𝗗𝗔𝗟𝗟-𝗘 \n━━━━━━━━━━━━\n\nHere is your generated image.`,
          attachment: [createReadStream(tempFilePath)]
        }, event.threadID);
      } catch (error) {
        console.error(error);
        api.sendMessage(`Error: ${error.message}`, event.threadID);
      }
    });
  }
};
