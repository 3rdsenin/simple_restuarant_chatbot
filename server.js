const path = require("path");
const http = require("http");
const express = require("express");
const socketio = require("socket.io");
const session = require("express-session");
const serverResponse = require("./modules/responses");
//Handle session data
const SessionData = require("./modules/sessionData");

require("dotenv").config();


const app = express();
const server = http.createServer(app);
const io = socketio(server);

//session middleware
const sessionMiddleware = session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    store: null,
    cookie: { maxAge: 24 * 60 * 60 * 1000 * 14 },
});

// Set static folder
app.use(express.static(path.join(__dirname, "public")));
app.use(sessionMiddleware);
io.engine.use(sessionMiddleware);

const botName = "Leslie";



let socketRoom = {};


// Run when client connects
io.on("connection", (socket) => {
    const session = socket.request.session;
    let sessionData;

    //group connection from different tabs
    //if a session already exists connect the user to that sessions room else create one and connect user to room
    if (socketRoom[session.id]) {
        socketRoom[session.id].sessionMessages.forEach((message) => {
            //update this
            socket.emit("server_says", message);
        });
        sessionData = socketRoom[session.id];
        socket.join(session.id);
    } else {
        sessionData = new SessionData(session, io);
        socketRoom[session.id] = sessionData;
        socket.join(session.id);
        serverResponse.response(null, sessionData);
    }
    //if the chat is at the beginning send greetings else send the user input
    socket.on("client_says", function(msg) {
        if (sessionData.currentNode.index === "greeting") {
            serverResponse.response(msg, sessionData);
            serverResponse.response(null, sessionData);
        } else {
            serverResponse.response(msg, sessionData);
        }

        //if currentNode has no child node, go back to start node
        if (!Object.keys(sessionData.currentNode.children).length) {
            sessionData.currentNode = sessionData.navigationTree.start;
            sessionData.listStartIndex = 0;
            io.to(session.id).emit(
                "server_says",
                serverResponse.response(null, sessionData)
            );
        }
    });

    socket.on("disconnect", () => {
        //if the room session ends
        if (!io.sockets.adapter.rooms.get(session.id)) {

            session.userName = sessionData.userName;
            session.orders = sessionData.orders;
            session.save();


            delete socketRoom[session.id];
        }
    });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));