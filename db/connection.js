const ENV = process.env.NODE_ENV || "development";
const knex = require("knex");

console.log("->", process.env.DATABASE_URL);
const dbConfig =
  ENV === "production"
    ? { client: "pg", connection: process.env.DATABASE_URL }
    : require("../knexfile");

module.exports = knex(dbConfig);
