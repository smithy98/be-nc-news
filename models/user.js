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
      if (!user) return Promise.reject({ status: 404, msg: "User Not Found" });
      return user;
    });
};

// false if non-existent , true if existent || no user query

exports.checkUsername = (username) => {
  if (!username) return true;
  return connection("users")
    .select("*")
    .where("username", username)
    .then(([user]) => {
      if (user) return true;
      return Promise.reject({ status: 404, msg: "User Not Found" });
    });
};
