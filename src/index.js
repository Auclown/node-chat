const express = require("express");
const path = require("path");
const http = require("http");
const socketio = require("socket.io");

const events = require("../config/strings");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const port = process.env.PORT || 3000;
const publicDirectoryPath = path.join(__dirname, "../public");

app.use(express.static(publicDirectoryPath));

io.on("connection", (socket) => {
  console.log("New connection detected");

  socket.emit(events.sendMessage, "Welcome!");
  socket.broadcast.emit(events.sendMessage, "A new user has joined.");

  socket.on(events.sendMessage, (message) => {
    io.emit(events.sendMessage, message);
  });

  socket.on(events.sendLocation, (coords) => {
    io.emit(
      events.sendMessage,
      `https://google.com/maps?q=${coords.latitude},${coords.longitude}`
    );
  });

  socket.on(events.disconnect, () => {
    io.emit(events.sendMessage, "A user has left.");
  });
});

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
