const connection = require("../db/connection");

exports.fetchAllUsers = () => {
  return connection("users")
    .select("*")
    .then((users) => {
      return users;
    });
};

exports.fetchUserByUsername = (username) => {
  return connection("users")
    .select("*")
    .where("username", username)
    .then(([user]) => {
      return user;
    });
};

exports.checkUsername = (username) => {
  if (!username) return null;
  return connection("users")
    .select("*")
    .where("username", username)
    .then(([user]) => {
      if (user) return true;
      return false;
    });
};
