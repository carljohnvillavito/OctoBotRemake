module.exports = function handleFriendRequest(api, event, accept = true, callback = () => {}) {
    if (accept) {
        api.handleFriendRequest(event.from, true, callback);
    } else {
        api.handleFriendRequest(event.from, false, callback);
    }
};
