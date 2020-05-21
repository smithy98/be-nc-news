const apiRouter = require("express").Router();
const {
  topicRouter,
  userRouter,
  articleRouter,
  commentRouter,
} = require("./index");
const { getEndpoints } = require("../models/endpoints");
const { handle405s } = require("../errors");

apiRouter.route("/").get(getEndpoints).all(handle405s);

apiRouter.use("/topics", topicRouter);

apiRouter.use("/users", userRouter);

apiRouter.use("/articles", articleRouter);

apiRouter.use("/comments", commentRouter);

apiRouter.use("/:end", (req, res, next) => {
  next({ status: 404, msg: "Path Not Found" });
});

module.exports = apiRouter;
