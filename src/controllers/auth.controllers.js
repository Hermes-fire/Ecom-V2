const env = require("../env-load");
const formatResponse = require("../utils/formatResponse");
const handleDbErrMsg = require("../utils/handleDbErrMsg");
const User = require("../models/user.models");

exports.register = (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password)
      return res.status(400).json(formatResponse("All fields are required"));
    const newUser = new User({username, email, password});
    newUser.save((err, user) => {
      if (err) return res.status(500).json(formatResponse(handleDbErrMsg(err),{}, err));
      user.salt = user.hashed_password = undefined;
      res
        .status(200)
        .json(formatResponse("Account successfully registered", user))
    });
  } catch (err) {
    console.log(err)
    res
      .status(500)
      .json(formatResponse("Cannot register user at the moment",{}, err));
  }
};

/*  
// Login middleware
const login = (req, res, next) => {
    try {
      const { username, password } = req.body;
  
      let user = {
        username,
        password,
      };
  
      if (username === "amine") {
        if (password === "amine") {
          res.locals.user = user;
          next();
        } else {
          res.status(400).json({
            error: "Incorrect username or password",
          });
        }
      } else {
        res.status(400).json({
          error: "Incorrect username or password",
        });
      }
    } catch (error) {
      res.status(500).json({ error });
    }
  };
  
  // Login Route
  app.post("/login", login, async (req, res) => {

    let user;
  
    if (res.locals.user) {
      user = res.locals.user;
    } else {
      res.status(400).json({
        error: "user not found",
      });
    }
  
    const date = new Date();
    date.setDate(date.getDate() + 60);
  
    const payload = {
      username: user.username,
      expiration: date,
    };
  
    const token = jwt.sign(JSON.stringify(payload), env.SECRET);
  
    res
      .cookie("jwt", token, {
        httpOnly: true,
        secure: false, //--> SET TO TRUE ON PRODUCTION
      })
      .status(200)
      .json({
        message: "You have logged in :D",
      });
  });
  
  // Protected route
  app.get(
    "/protected",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
      res.send(200).json({
        message: "welcome to the protected route!",
      });
    }
  );
  
  // Logout Route
  app.get("/logout", (req, res) => {
    if (req.cookies["jwt"]) {
      res.clearCookie("jwt").status(200).json({
        message: "You have logged out",
      });
    } else {
      res.status(401).json({
        error: "Invalid jwt",
      });
    }
  });
   */
