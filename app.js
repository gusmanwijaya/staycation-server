const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");

// Connect to mongodb
const { urlDb } = require("./config");
const mongoose = require("mongoose");
mongoose.connect(urlDb);

// Install package
const methodOverride = require("method-override");
const session = require("express-session");
const flash = require("connect-flash");

const dashboardRouter = require("./routes/dashboard");
const categoryRouter = require("./routes/category");
const bankRouter = require("./routes/bank");
const itemRouter = require("./routes/item");
const bookingRouter = require("./routes/booking");
const userRouter = require("./routes/user");

const { isLogin } = require("./middlewares/auth");

const app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// Use package
app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: true,
    cookie: {},
  })
);
app.use(flash());
app.use(methodOverride("_method"));

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// Setting static file
app.use(
  "/sb-admin-2",
  express.static(path.join(__dirname, `node_modules/startbootstrap-sb-admin-2`))
);

app.use("/", userRouter);
app.use("/dashboard", isLogin, dashboardRouter);
app.use("/category", isLogin, categoryRouter);
app.use("/bank", isLogin, bankRouter);
app.use("/item", isLogin, itemRouter);
app.use("/booking", isLogin, bookingRouter);

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
