exports.up = function (knex) {
  console.log("Creating users table...");
  return knex.schema.createTable("users", (userTable) => {
    userTable.string("username").primary();
    userTable.text("avatar_url");
    userTable.string("name");
  });
};

exports.down = function (knex) {
  console.log("Dropping users table...");
  return knex.schema.dropTable("users");
};
