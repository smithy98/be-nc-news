const apiRouter = require("express").Router();
const {
  topicRouter,
  userRouter,
  articleRouter,
  commentRouter,
} = require("./index");
const { getEndpoints } = require("../models/endpoints");
const { handle404s } = require("../errors");

apiRouter.route("/").get(getEndpoints);

apiRouter.use("/topics", topicRouter);

apiRouter.use("/users", userRouter);

apiRouter.use("/articles", articleRouter);

apiRouter.use("/comments", commentRouter);

apiRouter.use(handle404s);

module.exports = apiRouter;
