const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const env = require("./env-load");
const passport = require("passport");
const JwtStrategy = require("passport-jwt").Strategy;
const mongoose = require("mongoose");
const formatResponse = require("./utils/formatResponse")
const authRoutes = require("./routes/auth.routes")

//Connect to mongoDb using mongoose
mongoose.connect( env.DATABASE, { useNewUrlParser: true } )
  .then( () => console.log('DB Connected') )
  .catch( (err) => console.log(formatResponse('Error while connecting to DB', {}, err)))

// defining the Express app
const app = express();

// adding Helmet to enhance your Rest API's security
app.use(helmet());

// using bodyParser to parse JSON bodies into JS objects
app.use(bodyParser.json());

// Parse Cookie header and populate req.cookies
app.use(cookieParser());

// enabling CORS for all requests
app.use(cors());

// adding morgan to log HTTP requests
app.use(morgan("combined"));

// Initialize Passeport
app.use(passport.initialize());

//Authentication route
app.use("/api/v1/", authRoutes);

// starting the server
app.listen(env.PORT, () => {
  console.log(`listening on port ${env.PORT}`);
});

// hello word route
app.get("/", (req, res) => {
  res.send("hello world");
});

// Extract jwt token from cookies
const cookieExtractor = (req) => {
  let jwt = null;
  console.log(req.cookies);
  if (req && req.cookies) jwt = req.cookies["jwt"]; //what if no jwt key ?
  return jwt;
};

// Setup JWT options
var opts = {
  jwtFromRequest: cookieExtractor,
  secretOrKey: env.JWT_SECRET,
};

// Passport Jwt Strategy
passport.use(
  new JwtStrategy(opts, (jwtPayload, done) => {
    // If the token has expiration, raise unauthorized
    if (Date.now() > jwtPayload.expiration) return done("Expired token", false);
    done(null, jwtPayload);
  })
);

//define REST proxy options based on logged in user
passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (obj, done) {
  done(null, obj);
});

// Protected route testing purpose
app.get(
  "/protected",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.status(200).json({
      message: "welcome to the protected route!",
    });
  }
);