const apiRouter = require("express").Router();
const {
  topicRouter,
  userRouter,
  articleRouter,
  commentRouter,
} = require("./index");
const { getEndpoints } = require("../models/endpoints");

apiRouter.route("/").get(getEndpoints);

apiRouter.use("/topics", topicRouter);

apiRouter.use("/users", userRouter);

apiRouter.use("/articles", articleRouter);

apiRouter.use("/comments", commentRouter);

module.exports = apiRouter;
