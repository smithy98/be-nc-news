const userRouter = require("express").Router();
const { getUserById } = require("../controllers/user");
const { handle405s } = require("../errors");

userRouter.route("/:username").get(getUserById).all(handle405s);

module.exports = {
  userRouter,
};
