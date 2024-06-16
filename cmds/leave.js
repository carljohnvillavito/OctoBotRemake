module.exports = {
    description: "Bot leave the group",
    role: "admin",
    octoPrefix: true,
    cooldown: 2,
    execute(api, event, args, commands) {
  try { 
  if (!args[0]) return api.removeUserFromGroup(api.getCurrentUserID(), event.threadID);
  if (!isNaN(args[0])) return api.removeUserFromGroup(api.getCurrentUserID(), args.join(" "));
    } catch (error) {
      api.sendMessage(error.message, event.threadID, event.messageID);
    }
}
};
