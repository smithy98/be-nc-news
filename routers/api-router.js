const apiRouter = require("express").Router();
const {
  topicRouter,
  userRouter,
  articleRouter,
  commentRouter,
} = require("./index");
const { getEndpoints } = require("../models/endpoints");
const { handle405s, handle404s } = require("../errors");

apiRouter.route("/").get(getEndpoints).all(handle405s);

apiRouter.use("/topics", topicRouter);

apiRouter.use("/users", userRouter);

apiRouter.use("/articles", articleRouter);

apiRouter.use("/comments", commentRouter);

apiRouter.use("/:end", (err) => {
  next(err);
});

module.exports = apiRouter;
