const express = require("express");
const app = express();
const cors = require("cors");
const apiRouter = require("./routers/api-router");
const { handlePSQLError, handleCustom } = require("./errors");

app.use(cors());

app.use(express.json());

app.use("/api", apiRouter);

app.use(handlePSQLError);

app.use(handleCustom);

module.exports = app;
