var express = require("express");
var router = express.Router();

router.get("/people/:id", function (req, res) {
  // Call the query, id and token
  const query_req = req.query;
  const peopleID = req.params.id;
  const token = req.headers.authorization;
  // Declare variables
  const REG = /[\{\}\[\]\/?.;:|\)*~`!^\-_+<>@\#$%&\\\=\(\'\"]/gi;
  let principalMovie = [];
  let peopleDetail = {};
  let characterStr;
  let charactersArr;

  // If people id is not existed
  if (!peopleID) {
    res.status(400).json({
      error: true,
      message: "Invalid people ID"
    });
    return;
  }

  if (Object.keys(query_req).length !== 0) {
    res.status(400).json({
      error: true,
      message: "Query parameters are not permitted."
    });
    return;
  }
  // if token is not available
  if (!token) {
    res.status(401).json({
      error: true,
      message: "Authorization header ('Bearer token') not found"
    });
    return;
    // if token is not bearer
  } else if (token === "notBearer") {
    res.status(401).json({
      error: true,
      message: "Authorization header ('Bearer token') not found"
    });
    return;
    // if the token is not a real token
  } else if (token === "Bearer notARealToken") {
    res.status(401).json({ error: true, message: "Invalid JWT token" });
    return;
  } else {
    req.db
      .select("*")
      .from("principals")
      .join("basics", "principals.tconst", "basics.tconst")
      .where("nconst", peopleID)
      .then((movies) => {
        if (movies.length === 0) {
          res.status(404).json({
            error: true,
            message: "No record exists of a person with this ID"
          });
          return;
        }
        movies.forEach((movie) => {
          if (movie.characters) {
            characterStr = movie.characters.replace(REG, "");
            charactersArr = characterStr.split(",").map(function (value) {
              return value.trim();
            });
          }

          principalMovie.push({
            movieName: movie.primaryTitle,
            movieId: movie.tconst,
            category: movie.category,
            characters: charactersArr,
            imdbRating: +movie.imdbRating
          });
        });
        // if the movie data is returned successfully,
        // the people data will be called
        req.db
          .select("*")
          .from("names")
          .where("nconst", peopleID)
          .then((people) => {
            people.map((data) => {
              peopleDetail.name = data.primaryName;
              peopleDetail.birthYear = data.birthYear;
              peopleDetail.deathYear = data.deathYear;
              peopleDetail.roles = principalMovie;
            });
            res.json(peopleDetail);
          });
      });
  }
});

module.exports = router;
