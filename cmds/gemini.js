const axios = require("axios");

module.exports = {
    description: "Talk to Gemini Pro Vision",
    role: "user",
    cooldown: 5,
    execute: async function(api, event, args) {
        let prompt = args.join(" ");

        if (!prompt) {
            api.sendMessage("🎓 | Please enter a prompt.", event.threadID);
            return;
        }

        api.sendTypingIndicator(event.threadID);
        api.sendMessage("Generating Prompt...", event.threadID, event.messageID);

        try {
            const geminiApi = `https://deku-rest-api-3ijr.onrender.com/gemini`;
            let apiEndpoint = `${geminiApi}?prompt=${encodeURIComponent(prompt)}`;

            if (event.type === "message_reply") {
                if (event.messageReply.attachments[0]?.type === "photo") {
                    const imageUrl = encodeURIComponent(event.messageReply.attachments[0].url);
                    apiEndpoint += `&url=${imageUrl}`;
                } else {
                    api.sendMessage('Please reply to an image.', event.threadID);
                    return;
                }
            }

            const response = await axios.get(apiEndpoint);

            if (response.status === 200 && response.data.gemini) {
                const formattedResponse = formatFont(response.data.response);
                api.sendMessage(`🎓 𝐆𝐞𝐦𝐢𝐧𝐢 (𝐀𝐈)\n\n🖋️ ${formattedResponse}`, event.threadID, event.messageID);
            } else {
                api.sendMessage("❌ | Failed to generate a response from Gemini API.", event.threadID);
            }
        } catch (error) {
            console.error(error);
            api.sendMessage("❌ | An error occurred. You can try typing your query again or resending it. There might be an issue with the server that's causing the problem, and it might resolve on retrying.", event.threadID);
        }
    }
};

function formatFont(text) {
    const fontMapping = {
        a: "𝚊", b: "𝚋", c: "𝚌", d: "𝚍", e: "𝚎", f: "𝚏", g: "𝚐", h: "𝚑", i: "𝚒", j: "𝚓", k: "𝚔", l: "𝚕", m: "𝚖",
        n: "𝚗", o: "𝚘", p: "𝚙", q: "𝚚", r: "𝚛", s: "𝚜", t: "𝚝", u: "𝚞", v: "𝚟", w: "𝚠", x: "𝚡", y: "𝚢", z: "𝚣",
        A: "𝙰", B: "𝙱", C: "𝙲", D: "𝙳", E: "𝙴", F: "𝙵", G: "𝙶", H: "𝙷", I: "𝙸", J: "𝙹", K: "𝙺", L: "𝙻", M: "𝙼",
        N: "𝙽", O: "𝙾", P: "𝙿", Q: "𝚀", R: "𝚁", S: "𝚂", T: "𝚃", U: "𝚄", V: "𝚅", W: "𝚆", X: "𝚇", Y: "𝚈", Z: "𝚉"
    };

    let formattedText = "";
    for (const char of text) {
        if (char === ' ') {
            formattedText += ' ';
        } else if (char in fontMapping) {
            formattedText += fontMapping[char];
        } else {
            formattedText += char;
        }
    }

    return formattedText;
}
