const handleFriendRequest = require('../handleFriendRequest'); // Adjust the path as needed

module.exports = {
    async handleEvent(api, event) {
        if (event.type === 'friend_request') {
            console.log(`Received a friend request from ${event.from}`);
            
            handleFriendRequest(api, event, true, (err) => {
                if (err) {
                    console.error(`Failed to accept friend request from ${event.from}: ${err}`);
                } else {
                    console.log(`Successfully accepted friend request from ${event.from}`);
                }
            });
        }
    }
};
