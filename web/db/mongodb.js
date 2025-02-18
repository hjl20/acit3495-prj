const mongoose = require("mongoose");

const {
  MONGO_HOST,
  MONGO_INITDB_ROOT_USERNAME,
  MONGO_INITDB_ROOT_PASSWORD,
  MONGO_INITDB_DATABASE,
  MONGO_PORT,
} = process.env;

// MongoDB connection string
const mongoURI = `mongodb://${MONGO_INITDB_ROOT_USERNAME}:${MONGO_INITDB_ROOT_PASSWORD}@${MONGO_HOST}:${MONGO_PORT}/${MONGO_INITDB_DATABASE}?authSource=admin`;

mongoose.connect(mongoURI);

const mongodb = mongoose.connection;

mongodb.on("error", console.error.bind(console, "MongoDB connection error:"));
mongodb.once("open", () => {
  console.log("Connected to MongoDB");
});

module.exports = mongodb;
