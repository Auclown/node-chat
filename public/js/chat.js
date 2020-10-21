const socket = io();

const events = {
  sendMessage: "sendMessage",
  sendLocation: "sendLocation",
};

socket.on(events.sendMessage, (message) => {
  console.log(message);
});

document.querySelector("#message-form").addEventListener("submit", (e) => {
  e.preventDefault();

  const message = e.target.elements.message.value;

  socket.emit(events.sendMessage, message);
});

document.querySelector("#send-location").addEventListener("click", () => {
  if (!navigator.geolocation) {
    return alert("Your browser does not support geolocation.");
  }

  navigator.geolocation.getCurrentPosition((position) => {
    socket.emit(events.sendLocation, {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
    });
  });
});
