const chatForm = document.querySelector("#chat-form");
const chatMessages = document.querySelector(".chat-messages");
const roomName = document.querySelector("#room-name");
const roomUsers = document.querySelector("#users");

const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

const socket = io();

socket.emit("joinroom", { username, room });

socket.on("roomUsers", ({ room, users }) => {
  outputRoomName(room);
  outputRoomUsers(users);
});

socket.on("message", (message) => {
  outputMessage(message);
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

chatForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const msg = chatForm.msg.value.trim();

  socket.emit("chatMessage", msg);
  chatForm.reset();
});

function outputMessage(message) {
  const div = document.createElement("div");
  div.classList.add("message");
  div.innerHTML = `
    <p class="meta">${message.username} <span>${message.time}</span></p>
            <p class="text">
              ${message.text}
            </p>
    `;
  chatMessages.appendChild(div);
}

function outputRoomName(room) {
  roomName.textContent = room;
}

function outputRoomUsers(users) {
  roomUsers.innerHTML = "";
  for (const user of users) {
    const li = document.createElement("li");
    li.textContent = user.username;
    roomUsers.appendChild(li);
  }
}
