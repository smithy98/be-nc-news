const { fetchUserById } = require("../models/user");

const getUserById = (req, res, next) => {
  fetchUserById(req.params.username)
    .then((user) => {
      // console.log(user);
      if (user) res.status(200).send({ user });
      else next(res);
    })
    .catch(next);
};

module.exports = {
  getUserById,
};
