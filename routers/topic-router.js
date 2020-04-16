const topicRouter = require("express").Router();
const { getAllTopics } = require("../controllers/topic");

topicRouter.route("/").get(getAllTopics);

module.exports = {
  topicRouter,
};
