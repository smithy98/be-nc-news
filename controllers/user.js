const { fetchUserByUsername, fetchAllUsers } = require("../models/user");

const getAllUsers = (req, res, next) => {
  fetchAllUsers()
    .then((users) => {
      res.status(200).send({ users });
    })
    .catch(next);
};

const getUserByUsername = (req, res, next) => {
  fetchUserByUsername(req.params.username)
    .then((user) => {
      if (user) res.status(200).send({ user });
      else next(res);
    })
    .catch(next);
};

module.exports = {
  getUserByUsername,
  getAllUsers,
};
