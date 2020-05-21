const connection = require("../db/connection");
const { checkTopic } = require("../models/topic");
const { checkUsername } = require("../models/user");

exports.fetchAllArticles = ({
  sort_by = "articles.created_at",
  order = "desc",
  author,
  topic,
}) => {
  return connection("articles")
    .select("articles.*")
    .count("comments.article_id as comment_count")
    .leftJoin("comments", "articles.article_id", "comments.article_id")
    .groupBy("articles.article_id")
    .orderBy(sort_by, order)

    .modify((articleQuery) => {
      if (author) articleQuery.where("articles.author", author);
      if (topic) articleQuery.where("articles.topic", topic);
    })
    .then((articles) => {
      if (articles.length === 0) {
        return Promise.all([
          articles,
          checkUsername(author),
          checkTopic(topic),
        ]);
      } else {
        return Promise.all([articles]);
      }
    })
    .then((arrayOfResponses) => {
      return arrayOfResponses[0];
    });
};

exports.fetchArticleById = ({ article_id }) => {
  if (isNaN(article_id)) {
    return Promise.reject({ status: 400, msg: "Invalid Request" });
  }
  return connection("articles")
    .select("articles.*")
    .count("comments.article_id as comment_count")
    .leftJoin("comments", "articles.article_id", "comments.article_id")
    .groupBy("articles.article_id")
    .where("articles.article_id", article_id)
    .then(([article]) => {
      if (article) return article;
      return Promise.reject({ status: 404, msg: "Article Not Found" });
    });
};

exports.modifyArticleById = (article_id, inc_votes) => {
  return connection("articles")
    .select("votes")
    .where("article_id", article_id)
    .then(([article]) => {
      const { votes } = article;
      const newVotes = votes + inc_votes;

      return connection("articles")
        .where("article_id", article_id)
        .update("votes", newVotes)
        .returning("*");
    })
    .then(([article]) => {
      return article;
    });
};

exports.checkArticle = (article_id) => {
  if (isNaN(article_id))
    return Promise.reject({ status: 400, msg: "Invalid Request" });
  return connection("articles")
    .select("articles.*")
    .count("comments.article_id as comment_count")
    .leftJoin("comments", "articles.article_id", "comments.article_id")
    .groupBy("articles.article_id")
    .where("articles.article_id", article_id)
    .then(([article]) => {
      if (article) return true;
      return Promise.reject({ status: 404, msg: "Article Not Found" });
    });
};
