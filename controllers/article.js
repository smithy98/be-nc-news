const {
  fetchAllArticles,
  fetchArticleById,
  modifyArticleById,
} = require("../models/article");

exports.getAllArticles = (req, res, next) => {
  fetchAllArticles()
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch(next);
};

exports.getArticleById = (req, res, next) => {
  fetchArticleById(req.params)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch(next);
};

exports.patchArticleById = (req, res, next) => {
  const {
    params: { article_id },
    body: { inc_votes },
  } = req;
  modifyArticleById(article_id, inc_votes)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch(next);
};
