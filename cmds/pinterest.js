const axios = require('axios');
const fs = require('fs');

async function getPinterest(img) {
  try {
    const response = await axios.get(`https://hiroshi-rest-api.replit.app/search/pinterest?search=${encodeURIComponent(img)}`);
    if (response.data && response.data.data) {
      return response.data.data;
    } else {
      throw new Error('No data returned from API');
    }
  } catch (error) {
    throw error;
  }
}

module.exports = {
  description: "search pictures in Pinterest",
  role: "user",
  cooldown: 5,
  execute: async function(api, event, args, commands) {
    const input = args.join(' ');
    const time = new Date();
    const timestamp = time.toISOString().replace(/[:.]/g, "-");
    const prefix = "Pinterest";

    if (!input) {
      api.sendMessage(`To get started, type ${prefix} followed by the name of the image you are looking for, and the expected number of images.\n\nExample:\n\n${prefix} soyeon - 10`, event.threadID, event.messageID);
      return;
    }

    const parts = input.split('-').map(part => part.trim());
    const key = parts[0];
    const len = parseInt(parts[1], 10) || 6;

    api.sendMessage(`Searching for "${key}" on Pinterest...`, event.threadID, event.messageID);

    try {
      const data = await getPinterest(key);
      const file = [];

      for (let i = 0; i < Math.min(len, data.length); i++) {
        const path = `./cache/${timestamp}_${i + 1}.jpg`;
        const download = (await axios.get(data[i], { responseType: 'arraybuffer' })).data;
        fs.writeFileSync(path, Buffer.from(download));
        file.push(fs.createReadStream(path));
      }

      await api.sendMessage({ attachment: file, body: "" }, event.threadID, (err) => {
        if (!err) {
          file.forEach((_, i) => fs.unlinkSync(`./cache/${timestamp}_${i + 1}.jpg`));
        } else {
          console.error("Failed to send message:", err);
        }
      }, event.messageID);
    } catch (error) {
      api.sendMessage(`An error occurred while searching for images: ${error.message}`, event.threadID, event.messageID);
      console.error(error);
    }
  }
};
