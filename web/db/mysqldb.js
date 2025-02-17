
const {
  MONGO_HOSTNAME, // set in docker env var
  MONGO_INITDB_ROOT_USERNAME,
  MONGO_INITDB_ROOT_PASSWORD,
  MONGO_INITDB_DATABASE,
  MONGO_PORT
} = process.env; // set from docker compose service env vars

const knex = require("knex");
const knexFile = require("../knexfile.js");

const environment = process.env.NODE_ENV || "development";

module.exports = knex(knexFile[environment]);