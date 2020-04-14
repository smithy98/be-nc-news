const ENV = process.env.NODE_ENV || "development";

const baseConfig = {
  client: "pg",
  migrations: {
    directory: "./db/migrations",
  },
  seeds: {
    directory: "./db/seeds",
  },
};

const customConfig = {
  development: {
    connection: {
      database: "nc_news",
      user: "dan",
      password: "1234",
    },
  },
  test: {
    connection: {
      database: "nc_news_test",
      user: "dan",
      password: "1234",
    },
  },
};

module.exports = { ...customConfig[ENV], ...baseConfig };
