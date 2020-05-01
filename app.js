const express = require("express");
const app = express();
const apiRouter = require("./routers/api-router");
const { handlePSQLError, handle400s } = require("./errors");

app.use(express.json());

app.use("/api", apiRouter);

app.use(handlePSQLError);

app.use(handle400s);

module.exports = app;
