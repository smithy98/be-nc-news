const connection = require("../db/connection");
const { checkArticle } = require("./article");

exports.addComment = (comment) => {
  const { article_id, body, author } = comment;

  return checkArticle(article_id).then((response) => {
    if (!response || !body || !author)
      return Promise.reject({ status: 400, msg: "Invalid Request" });
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
  { sort_by = "created_at", order = "desc" }
) => {
  return checkArticle(article_id).then((response) => {
    if (!response) Promise.reject();
    return connection("comments")
      .select("*")
      .where("article_id", article_id)
      .orderBy(sort_by, order)
      .then((comments) => {
        return comments;
      });
  });
};

exports.modifyComment = ({ inc_votes }, { comment_id }) => {
  if (isNaN(comment_id))
    return Promise.reject({ status: 400, msg: "Invalid Request" });
  if (!inc_votes) inc_votes = 0;
  if (isNaN(inc_votes))
    return Promise.reject({ status: 400, msg: "Invalid Request" });

  return connection("comments")
    .select("votes")
    .where("comment_id", comment_id)
    .then(([comment]) => {
      if (!comment)
        return Promise.reject({ status: 404, msg: "Comment Not Found" });
      const { votes } = comment;
      const newVotes = votes + inc_votes;

      return connection("comments")
        .where("comment_id", comment_id)
        .update("votes", newVotes)
        .returning("*");
    })
    .then(([comment]) => {
      return comment;
    });
};

const checkComment = (comment_id) => {
  if (isNaN(comment_id))
    return Promise.reject({ status: 400, msg: "Invalid Request" });
  return connection("comments")
    .select("*")
    .where("comment_id", comment_id)
    .then((comments) => {
      if (!comments[0])
        return Promise.reject({ status: 404, msg: "Comment Not Found" });
      return true;
    });
};

exports.removeComment = ({ comment_id }) => {
  return checkComment(comment_id).then((response) => {
    return connection("comments").where("comment_id", comment_id).delete();
  });
};
