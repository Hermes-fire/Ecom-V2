const env = require("../env-load");
const formatResponse = require("../utils/formatResponse");
const handleDbErrMsg = require("../utils/handleDbErrMsg");
const User = require("../models/user.models");
const jwt = require("jsonwebtoken");
const Joi = require("joi");

const schema = Joi.object({
    username: Joi.string()
        .alphanum()
        .min(3)
        .max(30)
        .required(),
    password: Joi.string()
        .pattern(new RegExp("^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$")),
    email: Joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: true } })
})

exports.register = async (req, res) => {
  try {
    const {username, email, password} = req.body
    await schema.validateAsync({username, email, password})
    if (!username || !email || !password)
      return res.status(400).json(formatResponse("All fields are required"))
    const newUser = new User({ username, email, password })
    newUser.save((err, user) => {
      if (err)
        return res
          .status(500)
          .json(formatResponse(handleDbErrMsg(err), {}, err))
      user.salt = user.hashed_password = undefined;
      res
        .status(200)
        .json(formatResponse("Account successfully registered", user))
    });
  } catch (err) {
    res
      .status(500)
      .json(formatResponse(handleDbErrMsg(err), {}, err))
  }
};

///please validate fields

//Login
exports.login = (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password)
      return res.status(400).json(formatResponse("All fields are required"));
    User.findOne({ username }, (err, user) => {
      if (err) {
        return res
          .status(500)
          .json(formatResponse(handleDbErrMsg(err), {}, err));
      }
      if (!user) {
        return res.status(404).json(formatResponse("Username not registred"));
      }
      if (!user.authenticate(password)) {
        return res
          .status(401)
          .json(
            formatResponse("Username and password dont match, please try again")
          );
      }
      user.salt = user.hashed_password = undefined;
      const token = jwt.sign({ _id: user._id }, env.JWT_SECRET, {
        expiresIn: "60d",
      });
      res
        .cookie("jwt", token, {
          httpOnly: true,
          secure: env.SECURE_COOKIE === "true" ? true : false, //--> SET TO TRUE ON PRODUCTION
        })
        .status(200)
        .json(formatResponse("Succesfully logged in", { user }));
    });
  } catch (err) {
    res.status(500).json(formatResponse("Cannot Login at the moment", {}, err));
  }
};

// Logout Route
exports.logout = (req, res) => {
  if (req.cookies["jwt"]) {
    res.clearCookie("jwt").status(200).json({
      message: "You have logged out",
    });
  } else {
    res.status(401).json({
      error: "Invalid jwt",
    });
  }
};

//isAdmin
exports.isAdmin = (req, res, next) => {
    if(req.user.role === 0){
        return res.status(403).json({
            error:'Admin ressource! Access denied'
        })
    }
    next()
}

