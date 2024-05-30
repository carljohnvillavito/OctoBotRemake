const axios = require('axios');
const fs = require('fs');
const path = require('path');

module.exports = {
    description: "Fetch an image from DALL-E and send it",
    role: "user", 
    cooldown: 5,
    execute: async function(api, event, args) {
        if (!prompt) {
            api.sendMessage("Please provide a search prompt.", event.threadID);
            return;
        }

        const prompt = args.join(" ");
        const url = `https://markdevs-last-api-cvxr.onrender.com/dalle?prompt=${encodeURIComponent(prompt)}`;
        
        try {
            const response = await axios.get(url, { responseType: 'arraybuffer' });
            const imageBuffer = response.data;

            const cacheDir = path.join(__dirname, '../cache');
            fs.mkdirSync(cacheDir, { recursive: true });

         
            const fileName = `dalle_${Date.now()}.jpg`;
            const filePath = path.join(cacheDir, fileName);
            fs.writeFileSync(filePath, imageBuffer);

            // Send the image a
            api.sendMessage({
                attachment: fs.createReadStream(filePath)
            }, event.threadID, (err) => {
                if (err) {
                    console.error(err);
                    api.sendMessage("Failed to send the image.", event.threadID);
                }
            });

        } catch (error) {
            console.error(error);
            api.sendMessage("Failed to fetch the image from DALL-E.", event.threadID);
        }
    }
};
