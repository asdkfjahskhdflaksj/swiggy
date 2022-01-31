//node core module
const path = require("path");

//thirdparty module
const express = require("express");
const passport = require("passport");
//const cookieSession = require("cookie-session");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const hpp = require("hpp");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

//doveloper module
const authRouter = require("./routes/auth-routes");
const errorHandler = require("./controller/errorController");
const Restaurant = require("./routes/restuarents-route");
const MenuRouter = require("./routes/menu-routes");
const ReviewRouter = require("./routes/review-route");
require("./factory/passportFactory");
const CartRouter = require("./routes/cart-routes");

const app = express();

app.use(helmet());

const sessionStore = new MongoDBStore(
  {
    collection: "mySession",
    uri: process.env.DATABASE.replace(
      "<PASSWORD>",
      process.env.DATABASE_PASSWORD
    ),
  },
  (err) => {
    //console.log(err);
  }
);

const limitter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: "too many request from this IP please try again after an hour",
});

app.use("/api", limitter);

//template engines
app.set("view engine", "ejs");

//configuring the body parser:
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: false }));

app.use(mongoSanitize());
app.use(xss());

app.use(express.static(path.join(__dirname, "public")));

// app.use(
//   cookieSession({
//     name: "sachin",
//     keys: [process.env.SESSIONKEY],
//     maxAge: 24 * 60 * 60 * 1000,
//   })
// );

app.use(
  session({
    name: "sachin",
    cookie: {
      path: "/",
      secure: false,
      httpOnly: true,
      maxAge: 1 * 60 * 60 * 1000,
    },
    secret: process.env.SESSION_SECRETE,
    resave: false,
    store: sessionStore,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

//app.use(hpp({whitelist : []}));

app.use("/auth", authRouter);
app.use("/api/v1/restaurents", Restaurant);
app.use("/api/v1/menus", MenuRouter);
app.use("/api/v1/reviews", ReviewRouter);
app.use("/api/v1/carts", CartRouter);

app.use(errorHandler);

module.exports = app;
