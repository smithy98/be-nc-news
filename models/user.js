const connection = require("../db/connection");

const fetchUserById = (username) => {
  return connection
    .select("*")
    .where("username", username)
    .from("users")
    .then(([user]) => {
      return user;
    });
};

module.exports = {
  fetchUserById,
};
