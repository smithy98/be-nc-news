const topicRouter = require("express").Router();
const { getAllTopics } = require("../controllers/topic");
const { handle405s, handle404s } = require("../errors");

topicRouter.route("/").get(getAllTopics).all(handle405s);

topicRouter.use(handle404s);

module.exports = topicRouter;
