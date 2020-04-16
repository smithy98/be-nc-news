const connection = require("../db/connection");

const fetchUserById = (username) => {
  return connection
    .select("*")
    .where("username", username)
    .from("users")
    .then(([object]) => {
      return object;
    });
};

module.exports = {
  fetchUserById,
};
