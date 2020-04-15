const { fetchAllTopics } = require("../models/topic");

const getAllTopics = (req, res, next) => {
  fetchAllTopics();
};

module.exports = {
  getAllTopics,
};
