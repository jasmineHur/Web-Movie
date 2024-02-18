var express = require("express");
var bcrypt = require("bcrypt");
var router = express.Router();

router.post("/user/register", function (req, res) {
  // Call the email and password from body
  const email = req.body.email;
  const password = req.body.password;
  // if email or password are undefined then result comes with error
  if (!email || !password) {
    res.status(400).json({ error: true, message: "Error" });
    return;
  }
  // Check database where email is already registered or not
  req.db
    .from("users")
    .select("*")
    .where("email", "=", email)
    .then((users) => {
      // if there is no user then the result will be error
      if (users.length !== 0) {
        res.status(409).json({ error: true, message: "Existed user" });
        return;
      }
      // if there is no user existed then register the user
      const salt = 10;
      const hash = bcrypt.hashSync(password, salt);
      return req.db.from("users").insert({ email, hash });
    })
    .then(() => {
      res.status(201).json({ message: "Create user" });
    });
});

module.exports = router;
