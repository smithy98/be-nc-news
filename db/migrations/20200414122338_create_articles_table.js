exports.up = function (knex) {
  // console.log("Creating articles table...");
  return knex.schema.createTable("articles", (articleTable) => {
    articleTable.increments("article_id").primary();
    articleTable.string("title").notNullable();
    articleTable.text("body").notNullable();
    articleTable.integer("votes").defaultTo(0);
    articleTable.string("topic").references("topics.slug");
    articleTable.string("author").references("users.username");
    articleTable.timestamp("created_at").defaultTo(knex.fn.now());
  });
};

exports.down = function (knex) {
  // console.log("Dropping acticles table...");
  return knex.schema.dropTable("articles");
};
