const userRouter = require("express").Router();
const { getUserById } = require("../controllers/user");

userRouter.route("/:username").get(getUserById);

module.exports = {
  userRouter,
};
