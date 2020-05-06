const connection = require("../db/connection");

const fetchAllUsers = () => {
  return connection("users")
    .select("*")
    .then((users) => {
      return users;
    });
};

const fetchUserByUsername = (username) => {
  return connection
    .select("*")
    .where("username", username)
    .from("users")
    .then(([user]) => {
      return user;
    });
};

module.exports = {
  fetchUserByUsername,
  fetchAllUsers,
};
