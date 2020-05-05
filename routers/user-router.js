const userRouter = require("express").Router();
const { getUserById, getAllUsers } = require("../controllers/user");
const { handle405s, handle404s } = require("../errors");

userRouter.route("/").get(getAllUsers).all(handle405s);

userRouter.route("/:username").get(getUserById).all(handle405s);

userRouter.use(handle404s);

module.exports = userRouter;
