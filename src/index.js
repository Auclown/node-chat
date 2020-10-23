const express = require("express");
const path = require("path");
const http = require("http");
const socketio = require("socket.io");
const Filter = require("bad-words");

const { generateMessage, generateLocation } = require("./utils/messages");
const {
  connection,
  sendMessage,
  sendLocation,
  locationMessage,
  disconnect,
} = require("../config/strings");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const port = process.env.PORT || 3000;
const publicDirectoryPath = path.join(__dirname, "../public");

app.use(express.static(publicDirectoryPath));

io.on(connection, (socket) => {
  console.log("New connection detected");

  socket.emit(sendMessage, generateMessage("Welcome!"));

  socket.broadcast.emit(sendMessage, "A new user has joined.");

  socket.on(sendMessage, (message, callback) => {
    const filter = new Filter();

    if (filter.isProfane(message)) {
      return callback("Profanity is not allowed");
    }

    io.emit(sendMessage, generateMessage(message));
    callback();
  });

  socket.on(sendLocation, (coords, callback) => {
    io.emit(
      locationMessage,
      generateLocation(
        `https://google.com/maps?q=${coords.latitude},${coords.longitude}`
      )
    );
    callback();
  });

  socket.on(disconnect, () => {
    io.emit(sendMessage, generateMessage("A user has left."));
  });
});

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
