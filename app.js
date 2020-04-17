const express = require("express");
const app = express();
const { apiRouter } = require("./routers/api-router");
const { handlePSQLError } = require("./errors");

app.use(express.json());

app.use("/api", apiRouter);

app.use(handlePSQLError);

module.exports = app;
