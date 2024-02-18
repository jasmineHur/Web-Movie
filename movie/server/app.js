require("dotenv").config();
const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const swaggerUI = require("swagger-ui-express");
const swaggerDocument = require("./docs/swaggerDocument.json");
/* Router */
var indexRouter = require("./routes/index");
var movieRouter = require("./routes/movie");
var movieDataRouter = require("./routes/movieData");
var peopleRouter = require("./routes/people");
var loginRouter = require("./routes/auth/login");
var refreshRouter = require("./routes/auth/refresh");
var logoutRouter = require("./routes/auth/logout");
var registerRouter = require("./routes/auth/register");
var profileRouter = require("./routes/auth/profile");
var jsonwebtoken = require("jsonwebtoken");

require("dotenv").config();

var fs = require("fs");
var cors = require("cors");

const options = require("./knexfile");
const knex = require("knex")(options);

const helmet = require("helmet");
const { json } = require("express/lib/response");

var app = express();

app.use(helmet());
app.use((req, res, next) => {
  req.db = knex;
  next();
});

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

logger.token("res", (req, res) => {
  const headers = {};
  res.getHeaderNames().map((h) => (headers[h] = res.getHeader(h)));
  return JSON.stringify(headers);
});

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(cors());

app.get("/knex", function (req, res, next) {
  req.db
    .raw("SELECT VERSION()")
    .then((version) => console.log(version[0][0]))
    .catch((err) => {
      console.log(err);
      throw err;
    });
  res.send("Version Logged successfully");
});

// Call the routers using app.use
app.use("/", indexRouter);
app.use("/", movieRouter);
app.use("/", movieDataRouter);
app.use("/", peopleRouter);
app.use("/", profileRouter);
app.use("/", loginRouter);
app.use("/", refreshRouter);
app.use("/", logoutRouter);
app.use("/", registerRouter);

app.use("/docs", swaggerUI.serve, swaggerUI.setup(swaggerDocument));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
