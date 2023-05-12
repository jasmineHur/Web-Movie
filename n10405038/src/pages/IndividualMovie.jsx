import { useNavigate, useSearchParams } from "react-router-dom";
import { useMovieDetail } from "../utils";
// Table component
import IndividualMovieTable from "../components/IndividualMovieTable";

export default function IndividualMovie() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const title = searchParams.get("title");
  const key = searchParams.get("key");
  // get the result (work) from useMovieDetail
  const { data: work } = useMovieDetail(key ?? "") ?? {};
  // if no result show the message
  if (!work) {
    return <p>Movie Contenct Not Found!</p>;
  }

  return (
    <div>
      <button className="button" onClick={() => navigate("/movie")}>
        Go Back
      </button>

      {work ? (
        <>
          <h1>{work.title}</h1>
          <img src={work.poster} className="poster-img" />
          <p>
            {work.description &&
              (typeof work.description === "string"
                ? work.description
                : work.description.value)}
          </p>
          <p>Released In: {work.year}</p>
          <p>Runtime: {work.runtime}</p>
          <p>Genres: {work.genres}</p>
          <p>Country: {work.country}</p>
          <p>Box Office: {work.boxoffice}</p>

          <p>{work.plot}</p>
          <div className="movie-data-text">
            <ul>
              <li>
                Internet Movie Database <br /> - {work.ratings[0].value}
              </li>
              <li>
                Rotten Tomatoes <br /> - {work.ratings[1].value}
              </li>
              <li>
                Metacritic <br /> - {work.ratings[2].value}
              </li>
            </ul>
          </div>
          <IndividualMovieTable data={work} />
        </>
      ) : (
        title && <h1>{title}</h1>
      )}
    </div>
  );
}
