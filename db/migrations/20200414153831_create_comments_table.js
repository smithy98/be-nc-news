exports.up = function (knex) {
  console.log("Creating comments table...");
  return knex.schema.createTable("comments", (commentTable) => {
    commentTable.increments("comment_id").primary();
    commentTable.string("author").references("users.username");
    commentTable.integer("article_id").references("articles.article_id");
    commentTable.integer("votes").default(0);
    commentTable.timestamp("created_at").defaultTo(knex.fn.now());
    commentTable.text("body");
  });
};

exports.down = function (knex) {
  console.log("Dropping comments table...");
  return knex.schema.dropTable("comments");
};
