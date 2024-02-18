var express = require("express");
var router = express.Router();

router.get("/movies/search", function (req, res) {
  // Call the title and year from query
  const title = req.query.title;
  const year = req.query.year;
  // Define variables for statements
  let query_db;
  let currentPage = req.query.page;
  let perPage = 100;
  let nextPage, prevPage, from, to;
  let movies = [];
  // if there is no declared page then error will be occcred
  if (isNaN(currentPage) && currentPage !== undefined) {
    res
      .status(400)
      .json({ message: "Invalid page format. page must be a number." });
    return;
  }
  // if input page is 1 then variables are set for the first
  if (!currentPage || currentPage === "1") {
    currentPage = 1;
    prevPage = null;
    nextPage = currentPage + 1;
    from = 0;
    to = 100;
  } else {
    currentPage = parseInt(req.query.page);
    prevPage = currentPage - 1;
    nextPage = currentPage + 1;
    from = currentPage * 100;
  }
  // based on input, the query will be decided
  if (!title && !year && currentPage) {
    query_db = req.db.select("*").from("basics");
  } else if (title && !year) {
    query_db = req.db
      .from("basics")
      .select("*")
      .where("primaryTitle", "like", `%${title}%`);
  } else if (!title && year) {
    query_db = req.db.from("basics").select("*").where("year", year);
  } else if (title && year) {
    query_db = req.db
      .from("basics")
      .select("*")
      .where("primaryTitle", "like", `%${title}%`)
      .andWhere("year", year);
  }

  if (isNaN(year) && year !== undefined) {
    res
      .status(400)
      .json({ message: "Invalid year format. Format must be yyyy." });
    return;
  }

  query_db
    .then((rows) => {
      let totalCount = rows.length;
      let lastPage = parseInt(rows.length / 100) + 1;

      if (rows.length === 0) {
        totalCount = 0;
        lastPage = 0;
        prevPage = null;
        nextPage = null;
        from = 0;
        to = 0;
      }

      rows.forEach((data) => {
        movies.push({
          title: data.primaryTitle,
          year: data.year,
          imdbID: data.tconst,
          imdbRating: +data.imdbRating,
          rottenTomatoesRating: +data.rottentomatoesRating,
          metacriticRating: data.metacriticRating
            ? +data.metacriticRating
            : null,
          classification: data.rated
        });
      });
      res.json({
        data: movies,
        pagination: {
          total: totalCount,
          lastPage: lastPage,
          prevPage: prevPage,
          nextPage: nextPage,
          currentPage: currentPage,
          perPage: perPage,
          from: from,
          to: to
        }
      });
    })
    .catch((e) => {
      res.status(400).json({ message: "Error" });
      return;
    });
});

module.exports = router;
