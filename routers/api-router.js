const apiRouter = require("express").Router();
const {
  topicRouter,
  userRouter,
  articleRouter,
  commentRouter,
} = require("./index");

apiRouter.use("/topics", topicRouter);

apiRouter.use("/users", userRouter);

apiRouter.use("/articles", articleRouter);

apiRouter.use("/comments", commentRouter);

module.exports = apiRouter;
