//finite state machine
const methods = require("./responses");

class Node {
    constructor(index, method, parent, item) {
        this.index = index;
        this.method = method;
        this.item = item;
        this.parent = parent;
        this.children = {};
    }

    addChild(index, method, item) {
        let newNode = new Node(index, method, this, item);
        newNode.parent.children[index] = newNode;
        return newNode;
    }

    removeChildren() {
        this.children = {};
    }
}

class Fnm {
    constructor() {
        this.root = new Node("root", methods.name, null);
        this.greeting = this.root.addChild("greeting", methods.greeting);
        this.start = this.greeting.addChild("start", methods.start);
        this.cancelOrder = this.start.addChild(0, methods.cancelOrder);
        this.listItem = this.start.addChild(1, methods.listItem);
        this.checkout = this.start.addChild(99, methods.checkout);
        this.orderHistory = this.start.addChild(98, methods.orderHistory);
        this.currentOrder = this.start.addChild(97, methods.currentOrder);
    }
}

module.exports = Fnm;