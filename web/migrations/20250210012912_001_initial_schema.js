/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.withSchema(process.env.MYSQL_DATABASE).createTable("grades", (table) => {
    table.increments("id").primary();
    table.integer("grade").notNullable();
    table.bigInteger("created_at").notNullable(); // add timestamp column
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTableIfExists("grades");
};
