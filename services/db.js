const knexFile = require("../knexfile")[process.env.NODE_ENV || "development"];
exports.connection = require("knex")(knexFile);
