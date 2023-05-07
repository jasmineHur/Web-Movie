import React, { useEffect, useState } from "react";
import Countdown, { formatTimeDelta } from "react-countdown";
import { Button } from "react-bootstrap";
import { useRefresh, useSingout } from "../utils";
// Random component

const API_URL = "http://sefdb02.qut.edu.au:3000";

const Timer = () => {
  // const [timeRefresh, setTimeRefresh] = useState(600000);
  const Completionist = () => {
    useSingout();
    window.location.reload();
  };
  let time = 600000;
  console.log(time.data);
  console.log(useRefresh());
  const handleRefresh = () => {
    const ALLTOKEN = JSON.parse(localStorage.getItem("token"));

    // const [data, setData] = useState(null);
    // const [loading, setLoading] = useState(true);
    // const [error, setError] = useState(null);

    console.log(ALLTOKEN);

    if (
      ALLTOKEN === null ||
      ALLTOKEN === undefined ||
      ALLTOKEN === "undefined"
    ) {
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
            console.log(res.message);
            // localStorage.setItem("token", null);
          } else {
            let tokens = {
              bearer: `${res.bearerToken.token}`,
              refresh: `${res.refreshToken.token}`
            };

            localStorage.setItem("token", JSON.stringify(tokens));
            time = 600000;
          }
        });
    }
    // return (time = 600000);
  };

  // Renderer callback with condition
  const renderer = ({ minutes, seconds, completed }) => {
    if (completed) {
      // Render a complete state
      return <Completionist />;
    } else {
      // Render a countdown
      return (
        <span>
          {minutes}:{seconds}
        </span>
      );
    }
  };

  return (
    <>
      <div className="timer">
        <Countdown date={Date.now() + time} renderer={renderer}>
          <Completionist />
        </Countdown>
      </div>
      <div className="timer-btn">
        <Button className="button" onClick={handleRefresh}>
          Refresh
        </Button>
      </div>
    </>
  );
};
export default Timer;
