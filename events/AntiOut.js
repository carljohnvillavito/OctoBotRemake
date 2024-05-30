module.exports = {
  async handleEvent(api, event) {
    if (event.logMessageData?.leftParticipantFbId === api.getCurrentUserID()) return;
    if (event.logMessageData?.leftParticipantFbId) {
      try {
        const info = await api.getUserInfo(event.logMessageData?.leftParticipantFbId);
        const { name } = info[event.logMessageData?.leftParticipantFbId];
        api.addUserToGroup(event.logMessageData?.leftParticipantFbId, event.threadID, (error) => {
          if (error) {
            api.sendMessage(`Unable to re-add member ${name} to the group!`, event.threadID);
          } else {
            api.sendMessage(`WALANG TATAKAS DITO SA GC NATO, ESPECIALLY IKAW, ${name}.\n HAHAHAHAHAHAHAHAHAHAHAHAHAHAHAHAHAHAHAHAHAHA`, event.threadID);
          }
        });
      } catch (error) {
        console.error("Error:", error);
      }
    }
  }
};
