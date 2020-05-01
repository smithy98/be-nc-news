const {
  fetchCommentsById,
  addComment,
  modifyComment,
  removeComment,
} = require("../models/comment");

exports.getComments = (req, res, next) => {
  const { params, query } = req;
  fetchCommentsById(params, query)
    .then((comments) => {
      res.status(200).send({ comments });
    })
    .catch(next);
};

exports.postComment = (req, res, next) => {
  const { article_id } = req.params;
  const newBody = req.body;
  newBody.article_id = parseInt(article_id);
  newBody.author = newBody.username;
  delete newBody.username;

  addComment(newBody)
    .then((comment) => {
      res.status(201).send({ comment });
    })
    .catch(next);
};

exports.patchComment = (req, res, next) => {
  const { body, params } = req;
  modifyComment(body, params)
    .then((comment) => {
      res.status(200).send({ comment });
    })
    .catch(next);
};

exports.deleteComment = (req, res, next) => {
  const { params } = req;
  removeComment(params)
    .then(() => {
      res.status(204).send();
    })
    .catch(next);
};
