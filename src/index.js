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
const User = require("./models/user.models");
const { v4: uuidv4 } = require("uuid");

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
app.use(cors({ credentials: true, origin: `${env.CLIENT_URI}` }));

// adding morgan to log HTTP requests
app.use(morgan("tiny"));

// Initialize Passeport
app.use(passport.initialize());

//Authentication route
app.use("/api/v1/", authRoutes);

// starting the server
app.listen(env.PORT, () => {
  console.log(`listening on port ${env.PORT}`);
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
  callbackURL: "http://localhost:4000/api/v1/auth/google/callback",
};

// Passport Jwt Strategy
passport.use(
  new JwtStrategy(jwtOpts, (jwtPayload, done) => {
    // If the token has expiration, raise unauthorized
    if (Date.now() > jwtPayload.expiration) return done("Expired token", false);
    done(null, jwtPayload); //req.????
  })
);

// Passport Google Strategy

passport.use(
  new GoogleStrategy(
    googleOpts,
    async (request, accessToken, refreshToken, profile, done) => {
      if (!profile && !profile._json.email)
        return  done({err:'something went wrong'})
      const foundUser = await User.findOne({ email: profile._json.email });
      if (foundUser) {
        foundUser.salt = foundUser.hashed_password = undefined;
        return done(null, foundUser);
      } else {
        const newUser = new User({
          username: profile._json.given_name + "-" + profile._json.family_name, /// remove space also frommusername
          email: profile._json.email,
          password: uuidv4() + "@A",
        });
        newUser.save((err, savedUser) => {
          if (err)
            return done(err)
          savedUser.salt = savedUser.hashed_password = undefined;
          return done(null, savedUser)
        });
      }
    }
  )
);
