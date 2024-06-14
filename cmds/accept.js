module.exports = {
    description: "Automatically accept pending threads",
    role: "admin",
    credits: "Admin",
   cooldown: 1, 
    async execute(api, event, args, commands) {
        const list = [
            ...(await api.getThreadList(1, null, ['PENDING'])),
            ...(await api.getThreadList(1, null, ['OTHER']))
        ];
        if (list[0]) {
            list.forEach(thread => {
                api.sendMessage('This Group Chat has been approved by the admin to have access to this bot. Enjoy!', thread.threadID);
            });
           api.sendMessage("> Threads Accepted Successfully.", event.threadID, event.messageID);
        } else {
            api.sendMessage("> There are no pending thread requests.", event.threadID, event.messageID);
        }
    }
};
