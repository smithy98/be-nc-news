const connection = require("../db/connection");

exports.fetchAllArticles = ({
  sort_by = "articles.created_at",
  order_by = "asc",
  author,
  topic,
}) => {
  return connection("articles")
    .select("articles.*")
    .count("comments.article_id as comment_count")
    .leftJoin("comments", "articles.article_id", "comments.article_id")
    .groupBy("articles.article_id")
    .orderBy(sort_by, order_by)

    .modify((articleQuery) => {
      if (author) articleQuery.where(`articles.author`, author);
      if (topic) articleQuery.where("articles.topic", topic);
    })
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
