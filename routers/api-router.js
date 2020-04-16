const apiRouter = require("express").Router();
const { topicRouter } = require("./topic-router");
const { userRouter } = require("./user-router");
const { articleRouter } = require("./article-router");

apiRouter.use("/topics", topicRouter);

apiRouter.use("/users", userRouter);

apiRouter.use("/articles", articleRouter);

module.exports = {
  apiRouter,
};
