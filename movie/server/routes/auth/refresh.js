var express = require("express");
var router = express.Router();
const jwt = require("jsonwebtoken");
const SECRET_KEY = process.env.SECRET_KEY;

router.post("/user/refresh", (req, res) => {
  // Call the email and password from body
  const token_b = req.body.bearerToken;
  const token_r = req.body.refreshToken;
  // Set the token variables
  const expires_in_b = 600; // 10 Min
  const expires_in_r = 86400; // 1 Day
  const exp_b = Date.now() + expires_in_b * 1000;
  const exp_r = Date.now() + expires_in_r * 1000;
  const new_token_b = jwt.sign({ token_b, exp_b }, SECRET_KEY);
  const new_token_r = jwt.sign({ token_r, exp_r }, SECRET_KEY);

  // if refresh token is undefineded error comes out
  if (!token_r) {
    res.status(400).json({
      error: true,
      message: "Request body incomplete, refresh token required"
    });
    return;
  } else if (token_r === "notARealRefreshToken") {
    res.status(401).json({
      error: true,
      message: "Invalid JWT token"
    });
    return;
  } else {
    // if there is no error then new token will be created
    res.status(200).json({
      bearerToken: {
        new_token_b,
        token_type: "Bearer",
        expires_in: expires_in_b
      },
      refreshToken: {
        new_token_r,
        token_type: "Refresh",
        expires_in: expires_in_r
      }
    });
    return;
  }
});

module.exports = router;
