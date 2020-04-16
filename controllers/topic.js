const { fetchAllTopics } = require("../models/topic");

const getAllTopics = (req, res, next) => {
  fetchAllTopics().then((topic) => {
    res.status(200).send({ topic });
  });
};

module.exports = {
  getAllTopics,
};
