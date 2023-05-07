import React, { useEffect, useState } from "react";
import Countdown from "react-countdown";
import { Button } from "react-bootstrap";
import { useSingout } from "../utils";

import {
  NotificationContainer,
  NotificationManager
} from "react-notifications";
import "react-notifications/lib/notifications.css";

const API_URL = "http://sefdb02.qut.edu.au:3000";

const Timer = () => {
  let timeSet = 599000; // 9min 50sec
  let getLocalStorageValue = (s) => localStorage.getItem(s);
  // Random component
  const Completionist = () => {
    useSingout();
  };

  const handleRefresh = () => {
    const ALLTOKEN = JSON.parse(localStorage.getItem("token"));

    // const [data, setData] = useState(null);
    // const [loading, setLoading] = useState(true);
    // const [error, setError] = useState(null);

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
            NotificationManager.info("Please Signin Again", res.message, 3000);
          } else {
            let tokens = {
              bearer: `${res.bearerToken.token}`,
              refresh: `${res.refreshToken.token}`
            };
            localStorage.setItem("token", JSON.stringify(tokens));
            localStorage.removeItem("end_date");
            window.location.reload();
          }
        });
    }
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

  const [data, setData] = useState(
    { date: Date.now(), delay: timeSet } //60 seconds
  );
  const wantedDelay = timeSet; //60 s

  //[START] componentDidMount
  //Code runs only one time after each reloading
  useEffect(() => {
    const savedDate = getLocalStorageValue("end_date");

    if (savedDate != null && !isNaN(savedDate)) {
      const currentTime = Date.now();
      const delta = parseInt(savedDate, 10) - currentTime;

      //Do you reach the end?
      if (delta > wantedDelay) {
        //Yes we clear uour saved end date
        if (localStorage.getItem("end_date").length > 0)
          localStorage.removeItem("end_date");
      } else {
        //No update the end date
        setData({ date: currentTime, delay: delta });
      }
    }
  }, []);
  //[END] componentDidMount

  return (
    <>
      <div className="timer">
        <Countdown
          date={data.date + data.delay}
          renderer={renderer}
          onStart={(delta) => {
            //Save the end date
            if (localStorage.getItem("end_date") == null)
              localStorage.setItem(
                "end_date",
                JSON.stringify(data.date + data.delay)
              );
          }}
          onComplete={() => {
            if (localStorage.getItem("end_date") != null)
              localStorage.removeItem("end_date");
          }}
        />
      </div>
      <div className="timer-btn">
        <Button className="button" onClick={handleRefresh}>
          Refresh
        </Button>
      </div>
      <NotificationContainer />
    </>
  );
};
export default Timer;
