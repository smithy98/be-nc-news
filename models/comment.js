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

exports.modifyComment = ({ inc_votes }, { comment_id }) => {
  return connection("comments")
    .select("votes")
    .where("comment_id", comment_id)
    .then(([comment]) => {
      const { votes } = comment;
      const newVotes = votes + inc_votes;

      return connection("comments")
        .where("comment_id", comment_id)
        .update("votes", newVotes)
        .returning("*");
    })
    .then(([article]) => {
      return article;
    });
};
