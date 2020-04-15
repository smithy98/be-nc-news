const express = require("express");
const app = express();
const { getAllTopics } = require("./controllers/topic");

app.use("/api", getAllTopics);

module.exports = app;
