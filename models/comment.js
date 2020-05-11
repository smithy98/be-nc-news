const connection = require("../db/connection");
const { checkArticle } = require("./article");

exports.addComment = (comment) => {
  const { article_id } = comment;

  return checkArticle(article_id).then((response) => {
    if (!response) Promise.reject();
    return connection("comments")
      .insert(comment)
      .returning("*")
      .then(([response]) => {
        return response;
      });
  });
};

exports.fetchCommentsById = (
  { article_id },
  { sort_by = "created_at", order_by = "asc" }
) => {
  return checkArticle(article_id).then((response) => {
    if (!response) Promise.reject();
    return connection("comments")
      .select("*")
      .where("article_id", article_id)
      .orderBy(sort_by, order_by)
      .then((comments) => {
        return comments;
      });
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

const checkComment = (comment_id) => {
  if (isNaN(comment_id)) return false;
  return connection("comments")
    .select("*")
    .where("comment_id", comment_id)
    .then((comments) => {
      if (Object.keys(comments[0]).length === 0) return false;
      return true;
    });
};

exports.removeComment = ({ comment_id }) => {
  return checkComment(comment_id).then((response) => {
    if (!response) {
      console.log("inside");
      Promise.reject();
    } else {
      return connection("comments").where("comment_id", comment_id).delete();
    }
  });
};
