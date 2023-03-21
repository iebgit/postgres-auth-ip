const { get20LatestQueries } = require("../services/queries");

exports.getLast20Queries = async function (req, res, next) {
  const last20Queries = await get20LatestQueries();
  console.log(last20Queries);
  res.json(last20Queries);
};
