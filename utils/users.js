const users = [];

function newUser(id, username, room) {
  const user = { id, username, room };

  users.push(user);
  return user;
}

function getCurrentUser(id) {
  return users.find((user) => user.id === id);
}

function removeUser(id) {
  const user = users.findIndex((user) => user.id == id);

  if (user !== -1) {
    return users.splice(user, 1)[0];
  }
}

function getRoomUsers(room) {
  return users.filter((user) => user.room === room);
}

module.exports = { newUser, getCurrentUser, removeUser, getRoomUsers };
