const NavigationTree = require("./fsm");

/* session data holds all the data*/
class SessionData {
    constructor(session, io) {
        (this.io = io),
        (this.session = session),
        (this.userName = session.userName || ""),
        (this.userID = session.id),
        (this.orders = session.orders || []),
        (this.navigationTree = new NavigationTree()),
        (this.currentNode = this.navigationTree.root),
        (this.curOrder = []),
        (this.listStartIndex = 0),
        (this.sessionMessages = []);
    }
}

module.exports = SessionData;