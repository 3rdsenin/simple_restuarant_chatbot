const NavTree = require("./fnm");

class SessionData {
    constructor(session, io) {
        (this.io = io),
        (this.session = session),
        (this.userName = session.userName || ""),
        (this.userID = session.id),
        (this.orders = session.orders || []),
        (this.navTree = new NavTree()),
        (this.currentNode = this.navTree.root),
        (this.curOrder = []),
        (this.listStartIndex = 0),
        (this.sessionMessages = []);
    }
}

module.exports = SessionData;