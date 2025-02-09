
const port = process.env.WEB_PORT || 3000;

// Requiring module
const express = require("express");
const app = express();
app.set('view engine', 'ejs');


function authentication(req, res, next) {
  const authheader = req.headers.authorization;
  console.log(req.headers);

  if (!authheader) {
    let err = new Error('You are not authenticated!');
    res.setHeader('WWW-Authenticate', 'Basic');
    err.status = 401;
    return next(err)
  }

  const auth = new Buffer.from(authheader.split(' ')[1],
    'base64').toString().split(':');
  const user = auth[0];
  const pass = auth[1];

  // if (user == process.env.WEB_ADMIN && pass == WEB_PASSWORD) {
  if (user == "user" && pass == "pass") { // for testing
    // If Authorized user
    next();
  } else {
    let err = new Error('You are not authenticated!');
    res.setHeader('WWW-Authenticate', 'Basic');
    err.status = 401;
    return next(err);
  }
}

// First step is the authentication of the client
app.use(authentication)

// Routes
app.get('/', function(req, res) {
  res.render('pages/index');
});

app.get('/results', function(req, res) {
  // TODO: get req to python backend to fetch stats/results
  // statistics = get from backend api
  // res.render('pages/results', {
  //  statistics: stats
  // });
  const statistics = {stat1: "hi", stat2: "guy", stat3: "guy", stat4: "guy"}
  res.render('pages/results', {statistics: statistics});
});


app.listen(port, function () {
  console.log(`Example app listening on port ${port}!`);
});