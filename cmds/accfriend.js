const moment = require("moment-timezone");

module.exports = {
    description: "Accept or delete friend requests",
    role: "user", // or admin botadmin
    cooldown: 8,
    octoPrefix: true, // or false
    execute: async function(api, event, args, commands) {
        if (!args.length) {
            return api.sendMessage("Usage: {PREFIX}accfriend <add|del> <target number|\"all\">", event.threadID, event.messageID);
        }

        const action = args[0].toLowerCase();
        if (!['add', 'del'].includes(action)) {
            return api.sendMessage("Please select <add | del> <target number | or \"all\">", event.threadID, event.messageID);
        }

        const form = {
            av: api.getCurrentUserID(),
            fb_api_caller_class: "RelayModern",
            variables: {
                input: {
                    source: "friends_tab",
                    actor_id: api.getCurrentUserID(),
                    client_mutation_id: Math.round(Math.random() * 19).toString()
                },
                scale: 3,
                refresh_num: 0
            }
        };

        if (action === "add") {
            form.fb_api_req_friendly_name = "FriendingCometFriendRequestConfirmMutation";
            form.doc_id = "3147613905362928";
        } else {
            form.fb_api_req_friendly_name = "FriendingCometFriendRequestDeleteMutation";
            form.doc_id = "4108254489275063";
        }

        const listRequestForm = {
            av: api.getCurrentUserID(),
            fb_api_req_friendly_name: "FriendingCometFriendRequestsRootQueryRelayPreloader",
            fb_api_caller_class: "RelayModern",
            doc_id: "4499164963466303",
            variables: JSON.stringify({ input: { scale: 3 } })
        };

        const listRequestResponse = await api.httpPost("https://www.facebook.com/api/graphql/", listRequestForm);
        const listRequest = JSON.parse(listRequestResponse).data.viewer.friending_possibilities.edges;

        let targetIDs = args.slice(1);

        if (targetIDs[0] === "all") {
            targetIDs = [];
            for (let i = 1; i <= listRequest.length; i++) targetIDs.push(i);
        }

        const success = [];
        const failed = [];
        const newTargetIDs = [];
        const promiseFriends = [];

        for (const stt of targetIDs) {
            const u = listRequest[parseInt(stt) - 1];
            if (!u) {
                failed.push(`Can't find index ${stt} in the list`);
                continue;
            }
            form.variables.input.friend_requester_id = u.node.id;
            form.variables = JSON.stringify(form.variables);
            newTargetIDs.push(u);
            promiseFriends.push(api.httpPost("https://www.facebook.com/api/graphql/", form));
            form.variables = JSON.parse(form.variables);
        }

        for (let i = 0; i < newTargetIDs.length; i++) {
            try {
                const friendRequest = await promiseFriends[i];
                if (JSON.parse(friendRequest).errors) {
                    failed.push(newTargetIDs[i].node.name);
                } else {
                    success.push(newTargetIDs[i].node);
                }
            } catch (e) {
                failed.push(newTargetIDs[i].node.name);
            }
        }

        if (success.length > 0) {
            let successMessage = `A account has been successfully ${action === 'add' ? 'added' : 'deleted'}, the following are the users:\n\n`;
            success.forEach(user => {
                successMessage += `>============<\nName: ${user.name}\nLink: ${user.url.replace("www.facebook", "fb")}\n>============<\n`;
            });

            if (failed.length > 0) {
                successMessage += `\n» The following ${failed.length} people encountered errors: ${failed.join("\n")}`;
            }

            api.sendMessage(successMessage, event.threadID, event.messageID);
        } else {
            return api.sendMessage("Invalid response. Please provide a valid response.", event.threadID, event.messageID);
        }
    }
};
