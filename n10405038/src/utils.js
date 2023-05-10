import { useEffect, useState } from "react";
// Notification module
import { NotificationManager } from "react-notifications";
import "react-notifications/lib/notifications.css";
// API URL
const API_URL = "http://sefdb02.qut.edu.au:3000";

// useWork for handling API about get movie list
export function useWorks(...args) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getMovieData(...args)
      .then((response) => {
        if (response.error) {
          setError(response.message);
          setData([]);
        } else {
          setData(response);
          setError(null);
        }
      })
      .catch((err) => {
        setError(err.toString());
        setData([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [...args]);

  return { data, loading, error };
}

/* Bring the movie list */
async function getMovieData(submittedInput) {
  // submittedInput is array for getting all search components
  let search = submittedInput[0];
  let publishYear = submittedInput[1];
  let page = submittedInput[2];
  // Url for fetch
  let url;

  if (page === undefined || page === "undefined") {
    page = 1;
  }
  // set url based on search
  if (search !== undefined && publishYear === undefined) {
    url = `${API_URL}/movies/search?page=${page}&title=${search}`;
  } else if (search === undefined && publishYear !== undefined) {
    url = `${API_URL}/movies/search?page=${page}&year=${publishYear}`;
  } else if (search !== undefined && publishYear !== undefined) {
    url = `${API_URL}/movies/search?page=${page}&title=${search}&year=${publishYear}`;
  } else {
    url = `${API_URL}/movies/search`;
  }

  const response = await fetch(url);

  const data = await response.json();

  if (data.data.length === 0) {
    // Search results
    return NotificationManager.error(
      "Nothing matches search query",
      "Please Try Again",
      3000
    );
  }

  if (data.data) {
    // Default subject query
    const works = data.data.map((movie) => ({
      ...movie,
      title: movie.title,
      year: movie.year,
      imdbRating: movie.imdbRating,
      imdbID: movie.imdbID,
      rottenTomatoesRating: movie.rottenTomatoesRating,
      metacriticRating: movie.metacriticRating,
      classification: movie.classification
    }));

    return works;
  }
}

/* Bring the movie detail */
export function useMovieDetail(key) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    (async () => {
      if (!key) {
        setError("No Work Found");
        setData(null);
        return;
      }
      try {
        const response = await fetch(`${API_URL}/movies/data/${key}`);
        const data = await response.json();
        setData(data);
        setError(null);
      } catch (err) {
        setError(err);
        setData(null);
      } finally {
        setLoading(false);
      }
    })();
  }, [key]);

  return { data, loading, error };
}

/* Bring the person detail */
export function useIndividualPerson(key) {
  const ALLTOKEN = JSON.parse(localStorage.getItem("token"));

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (
      ALLTOKEN === null ||
      ALLTOKEN === undefined ||
      ALLTOKEN === "undefined"
    ) {
    } else {
      const headers = {
        accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${ALLTOKEN.bearer}`
      };

      let urlPerson = `${API_URL}/people/${key}`;

      (async () => {
        if (!key) {
          setError("No Work Found");
          setData(null);
          return;
        }

        try {
          const response = await fetch(urlPerson, {
            method: "GET",
            headers
          });

          const data = await response.json();

          if (data.error) {
            NotificationManager.error(
              "Please Signin Again",
              "Token expired",
              3000
            );
            setTimeout(function () {
              window.location.href = "/";
            }, 2000);
          } else {
            setData(data);
            setError(null);
          }
        } catch (err) {
          setError(err);
          setData(null);
        } finally {
          setLoading(false);
        }
      })();
    }
  }, [key]);

  return { data, loading, error };
}

export function useRefresh(key) {
  const ALLTOKEN = JSON.parse(localStorage.getItem("token"));

  if (ALLTOKEN === null || ALLTOKEN === undefined || ALLTOKEN === "undefined") {
  } else {
    const headers = {
      accept: "application/json",
      "Content-Type": "application/json"
    };

    const url_refresh = `${API_URL}/user/refresh`;

    fetch(url_refresh, {
      method: "POST",
      headers,
      body: JSON.stringify({ refreshToken: ALLTOKEN.refresh })
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.error) {
          // localStorage.setItem("token", null);
        } else {
          let tokens = {
            bearer: `${res.bearerToken.token}`,
            refresh: `${res.refreshToken.token}`
          };

          localStorage.setItem("token", JSON.stringify(tokens));
        }
      });
  }

  return 60000;
}

export function useSingout(key) {
  const ALLTOKEN = JSON.parse(localStorage.getItem("token"));

  if (ALLTOKEN === null || ALLTOKEN === undefined || ALLTOKEN === "undefined") {
  } else {
    const headers = {
      accept: "application/json",
      "Content-Type": "application/json"
    };

    const url_refresh = `${API_URL}/user/logout`;
    fetch(url_refresh, {
      method: "POST",
      headers,
      body: JSON.stringify({ refreshToken: ALLTOKEN.refresh })
    })
      .then((res) => res.json())
      .then((res) => {
        localStorage.removeItem("token");
        localStorage.removeItem("email");
        NotificationManager.error("Please Signin Again", "Token expired", 3000);
        setTimeout(function () {
          window.location.href = "/";
        }, 2000);
      });
  }
}
