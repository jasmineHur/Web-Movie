import { useState } from "react";
// Notification Module
import { NotificationContainer } from "react-notifications";
import "react-notifications/lib/notifications.css";
// Utils for dealing API
import { useWorks } from "../utils";
// Component for desplaying
import MovieTable from "../components/MovieTable";
import Search from "../components/SearchBar";

export default function Movie() {
  // UseState for search, publishYear, page
  const [search, setSearch] = useState("");
  const [publishYear, setPublishYear] = useState("");
  const [page, setPage] = useState(1);
  // Using useWokrs
  const { data, loading } = useWorks(search);

  return (
    <div className="content">
      <h1>Works Search: {search[0]}</h1>
      <Search
        {...{
          publishYear,
          search,
          page,
          submitSearch: setSearch
        }}
      />

      {loading && <p>Loading...</p>}

      <MovieTable data={data} />
      <NotificationContainer />
    </div>
  );
}
