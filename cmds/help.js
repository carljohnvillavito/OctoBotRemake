module.exports = {
    description: "Show Commands and the descriptions",
    role: "user",
    octoPrefix: true,
    credits: "rejardgwapo",
    cooldown: 16,		
    execute(api, event, args, commands) {
        let helpMessage = '𝙷𝚒! 𝙷𝚎𝚛𝚎 𝚊𝚛𝚎 𝚊𝚕𝚕 𝚝𝚑𝚎 𝚌𝚘𝚖𝚖𝚊𝚗𝚍𝚜 𝚒𝚗𝚜𝚝𝚊𝚕𝚕𝚎𝚍 𝚘𝚗 𝚝𝚑𝚒𝚜 𝚜𝚎𝚛𝚟𝚎𝚛\n';
        helpMessage += '•═══════════════•\n';
        commands.forEach((command, name) => {
            helpMessage += `𝙽𝚊𝚖𝚎: ${name}\n`;
            helpMessage += `𝙳𝚎𝚜𝚌𝚛𝚒𝚙𝚝𝚒𝚘𝚗: ${command.description}\n`;
            helpMessage += `𝚁𝚘𝚕𝚎: ${command.role}\n`;
            helpMessage += `Credits: ${command.credits}\n`;
        helpMessage += '•═══════════════•\n';
        });
        helpMessage += `💬https://facebook.com/carljohn.villavito`;
        helpMessage += `\n💬https://facebook.com/61557924257806`;
        api.sendMessage(helpMessage, event.threadID);
    }
};
