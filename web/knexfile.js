// Update with your config settings.
const {
  MYSQL_HOSTNAME, // set in docker env var
  MYSQL_PORT,
  MYSQL_USER,
  MYSQL_PASSWORD,
  MYSQL_DATABASE
} = process.env;

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
module.exports = {
  development: {
    client: 'mysql2',
    connection: {
      host: MYSQL_HOSTNAME,
      port: MYSQL_PORT,
      user: MYSQL_USER,
      password: MYSQL_PASSWORD,
      database: MYSQL_DATABASE
    },
    migrations: {
      tableName: 'migrations',
      directory: './migrations'
    }
  }
};
