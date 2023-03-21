module.exports = {
  development: {
    client: "postgresql",
    connection:
      process.env.DATABASE_URL ||
      "postgresql://<user>:<password>@localhost:<port>/<db>",
    migrations: {
      directory: "./db/migrations",
    },
  },
  production: {
    client: "postgresql",
    connection:
      process.env.DATABASE_URL ||
      "postgresql://<user>:<password>@localhost:<port>/<db>",
    migrations: {
      directory: "./db/migrations",
    },
  },
};
