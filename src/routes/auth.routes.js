const express = require("express");
const router = express.Router();
const env = require("../env-load");
const passport = require("passport");
const jwt = require("jsonwebtoken");

const { register, login, logout, googleAuth, authenticate } = require("../controllers/auth.controllers");

// Register new user with credentials
router.post("/register", register);

// Login
router.post("/login", login);

// Logout - remove jwt cookie
router.get("/logout", logout);

// Verify token and get user data
router.get(
  "/authenticate",
  passport.authenticate("jwt", { session: false }),
  authenticate
);

// Gooogle Login
router.get(
  "/auth/google/",
  passport.authenticate("google", {
    session: false,
    scope: ["profile", "email"],
  })
);

router.get(
  "/auth/google/callback/",
  passport.authenticate("google", {
    session: false,
    failureRedirect: `${env.CLIENT_URI}/bad`,
  }),
  googleAuth
);


module.exports = router;
