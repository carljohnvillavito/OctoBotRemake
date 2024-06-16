module.exports = {
    description: "Show Commands and the descriptions",
    role: "user",
    octoPrefix: true,
    credits: "rejardgwapo",
    cooldown: 16,		
    execute(api, event, args, commands) {
        // Convert commands to an array if it's not already a Map
        if (!(commands instanceof Map)) {
            commands = new Map(Object.entries(commands));
        }

        let helpMessage = '===> MAIN MENU <===\n';
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
