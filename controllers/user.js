const { fetchUserById } = require("../models/user");

const getUserById = (req, res, next) => {
  fetchUserById(req.params.username).then((userObj) => {
    res.status(200).send(userObj);
  });
};

module.exports = {
  getUserById,
};
