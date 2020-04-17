const articleRouter = require("express").Router();
const {
  getArticleById,
  patchArticleById,
  getAllArticles,
} = require("../controllers/article");
const { postComment, getComments } = require("../controllers/comment");
const { handle405s } = require("../errors");

articleRouter.route("/").get(getAllArticles).all(handle405s);

articleRouter
  .route("/:article_id")
  .get(getArticleById)
  .patch(patchArticleById)
  .all(handle405s);

articleRouter
  .route("/:article_id/comments")
  .get(getComments)
  .post(postComment)
  .all(handle405s);

module.exports = {
  articleRouter,
};
