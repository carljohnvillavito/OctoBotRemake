const axios = require('axios');
const fs = require('fs');
const path = require('path');

module.exports = {
  description: "Search corn video",
  role: "botadmin",
  cooldown: 5,
  async execute(api, event, args, commands) {
    try {
      if (args.length < 2) {
        api.sendMessage('Please provide a search term and the number of videos to send. Example: send <content> <no. of videos>', event.threadID);
        return;
      }

      const searchTerm = args.slice(0, -1).join(' ');
      const numVideos = parseInt(args[args.length - 1]);

      if (isNaN(numVideos) || numVideos <= 0 || numVideos > 5) {
        api.sendMessage('Please specify a number between 1 and 5 for the number of videos to send.', event.threadID);
        return;
      }

      const info = await api.getUserInfo(event.senderID);
      const senderName = info[event.senderID].name;

      const apiUrl = 'https://deku-rest-api-3ijr.onrender.com/prn/search/' + encodeURIComponent(searchTerm);
      const response = await axios.get(apiUrl);
      const videos = response.data.result;

      if (!videos || videos.length === 0) {
        throw new Error("No corn video found for the provided query.");
      }

      const videoPromises = videos.slice(0, numVideos).map(video => downloadCornVideo(video.video));
      const videoPaths = await Promise.all(videoPromises);

      const attachments = videoPaths.map(videoPath => fs.createReadStream(videoPath));

      await api.sendMessage({
        body: `Here are the corn videos you requested:`,
        attachment: attachments
      }, event.threadID);

      // Clean up downloaded video files
      videoPaths.forEach(filePath => fs.unlink(filePath, err => {
        if (err) console.error(`Failed to delete file: ${filePath}`, err);
      }));

    } catch (error) {
      console.error(error);
      if (error.message === "No corn video found for the provided query." || error.message === "Error: Link not found!") {
        api.sendMessage(error.message, event.threadID);
      } else {
        api.sendMessage('An error occurred while processing your request.', event.threadID, event.messageID);
      }
    }
  }
};

async function downloadCornVideo(videoUrl) {
  try {
    const cornDownloadResponse = await axios.get(`https://deku-rest-api-3ijr.onrender.com/prn/download?url=${encodeURIComponent(videoUrl)}`);
    const cornDownloadURL = cornDownloadResponse.data.result.contentUrl.Default_Quality;

    if (!cornDownloadURL) {
      throw new Error("Error: Link not found!");
    }

    const response = await axios({
      url: cornDownloadURL,
      method: 'GET',
      responseType: 'stream'
    });

    const cornFilePath = path.join(__dirname, `cache`, `${Date.now()}_corn.mp4`);
    const writer = fs.createWriteStream(cornFilePath);

    return new Promise((resolve, reject) => {
      response.data.pipe(writer);

      writer.on('finish', () => resolve(cornFilePath));
      writer.on('error', reject);
    });
  } catch (error) {
    throw new Error(`Error downloading corn video: ${error.message}`);
  }
}
