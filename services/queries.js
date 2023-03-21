const { connection } = require("./db");

exports.storeQuery = async (query) =>
  await connection.insert({ query }).into("queries");

exports.get20LatestQueries = async () =>
  await connection("queries").orderBy("created_at", "desc");
