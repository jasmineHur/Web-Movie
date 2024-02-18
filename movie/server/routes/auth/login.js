var express = require("express");
var router = express.Router();
const jwt = require("jsonwebtoken");
const SECRET_KEY = process.env.SECRET_KEY;

router.post("/user/login", (req, res) => {
  // Call the email and password from body
  const email = req.body.email;
  const password = req.body.password;
  // Set the token variables
  const expires_in_b = 600; // 10 Min
  const expires_in_r = 86400; // 1 Day
  const exp_b = Date.now() + expires_in_b * 1000;
  const exp_r = Date.now() + expires_in_r * 1000;
  const token_b = jwt.sign({ email, exp_b }, SECRET_KEY);
  const token_r = jwt.sign({ email, exp_r }, SECRET_KEY);
  // if the email and password are undefinded then the error will be occured
  if (!email || !password) {
    res
      .status(400)
      .json({ error: true, message: "Please fill the email or password" });
    return;
  }
  // if there email and password are input then check database
  req
    .db("users")
    .select("*")
    .where("email", email)
    .where("hash", password)
    .then((data) => {
      // if there is no result then the error is occured
      if (!data) {
        res.status(401).json({ message: "Unauthorized user" });
        return;
      }
      // if there is result then tokens will be created
      res.status(200).json({
        bearerToken: {
          token_b,
          token_type: "Bearer",
          expires_in: expires_in_b
        },
        refreshToken: {
          token_r,
          token_type: "Refresh",
          expires_in: expires_in_r
        }
      });
      return;
    })
    .catch((error) => {
      // Catch the general error
      res.status(401).json({ message: "Unauthorized user" });
    });
});

module.exports = router;
