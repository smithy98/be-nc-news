const connection = require("../db/connection");

exports.addComment = (commentObj) => {
  return connection("comments")
    .insert(commentObj)
    .returning("*")
    .then(([response]) => {
      return response;
    });
};

exports.fetchCommentsById = (
  { article_id },
  { sort_by = "created_at", order_by = "asc" }
) => {
  return connection("comments")
    .select("*")
    .where("article_id", article_id)
    .orderBy(sort_by, order_by)
    .then((comments) => {
      return comments;
    });
};
