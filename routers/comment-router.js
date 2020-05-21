const commentRouter = require("express").Router();
const { patchComment, deleteComment } = require("../controllers/comment");
const { handle405s } = require("../errors");

commentRouter
  .route("/:comment_id")
  .patch(patchComment)
  .delete(deleteComment)
  .all(handle405s);

module.exports = commentRouter;
