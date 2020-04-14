exports.up = function (knex) {
  console.log("Creating topic table...");
  return knex.schema.createTable("topics", (topicTables) => {
    topicTables.string("slug").primary();
    topicTables.text("description");
  });
};

exports.down = function (knex) {
  console.log("Dropping topic table...");
  return knex.schema.dropTable("topics");
};
