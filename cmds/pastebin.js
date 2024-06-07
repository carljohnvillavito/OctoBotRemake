const axios = require('axios');

module.exports = {
    description: "Generate a raw Pastebin link containing the user inputs.",
    role: "user", // or admin botadmin
    cooldown: 10,
    credits: "CJ & Chico",
    execute: function(api, event, args, commands) {
        const text = args.join(" ");
        if (!text) {
            return api.sendMessage("❓| Please provide text to paste in Pastebin.", event.threadID, event.messageID);
        }

        const api_dev_key = 'qz8wc7LpZGcthCk7--FFG_ajbwQWq08d'; // your api_developer_key
        const api_paste_code = text;
        const api_paste_private = '1'; // 0=public 1=unlisted 2=private
        const api_paste_name = 'user_paste'; // name or title of your paste
        const api_paste_expire_date = '10Y';
        const api_paste_format = 'text';
        const api_user_key = ''; // if an invalid or expired api_user_key is used, an error will spawn. If no api_user_key is used, a guest paste will be created

        const url = 'https://pastebin.com/api/api_post.php';

        const data = new URLSearchParams({
            api_dev_key: api_dev_key,
            api_paste_code: api_paste_code,
            api_paste_private: api_paste_private,
            api_paste_name: api_paste_name,
            api_paste_expire_date: api_paste_expire_date,
            api_paste_format: api_paste_format,
            api_user_key: api_user_key,
            api_option: 'paste'
        }).toString();

        api.sendMessage("🔄| Creating paste...", event.threadID, event.messageID);

            

            axios.post(url, data, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            })
            .then(response => {
                if (response.data.startsWith('Bad API request')) {
                    throw new Error(response.data);
                }

                const rawUrl = response.data.replace('https://pastebin.com/', 'https://pastebin.com/raw/');
                const successMessage = `✅ | Generated Link Success!\nUrl: ${rawUrl}`;
                api.sendMessage(successMessage, event.threadID, event.messageID);
            })
            .catch(error => {
                console.error("Error creating paste:", error);
                api.sendMessage(`❌| Error: ${error.message}`, event.threadID, event.messageID);
            });
    }
};
