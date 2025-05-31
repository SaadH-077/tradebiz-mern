import { Socket, Server } from "socket.io";
import http from "http";
import { app } from "./app.js";
import { config } from "dotenv";

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
    },
});

config({
    path: "./config.env",
});

io.on("connection", (socket) => {
    console.log("USER CONNECTED:", socket.id);

    socket.on("join_room", (data) => {
        socket.join(data);

        console.log("USER JOINED ROOM:", data);
    });

    socket.on("newOffer", (data) => {
        console.log("OFFER MADE:", data);

        io.to(data.offerForItem).emit("offer_made", data);
    });

    socket.on("leave_room", (data) => {
        socket.leave(data);

        console.log("USER LEFT ROOM:", data);
    });

});

server.listen(8000, () => {
    console.log("Server is running on port 8000");
});
