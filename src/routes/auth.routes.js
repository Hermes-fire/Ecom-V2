const express = require("express");
const router = express.Router();
const env = require("../env-load");
const passport = require("passport");
const { register, login, logout } = require("../controllers/auth.controllers");

router.post("/register", register);
router.post("/login", login);
router.get("/logout", logout);

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
  (req, res) => {
    res.redirect(`${env.CLIENT_URI}/good`);
  }
);

// Protected route testing purpose
router.get(
  "/protected",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    console.log(req.user);
    if (req.user) {
      return res.status(200).json({
        user: req.user,
      });
    }
    res.status(400).json({
      message: "Unauthorized",
    });
  }
);


module.exports = router;
