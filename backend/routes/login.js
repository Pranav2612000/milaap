const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const config = require("config");
const userLogins = require("../models/UserLogin.model");

router.post("/", async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  userLogins.findOne({ username: username }, async function (err, user) {
    if (err) {
      return res.status(400).json({ err: "Invalid Credentials" });
    }
    if (!user) {
      return res.status(400).json({ err: "Invalid Credentials" });
    }
    console.log(user);
    if (password === user.password) {
      //       return res.status(200).json({ msg: "Correct Credentials" });
      const payload = {
        user: {
          id: user.username,
        },
      };
      try {
        jwt.sign(
          payload,
          config.get('jwtSecret'),
          { expiresIn: 3600 },
          (err, token) => {
            if (err) throw err;
            res.status(200).json({
              token,
              user_details: {
                userId: user.username,
              },
            });
          },
        );
      } catch (e) {
        res.status(400).json({ err: e });
      }
    }
    else {
      return res.status(400).json({ err: "Invalid Credentials" });
    }

  });
})
module.exports = router;
