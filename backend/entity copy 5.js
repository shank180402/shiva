let users = [];

const addUsers = ({ id,uniqueId, name, room }) => {
  console.log(id,uniqueId, name, room);
  if (!uniqueId||!name || !room) {
    return { error: "Name and room are required" };
  }

  name = name.trim().toLowerCase();
  room = room.trim().toLowerCase();

  const existingUser = users.find((user) => user.uniqueId === uniqueId);

  // if (existingUser) {
  //   return { error: "User already exists in this room" };
  // }

  if (existingUser) {
    existingUser.id = id; // Update socket ID for existing user
    return { user: existingUser };
}

  const user = { id,uniqueId, name, room };
  users.push(user);

  return { user };
};

const removeUser = (uniqueId) => {
  const findIdx = users.findIndex(each => each.uniqueId === uniqueId);

  if (findIdx >= 0) {
    return users.splice(findIdx, 1)[0];
  }
};

const getUser = (id) => {
  return users.find((user) => user.id === id);
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
