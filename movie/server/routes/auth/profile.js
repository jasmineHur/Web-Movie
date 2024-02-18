var express = require("express");
var router = express.Router();

router.get("/user/:id/profile", function (req, res) {
  // Call the token and user id from body and params repectively
  const token = req.body;
  const user_id = req.params.id;
  // if token is not existed then error comes out
  if (token.length === 0) {
    res.status(401).json({
      error: true,
      message: `Unauthorized user`
    });
    return;
  }

  req.db
    .from("users")
    .select("*")
    .where("email", "=", user_id)
    .then((rows) => {
      if (rows === []) {
        res.status(404).json({ error: true, message: "Cannot found" });
      } else {
        res.json(rows);
      }
    })
    .catch((err) => {
      res.json({ error: true, Message: "Cannot found" });
    });
});

module.exports = router;
