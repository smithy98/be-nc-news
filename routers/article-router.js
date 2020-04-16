const articleRouter = require("express").Router();
const { getArticleById } = require("../controllers/article");
const { patchArticleById } = require("../controllers/article");

articleRouter.route("/:article_id").get(getArticleById).patch(patchArticleById);

module.exports = {
  articleRouter,
};
