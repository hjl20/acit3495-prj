
const port = process.env.WEB_PORT || 3000;

// Requiring module
const express = require("express");
const app = express();

app.use(express.urlencoded({ extended: true }));

app.set('view engine', 'ejs');

const apiRouter = require("./routes/api.js");
app.use("/api", apiRouter);

const pageRouter = require("./routes/page.js");
app.use("/", pageRouter);



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

  if (user == process.env.WEB_ADMIN && pass == process.env.WEB_PASSWORD) {
    // If Authorized user
    next();
  } else {
    let err = new Error('You are not authenticated!');
    res.setHeader('WWW-Authenticate', 'Basic');
    err.status = 401;
    return next(err);
  }
}

app.use(authentication)


app.listen(port, function () {
  console.log(`ACIT3495 app listening on port ${port}!`);
});