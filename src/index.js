const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const env = require("./env-load");
const passport = require("passport");
const JwtStrategy = require("passport-jwt").Strategy;
const GoogleStrategy = require("passport-google-oauth").OAuth2Strategy;
//var GoogleStrategy = require('passport-google-oidc');
const mongoose = require("mongoose");
const formatResponse = require("./utils/formatResponse");
const authRoutes = require("./routes/auth.routes");
const router = require("./routes/auth.routes");
const { eventNames } = require("./models/user.models");

//Connect to mongoDb using mongoose
mongoose
  .connect(env.DATABASE, { useNewUrlParser: true })
  .then(() => console.log("DB Connected"))
  .catch((err) =>
    console.log(formatResponse("Error while connecting to DB", {}, err))
  );

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
app.use(morgan("tiny"));

//cors
app.use(
  cors({
    origin: `${env.CLIENT_URI}`,
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
  })
);

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
  if (req && req.cookies) jwt = req.cookies["jwt"]; //what if no jwt key ?
  return jwt;
};

// Setup JWT options
var jwtOpts = {
  jwtFromRequest: cookieExtractor,
  secretOrKey: env.JWT_SECRET,
};

// Setup Google options
const googleOpts = {
  clientID: env.CLIENT_ID,
  clientSecret: env.CLIENT_SECRET,
  callbackURL: "http://localhost:4000/auth/google/callback",
};

// Passport Jwt Strategy
passport.use(
  new JwtStrategy(jwtOpts, (jwtPayload, done) => {
    // If the token has expiration, raise unauthorized
    if (Date.now() > jwtPayload.expiration) return done("Expired token", false);
    console.log(jwtPayload)
    done(null, jwtPayload);//req.????
  })
);


// Passport Google Strategy

passport.use(
  new GoogleStrategy(
    googleOpts,
    (request, accessToken, refreshToken, profile, done) => {
      // See if this user already exists
      /* let user = users.getUserByExternalId('google', profile.id);
  if (!user) {
    // They don't, so register them
    user = users.createUser(profile.displayName, 'google', profile.id);
  } */
      let user = {profilegoogle: profile}
      return done(null, user);
    }
  )
) 
/* //define REST proxy options based on logged in user
passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (obj, done) {
  done(null, obj);
}); */



app.get(
  "/auth/google/",
  passport.authenticate("google", {
    session: false,
    scope: ["profile", "email"],
  })
);

app.get('/auth/google/callback/', 
  passport.authenticate('google', { session: false, failureRedirect: 'http://localhost:3000/bad' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('http://localhost:3000/good');
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

//app.get('/login/federated/google', passport.authenticate('google'))