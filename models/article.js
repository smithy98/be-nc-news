const connection = require("../db/connection");

exports.fetchAllArticles = () => {
  return connection("articles")
    .select("articles.*")
    .count("comments.article_id as comment_count")
    .leftJoin("comments", "articles.article_id", "comments.article_id")
    .groupBy("articles.article_id")
    .orderBy("articles.created_at", "asc")
    .then((articles) => {
      return articles;
    });
};

exports.fetchArticleById = ({ article_id }) => {
  return connection("articles")
    .select("articles.*")
    .count("comments.article_id as comment_count")
    .leftJoin("comments", "articles.article_id", "comments.article_id")
    .groupBy("articles.article_id")
    .where("articles.article_id", article_id)
    .then(([article]) => {
      return article;
    });
};

exports.modifyArticleById = (article_id, inc_votes) => {
  return connection("articles")
    .select("votes")
    .where("article_id", article_id)
    .then(([response]) => {
      const { votes } = response;
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
