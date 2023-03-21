/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async (knex) => {
  await knex("users").del();
  await knex("users").insert([
    { username: "leo", password_hash: "leo_password", email: "leo@gmail.com" },
    {
      username: "mark",
      password_hash: "mark_password",
      email: "mark@gmail.com",
    },
    { username: "tom", password_hash: "tom_password", email: "tom@gmail.com" },
  ]);
};
