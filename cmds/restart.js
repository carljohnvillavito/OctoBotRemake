module.exports = {
    description: "Restart the server",
    role: "admin",
    cooldown: 5,
    execute(api, event, args, commands) {
        api.sendMessage("Restarting Repo...", event.threadID, event.messageID);
        setTimeout(()=>{
            api.sendMessage("Successfully Rebooted Bot!", event.threadID);
            process.exit(1);
        }, 5000);
};
