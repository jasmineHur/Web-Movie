import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Link, Routes } from "react-router-dom";
// Chart and table module css
import "devextreme/dist/css/dx.light.css";
// Notification module
import {
  NotificationContainer,
  NotificationManager
} from "react-notifications";
import "react-notifications/lib/notifications.css";
import "./css/main.css";

// Pages for navigation
import Home from "./pages/Home";
import Movie from "./pages/Movie";
import IndividualMovie from "./pages/IndividualMovie";
import IndividualPerson from "./pages/IndividualPerson";
import Register from "./pages/Register";
import Signin from "./pages/Signin";
// Timer for refresh
import Timer from "./components/Timer";

export default function App() {
  // Call the all tokens with bearer and refresh tokens
  const ALLTOKEN = JSON.parse(localStorage.getItem("token"));
  // useState for email, tokenNav, countdown
  const [email, setEmail] = useState();
  const [tokenNav, setTokenNav] = useState(true);
  const [countDown, setCountDown] = useState(true);

  useEffect(() => {
    // if All tokens have not error
    if (
      !(ALLTOKEN === null || ALLTOKEN === undefined || ALLTOKEN === "undefined")
    ) {
      setEmail(localStorage.getItem("signin"));
      setTokenNav(true);
      setCountDown(true);
    } else {
      setTokenNav(false);
      setCountDown(false);
    }
  });

  // when sign out remove all the itmes from local storage
  function SignOut() {
    localStorage.removeItem("token");
    localStorage.removeItem("end_date");
    localStorage.removeItem("email");
    // redirecting to main with notification
    NotificationManager.info("See you later!", "SignOut Success", 3000);
    setTimeout(function () {
      window.location.href = "/";
    }, 2000);
  }

  return (
    <div className="content">
      <Router>
        <div>
          <nav>
            <div className={countDown ? "nav-home" : "nav-time"}>
              <h1>
                <Link to="/">MOVIES</Link>
              </h1>
            </div>
            <div className={countDown ? "nav-time" : "nav-token"}>
              <Timer />
            </div>
            <Link to="/">Home</Link>
            <Link to="/movie">Movie</Link>
            <Link className={tokenNav ? "nav-token" : ""} to="/register">
              Register
            </Link>
            <Link className={tokenNav ? "nav-token" : ""} to="/signin">
              SignIn
            </Link>
            <Link className={!tokenNav ? "nav-token" : ""} onClick={SignOut}>
              SignOut
            </Link>
            <p className={!tokenNav ? "nav-token" : ""}> {email}</p>
          </nav>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/movie" element={<Movie />} />
            <Route path="/register" element={<Register />} />
            <Route path="/signin" element={<Signin />} />
            <Route path="/data" element={<IndividualMovie />} />
            <Route path="/people" element={<IndividualPerson />} />
          </Routes>
        </div>
      </Router>
      <footer>
        <p>
          All data is from IMDB, Metacritic and RottenTomatoes. © 2023 Justin
          Suh
        </p>
      </footer>
      <NotificationContainer />
    </div>
  );
}
