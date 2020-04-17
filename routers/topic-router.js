const topicRouter = require("express").Router();
const { getAllTopics } = require("../controllers/topic");
const { handle405s } = require("../errors");

topicRouter.route("/").get(getAllTopics).all(handle405s);

module.exports = topicRouter;
