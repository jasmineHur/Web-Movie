var express = require("express");
var router = express.Router();

router.post("/user/logout", (req, res) => {
  // Call the refresh
  const token_r = req.body.refreshToken;
  // if refresh token is undefineded or unavailable then error will be occured
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
    // if there is refresh token then return the status 200 and make body as an empty
    res
      .status(200)
      .then(() => {
        req.body = null;
      })
      .status(200)
      .json({ error: false, message: "Token successfully invalidated" });
    return;
  }
});

module.exports = router;
