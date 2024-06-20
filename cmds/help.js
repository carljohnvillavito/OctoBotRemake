module.exports = {
    description: "Show Commands and their descriptions",
    role: "user",
    octoPrefix: true,
    credits: "rejardgwapo",
    cooldown: 16,
    execute(api, event, args, commands) {
        let helpMessage = '𝙷𝚒! 𝙷𝚎𝚛𝚎 𝚊𝚛𝚎 𝚊𝚕𝚕 𝚝𝚑𝚎 𝚌𝚘𝚖𝚖𝚊𝚗𝚍𝚜 𝚒𝚗𝚜𝚝𝚊𝚕𝚕𝚎𝚍 𝚘𝚗 𝚝𝚑𝚒𝚜 𝚜𝚎𝚛𝚟𝚎𝚛\n';
        helpMessage += '•═══════════════•\n';
        
        commands.forEach((command, name) => {
            helpMessage += `𝙽𝚊𝚖𝚎: ${name}\n`;
            helpMessage += `𝙳𝚎𝚜𝚌𝚛𝚒𝚙𝚝𝚒𝚘𝚗: ${command.description || 'No description provided'}\n`;
            helpMessage += `𝚁𝚘𝚕𝚎: ${command.role || 'No role specified'}\n`;
            helpMessage += `Credits: ${command.credits || 'No credits provided'}\n`;
            helpMessage += `Cooldown: ${command.cooldown || 0} seconds\n`;
            helpMessage += '•═══════════════•\n';
        });

        helpMessage += `💬https://www.facebook.com/khdcrg`;

        api.sendMessage(helpMessage, event.threadID);
    }
};
