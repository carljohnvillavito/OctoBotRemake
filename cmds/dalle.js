const axios = require('axios');

module.exports = {
  description: "Text to Image Using Dalle",
  role: "user", // or admin botadmin
  cooldown: 5,
  credits: "to owner",
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
        const response = await axios.get(`https://deku-rest-api-3ijr.onrender.com/dalle?prompt=${encodeURIComponent(prompt)}`);
        api.setMessageReaction("✅", event.messageID, () => {}, true);
        const image = response.data.image;
        api.unsendMessage(ui);
        api.sendMessage({
          body: `🖼️ 𝗗𝗔𝗟𝗟-𝗘 \n━━━━━━━━━━━━\n\nHere is your generated image.`,
          attachment: await global.utils.getStreamFromURL(image)
        }, event.threadID);
      } catch (error) {
        console.error(error);
        api.sendMessage(`Error: ${error.message}`, event.threadID);
      }
    });
  }
};
