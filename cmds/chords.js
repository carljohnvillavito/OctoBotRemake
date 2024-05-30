const axios = require('axios');

module.exports = {
    description: "Find guitar or other chords for songs.",
    role: "user", // user, botadmin, or admin
    cooldown: 5,
    credits: "Converted by CJ Villavito",
    execute(api, event, args, commands) {
        const song = args.join(' ');

        if (!song) {
            return api.sendMessage('Please enter a song.', event.threadID, event.messageID);
        } else {
            const apiUrl = `https://markdevs-last-api-cvxr.onrender.com/search/chords?q=${encodeURIComponent(song)}`;
            
            axios.get(apiUrl)
                .then(res => {
                    const { title, artist, key, type, url, chords } = res.data.chord;

                    if (title && artist && chords) {
                        const message = `Title: ${title}\n\nArtist: ${artist}\n\nKey: ${key}\n\nType: ${type}\n\nChords:\n${chords}\n\nURL: ${url}`;
                        api.sendMessage(message, event.threadID, event.messageID);
                    } else {
                        api.sendMessage('Sorry, the chords could not be found.', event.threadID, event.messageID);
                    }
                })
                .catch(error => {
                    console.error('Chords API error:', error);
                    api.sendMessage('Failed to fetch chords.', event.threadID, event.messageID);
                });
        }
    }
};
