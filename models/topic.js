const connection = require("../db/connection");

const fetchAllTopics = () => {
  return connection
    .select("*")
    .from("topics")
    .then((topic) => {
      return topic;
    });
};

module.exports = {
  fetchAllTopics,
};
