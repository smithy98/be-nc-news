const userRouter = require("express").Router();
const { getUserByUsername, getAllUsers } = require("../controllers/user");
const { handle405s, handle404s } = require("../errors");

userRouter.route("/").get(getAllUsers).all(handle405s);

userRouter.route("/:username").get(getUserByUsername).all(handle405s);

userRouter.use(handle404s);

module.exports = userRouter;
