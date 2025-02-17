const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const db = require("../db/mysqldb.js");
const mongodb = require("../db/mongodb.js")

// Routes
router.get('/', function(req, res) {
  res.render('pages/index');
});

// Fetch grades from MongoDB
router.get("/results", async function (req, res) {
  try {

    // Ensure the database is connected
    if (mongoose.connection.readyState) {
      console.log("Connection ready");
    }

    const statisticsCollection = mongodb.collection("statistics"); // Access the collection
    const gradeStatisticsCollection = mongodb.collection("grade_statistics"); // Access the grade statistics collection

    // Fetch only id and grade, excluding create_at
    const statistics = await statisticsCollection.find({}, { projection: { id: 1, grade: 1 } }).toArray();
    // Fetch the latest min-max grade values based on the highest _id
    const latestStats = await gradeStatisticsCollection.find().sort({ _id: -1 }).limit(1).toArray();

    let minGrade = "N/A";
    let maxGrade = "N/A";

    if (latestStats.length > 0) {
      minGrade = latestStats[0].min_grade;
      maxGrade = latestStats[0].max_grade;
    }

    // Pass statistics + min-max values to the view
    res.render("pages/results", { statistics, minGrade, maxGrade });
  } catch (err) {
    console.error("Error fetching statistics:", err);
    res.status(500).send("Failed to retrieve statistics.");
  }
});

// Render the submit form page
router.get('/submit', function(req, res) {
  res.render('pages/submit');
});

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