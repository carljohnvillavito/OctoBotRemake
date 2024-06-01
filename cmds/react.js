function randomEmoji() {
    const emoji = [
        "👍",
        "✅",
        "🤩",
        "❤️",
        "🤙",
        "🖕"
    ];
    const emran = Math.floor(Math.random() * emoji.length);
    return emoji[emran];
}

module.exports = {
    role: "user",
    cooldown: 2,
    execute(api, event) {
        const randomMsg = randomEmoji();
        api.setMessageReaction(randomMsg, event.messageID, (err) => {
            if (err) {
                console.error('Error setting message reaction:', err);
            }
        }, true);
    }
};
