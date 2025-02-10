const express = require("express");
const router = express.Router();

// Routes
router.get('/', function(req, res) {
  res.render('pages/index');
});

router.get('/results', function(req, res) {
  // TODO: get req to python backend to fetch stats/results
  // statistics = get from backend api
  // res.render('pages/results', {
  //  statistics: stats
  // });
  const statistics = {stat1: "hi", stat2: "guy", stat3: "guy", stat4: "guy"}
  res.render('pages/results', {statistics: statistics});
});

module.exports = router;