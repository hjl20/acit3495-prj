const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const db = require("../db/db.js");
const mongodb = require("../db/mongodb.js")

// Routes
router.get('/', function(req, res) {
  res.render('pages/index');
});

// router.get('/results', function(req, res) {
//   // TODO: get req to python backend to fetch stats/results
//   // statistics = get from backend api
//   // res.render('pages/results', {
//   //  statistics: stats
//   // });
//   const statistics = {stat1: "hi", stat2: "guy", stat3: "guy", stat4: "guy"}
//   res.render('pages/results', {statistics: statistics});
// });

// Fetch grades from MongoDB
router.get("/results", async function (req, res) {
  try {

    // Ensure the database is connected
    if (mongoose.connection.readyState) {
      console.log("Connection ready");
    }

    const statisticsCollection = mongodb.collection("statistics"); // Access the collection
    if (!statisticsCollection) {
      throw new Error("Could not find statistics collection.");
    }
     // Fetch only id and grade, excluding create_at
     const statistics = await statisticsCollection.find({}, { projection: { id: 1, grade: 1 } }).toArray();

    res.render("pages/results", { statistics }); // Pass the retrieved data to frontend
  } catch (err) {
    console.error("Error fetching statistics:", err);
    res.status(500).send("Failed to retrieve statistics.");
  }
});


// Render the submit form page
router.get('/submit', function(req, res) {
  res.render('pages/submit'); // Renders submit.ejs (where users will input grades)
});

// POST data to MySQL using Knex
router.post('/submit', function(req, res) {
  const { grade } = req.body;
  
  // Insert data into 'grades' table
  db('grades')
    .insert({ 
      grade,
      created_at: Math.floor(Date.now() / 1000) // Unix timestamp in seconds
    })
    .then(() => {
      console.log("Grade inserted successfully");
      res.send("Data saved to database.");
    })
    .catch(err => {
      console.error("Error inserting grade:", err);
      res.status(500).send("Failed to save data.");
    });
});

module.exports = router;