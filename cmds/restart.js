const axios = require('axios');
const fs = require('fs');
const path = require('path');

module.exports = {
    description: "Restart the server",
    role: "admin",
    cooldown: 3,
    async execute(api, event, args, commands) {
        const localPackagePath = path.resolve(__dirname, '../../package.json');
        const localPackage = JSON.parse(fs.readFileSync(localPackagePath, 'utf8'));
        const localVersion = localPackage.version;

        try {
            const response = await axios.get('https://raw.githubusercontent.com/CjsPortfolio/OctoBotRemake/main/package.json');
            const remotePackage = response.data;
            const remoteVersion = remotePackage.version;

            if (localVersion === remoteVersion) {
                api.sendMessage(`Current Version: ${localVersion}`, event.threadID);
            } else {
                api.sendMessage(`Repo Updating to version ${remoteVersion}...`, event.threadID);
                setTimeout(() => {
                    process.exit(1);
                }, 4000);
            }
        } catch (error) {
            console.error('Error fetching version:', error);
            api.sendMessage('Error checking version. Restarting the server...', event.threadID);
            setTimeout(() => {
                process.exit(1);
            }, 4000);
        }
    }
};
