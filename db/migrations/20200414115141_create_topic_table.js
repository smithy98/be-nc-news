exports.up = function (knex) {
  return knex.schema.createTable("topics", (topicTables) => {
    topicTables.string("slug").primary();
    topicTables.text("description");
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("topics");
};
