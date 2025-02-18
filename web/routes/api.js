const express = require("express");
const router = express.Router();
const db = require("../db/mysqldb.js");

// POST data to MySQL using Knex
router.post('/submit', function(req, res) {
  const { grade } = req.body;
  
  console.log("Received grade:", grade); // Log received grade
  
  if (!grade) {
    return res.status(400).json({ success: false, message: "Grade is required." });
  }

  // Insert data into 'grades' table
  db('grades')
    .insert({ 
      grade,
      created_at: Math.floor(Date.now() / 1000) // Unix timestamp in seconds
    })
    .then(() => {
      console.log("Grade inserted successfully");
      res.json({ success: true, message: "Grade inserted successfully" });
    })
    .catch(err => {
      console.error("Error inserting grade:", err);
      res.status(500).json({ success: false, message: "Failed to save data." });
    });
});

module.exports = router;
