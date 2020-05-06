exports.up = function (knex) {
  return knex.schema.createTable("users", (userTable) => {
    userTable.string("username").primary();
    userTable.text("avatar_url");
    userTable.string("name");
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("users");
};
