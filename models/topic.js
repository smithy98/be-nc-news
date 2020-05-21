const connection = require("../db/connection");

exports.fetchAllTopics = () => {
  return connection("topics")
    .select("*")
    .then((topics) => {
      return topics;
    });
};

exports.checkTopic = (slug) => {
  if (!slug) return true;
  return connection("topics")
    .select("*")
    .where("slug", slug)
    .then(([topic]) => {
      if (topic) return true;
      return Promise.reject({ status: 404, msg: "Topic Not Found" });
    });
};
