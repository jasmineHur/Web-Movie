var express = require("express");
var router = express.Router();

router.get("/movies/data/:imdbID", function (req, res) {
  // Call the query and input imdbID from url
  const query_req = req.query;
  const imdbID = req.params.imdbID;
  // Declare variables
  let REG = /[\{\}\[\]\/?.;:|\)*~`!^\-_+<>@\#$%&\\\=\(\'\"]/gi;
  let moviePrincipalsArr = [];
  let movieDetail = {};
  let characterStr;
  let charactersArr;

  if (Object.keys(query_req).length !== 0) {
    res.status(400).json({
      error: true,
      message: "Query parameters are not permitted."
    });
    return;
  }
  // if imdbID is existed then find person detail first
  if (imdbID) {
    req.db
      .select("nconst", "category", "name", "characters")
      .from("principals")
      .where("tconst", imdbID)
      .then((principals) => {
        if (!principals) {
          res.status(404).json({ error: true });
          return;
        }
        principals.forEach((pri) => {
          if (pri.characters) {
            characterStr = pri.characters.replace(REG, "");
            charactersArr = characterStr.split(",").map(function (value) {
              return value.trim();
            });
          }
          moviePrincipalsArr.push({
            id: pri.nconst,
            category: pri.category,
            name: pri.name,
            characters: charactersArr
          });
        });
        // if person detail is returned successfully,
        // the movie data will be called
        req.db
          .select("*")
          .from("basics")
          .where("tconst", imdbID)
          .then((rows) => {
            if (!rows) {
              res.status(404).json({
                error: true,
                message: "No record exists of a movie with this ID"
              });
            } else {
              var result = rows[0].genres.split(",").map(function (value) {
                return value.trim();
              });
              rows.map((data) => {
                movieDetail.title = data.primaryTitle;
                movieDetail.year = data.year;
                movieDetail.runtime = data.runtimeMinutes;
                movieDetail.genres = result;
                movieDetail.country = data.country;
                movieDetail.principals = moviePrincipalsArr;
                movieDetail.ratings = [
                  {
                    source: "Internet Movie Database",
                    value: +data.imdbRating
                  },
                  {
                    source: "Rotten Tomatoes",
                    value: +data.rottentomatoesRating
                  },
                  {
                    source: "Metacritic",
                    value: +data.metacriticRating
                  }
                ];
                movieDetail.boxoffice = data.boxoffice;
                movieDetail.poster = data.poster;
                movieDetail.plot = data.plot;
              });
              res.json(movieDetail);
            }
          })
          .catch((e) => {
            res.status(404).json({
              error: true,
              message:
                "Invalid query parameters: year. Query parameters are not permitted."
            });
            return;
          });
      })
      .catch((e) => {
        res.status(404).json({
          error: true,
          message:
            "Invalid query parameters: year. Query parameters are not permitted."
        });
        return;
      });
  } else {
    res.status(404).json({});
  }
});

module.exports = router;
