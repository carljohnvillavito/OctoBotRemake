const axios = require('axios');

module.exports = {
  description: "Text to Image",
  role: "user", // or admin botadmin
  cooldown: 10,
  credits: "to the owner."
  async execute(api, event, args, commands) {
    const text = args.join(" ");
    if (!text) {
      return api.sendMessage("❓| Please provide a prompt.", event.threadID, event.messageID);
    }

    const prompt = text;

    api.sendMessage("✅| Creating your Imagination...", event.threadID, async (err, info) => {
      let ui = info.messageID;
      api.setMessageReaction("⏳", event.messageID, () => {}, true);
      try {
        const response = await axios.get(`https://itsaryanapis.onrender.com/api/dalle?prompt=${encodeURIComponent(prompt)}&amount=4`);
        api.setMessageReaction("✅", event.messageID, () => {}, true);
        const images = response.data.images;
        api.unsendMessage(ui);
        api.sendMessage({
          body: `🖼️ 𝗗𝗔𝗟𝗟-𝗘 \n━━━━━━━━━━━━\n\nPlease reply with the image number (1, 2, 3, 4) to get the corresponding image in high resolution.`,
          attachment: await Promise.all(images.map(img => global.utils.getStreamFromURL(img)))
        }, event.threadID, async (err, info) => {
          if (err) return console.error(err);
          global.GoatBot.onReply.set(info.messageID, {
            commandName: "dalle",
            messageID: info.messageID,
            author: event.senderID,
            imageUrls: images
          });
        });
      } catch (error) {
        console.error(error);
        api.sendMessage(`Error: ${error}`, event.threadID);
      }
    });
  },
  onReply: async function (api, event, reply, args, usersData) {
    const replyNumber = parseInt(args[0]);
    const { author, imageUrls } = reply;
    if (event.senderID !== author) return;
    try {
      if (replyNumber >= 1 && reply <= 4) {
        const img = imageUrls[replyNumber - 1];
        api.sendMessage({ attachment: await global.utils.getStreamFromURL(img) }, event.threadID);
      } else {
        api.sendMessage("Invalid image number. Please reply with a number between 1 and 4.", event.threadID);
        return;
      }
    } catch (error) {
      console.error(error);
      api.sendMessage(`Error: ${error}`, event.threadID);
    }
    api.unsendMessage(reply.messageID);
  }
};
