const { fetchArticleById, modifyArticleById } = require("../models/article");

exports.getArticleById = (req, res, next) => {
  fetchArticleById(req.params)
    .then(([response]) => {
      res.status(200).send(response);
    })
    .catch((err) => {
      next(err);
    });
};

exports.patchArticleById = (req, res, next) => {
  const {
    params: { article_id },
    body: { inc_votes },
  } = req;
  modifyArticleById(article_id, inc_votes).then((article) => {
    res.status(200).send({ article });
  });
};
