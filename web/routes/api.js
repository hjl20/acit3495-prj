const express = require("express");
const router = express.Router();
const db = require("../db/mysqldb.js");

router.get("/grades", async (req, res) => {
  try {
    const grades = await db("grades");
    res.json(grades);
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
