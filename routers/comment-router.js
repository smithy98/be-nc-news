const commentRouter = require("express").Router();
const { patchComment, deleteComment } = require("../controllers/comment");
const { handle405s, handle404s } = require("../errors");

commentRouter
  .route("/:comment_id")
  .patch(patchComment)
  .delete(deleteComment)
  .all(handle405s);

commentRouter.use(handle404s);

module.exports = commentRouter;
