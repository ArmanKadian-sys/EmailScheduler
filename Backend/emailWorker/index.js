import WebSocket from "ws";

const socket = new WebSocket("ws://localhost:3000/ws");

socket.on("open", () => {
    console.log("Connected to main server");

    socket.send("Worker server connected");
});

socket.on("message", (data) => {
    console.log("Message from main server:", data.toString());
});

socket.on("close", () => {
    console.log("Connection to main server closed");
});

socket.on("error", (err) => {
    console.error("WebSocket error:", err);
});