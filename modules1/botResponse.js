const response = (msg, sessionData) => {
    //sends message to front end and store in sessionData
    function sendMessage(sender, message) {
        let messageData = { sender, message };
        sessionData.sessionMessages.push(messageData);
        sessionData.io.to(sessionData.userID).emit("message", messageData);
    }

    let nextNode;
    if (!msg) {
        nextNode = sessionData.currentNode;
    } else {
        sendMessage("user", msg);

        if (sessionData.currentNode.index == "greeting") {
            nextNode = sessionData.currentNode;
            return sendMessage("bot", nextNode.method(sessionData, msg));
        } else {
            if (!sessionData.currentNode.children[msg]) {
                sendMessage("bot", ["invalid input"]); //sends invalid input message
                return sendMessage(
                    "bot",
                    sessionData.sessionMessages[sessionData.sessionMessages.length - 3]
                    .message
                ); //resends last bot message
            }
            nextNode = sessionData.currentNode.children[msg];
            sessionData.currentNode = nextNode;
        }
    }

    sendMessage("bot", nextNode.method(sessionData));
};

module.exports = {
    response,
};