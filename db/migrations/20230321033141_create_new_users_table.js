/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

// with jsonb type, we can search through json and make queries on it just like in MongoDB or DynamoDB
// postgres is great. It can now do what NoSQL databases do and you can write complex queries to do complex analytics if need be.
// We get this as well as the advantage of making join tables which you can't do in NoSQL.

exports.up = function (knex) {
  return knex.schema.createTable("users", (table) => {
    table.increments("id").primary();
    table.string("username").index();
    table.string("hashed_password");
    table.string("email");
    // table.jsonb("query");
    table.timestamps(true, true);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable("users");
};
