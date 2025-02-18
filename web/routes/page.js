const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
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

    const gradeCollection = mongodb.collection("grades"); // Access the grades collection
    const minmaxCollection = mongodb.collection("statistics"); // Access the statistics collection

    // Fetch only id and grade, excluding create_at
    const gradeStats = await gradeCollection.find({}, { projection: { id: 1, grade: 1 } }).toArray();
    // Fetch the latest min-max grade values based on the highest _id
    const minmaxStats = await minmaxCollection.find().sort({ _id: -1 }).limit(1).toArray();

    let minGrade = "N/A";
    let maxGrade = "N/A";

    if (minmaxStats.length > 0) {
      minGrade = minmaxStats[0].min_grade;
      maxGrade = minmaxStats[0].max_grade;
    }

    // Pass statistics + min-max values to the view
    res.render("pages/results", { gradeStats, minGrade, maxGrade });
  } catch (err) {
    console.error("Error fetching statistics:", err);
    res.status(500).send("Failed to retrieve statistics.");
  }
});

// Render the submit form page
router.get('/submit', function(req, res) {
  res.render('pages/submit');
});

module.exports = router;