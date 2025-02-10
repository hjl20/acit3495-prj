
const {
  MONGO_HOSTNAME, // set in docker env var
  MONGO_INITDB_ROOT_USERNAME,
  MONGO_INITDB_ROOT_PASSWORD,
  MONGO_INITDB_DATABASE,
  MONGO_PORT
} = process.env; // set from docker compose service env vars

// const url = `mongodb://${MONGO_INITDB_ROOT_USERNAME}:${MONGO_INITDB_ROOT_PASSWORD}@${MONGO_HOSTNAME}:${MONGO_PORT}/${MONGO_INITDB_DATABASE}?authSource=admin`;
// const options = {
//   useNewUrlParser: true,
//   reconnectTries: Number.MAX_VALUE,
//   reconnectInterval: 500, 
//   connectTimeoutMS: 10000,
// };

// mongoose.connect(url, options).then(() => {
//   console.log('MongoDB is connected');
// }).catch((err) => {
//   console.log(err);
// });

const knex = require("knex");
const knexFile = require("../knexfile.js");

const environment = process.env.NODE_ENV || "development";

module.exports = knex(knexFile[environment]);