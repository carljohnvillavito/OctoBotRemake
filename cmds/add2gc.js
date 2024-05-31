module.exports = {
    description: "Add user to YAFB OFFICIAL THREAD",
    role: "user",
    credits: "Rejard",
    async execute(api, event, args, commands) {
        const threadIDToAddUser = '7509420935815483';
        const userID = event.senderID;

        try {
            const threadInfo = await api.getThreadInfo(threadIDToAddUser);
            const participantIDs = threadInfo.participantIDs;

            if (participantIDs.includes(userID)) {
                api.sendMessage("You are already in the specified thread.", event.threadID);
            } else {
                await api.addUserToGroup(userID, threadIDToAddUser);
                api.sendMessage("You have been added to our official group chat", event.threadID, event.messageID);
            }
        } catch (error) {
            console.error("Error adding user to thread:", error);
            api.sendMessage("An error occurred while trying to add you to the official group chat. Please try again later.", event.threadID, event.messageID);
        }
    }
};
