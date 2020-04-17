const commentRouter = require("express").Router();
const { patchComment } = require("../controllers/comment");
const { handle405s } = require("../errors");

commentRouter.route("/:comment_id").patch(patchComment).all(handle405s);

module.exports = commentRouter;
