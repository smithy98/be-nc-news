const { fetchUserById } = require("../models/user");

const getUserById = (req, res, next) => {
  fetchUserById(req.params.username)
    .then((user) => {
      res.status(200).send({ user });
    })
    .catch(next);
};

module.exports = {
  getUserById,
};
