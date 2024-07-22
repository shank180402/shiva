let users = [];

const addUsers = ({ id, name, room }) => {
  console.log(id, name, room);
  if (!name || !room) {
    return { error: "Name and room are required" };
  }

  name = name.trim().toLowerCase();
  room = room.trim().toLowerCase();

  const existingUser = users.find(user => user.name === name && user.room === room);

  // if (existingUser) {
  //   return { error: "User already exists in this room" };
  // }

  const user = { id, name, room };
  users.push(user);

  return { user };
};

const removeUser = (id) => {
  const findIdx = users.findIndex(each => each.id === id);

  if (findIdx >= 0) {
    return users.splice(findIdx, 1)[0];
  }
};

const getUser = (id) => {
  return users.find(user => user.id === id);
};

const getRoomUsers = (room) => {
  return users.filter(e => e.room === room)
}


module.exports = {
  addUsers,
  removeUser,
  getUser,
  getRoomUsers,
};
