import { useNavigate, useSearchParams } from "react-router-dom";
import DataGrid, { Column } from "devextreme-react/data-grid";
import { useMovieDetail } from "../utils";

export default function IndividualMovie() {
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();
  const title = searchParams.get("title");
  const key = searchParams.get("key");

  const { data: work } = useMovieDetail(key ?? "") ?? {};

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
          <DataGrid
            dataSource={work.principals}
            showBorders={true}
            className="movie-grid"
          >
            <Column dataField="category" caption="Role" dataType="text" />
            <Column dataField="name" caption="Name" dataType="text"></Column>
            <Column
              dataField="characters"
              caption="Character"
              dataType="text"
            />
          </DataGrid>
        </>
      ) : (
        title && <h1>{title}</h1>
      )}
    </div>
  );
}
