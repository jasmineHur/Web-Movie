import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
// ccountdown for timer
import Countdown from "react-countdown";
import { useSingout } from "../utils";
// Notification model
import {
  NotificationContainer,
  NotificationManager
} from "react-notifications";
import "react-notifications/lib/notifications.css";

const API_URL = "http://sefdb02.qut.edu.au:3000";

const Timer = () => {
  let timeSet = 599000; // 9min 50sec
  const [data, setData] = useState({ date: Date.now(), delay: timeSet });
  const wantedDelay = timeSet;

  let getLocalStorageValue = (s) => localStorage.getItem(s);
  // After timeout
  const Completionist = () => {
    useSingout();
  };
  // if click the refresh button the function will workß
  const handleRefresh = () => {
    // contain all the token in variable
    const ALLTOKEN = JSON.parse(localStorage.getItem("token"));
    // remove localStorage
    localStorage.removeItem("token");

    if (
      ALLTOKEN === null ||
      ALLTOKEN === undefined ||
      ALLTOKEN === "undefined"
    ) {
    } else {
      // if token is avaliable then refresh works
      const headers = {
        accept: "application/json",
        "Content-Type": "application/json"
      };

      const url_refresh = `${API_URL}/user/refresh`;
      // fetch
      fetch(url_refresh, {
        method: "POST",
        headers,
        body: JSON.stringify({ refreshToken: ALLTOKEN.refresh })
      })
        .then((res) => res.json())
        .then((res) => {
          // if there is error then signout automatically
          if (res.error) {
            NotificationManager.error(
              "Please Signin Again",
              "Something went wrong",
              3000
            );

            localStorage.removeItem("end_date");
            localStorage.removeItem("email");

            setTimeout(function () {
              window.location.href = "/";
            }, 2000);
          } else {
            // if there is no error new token will contain
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

  // ComponentDidMount
  // Code runs only one time after each reloading
  useEffect(() => {
    const savedDate = getLocalStorageValue("end_date");

    if (savedDate != null && !isNaN(savedDate)) {
      const currentTime = Date.now();
      const delta = parseInt(savedDate, 10) - currentTime;

      // if the time is reched to end time
      if (delta > wantedDelay) {
        // clear uour saved end date
        if (localStorage.getItem("end_date").length > 0)
          localStorage.removeItem("end_date");
      } else {
        //No update the end date
        setData({ date: currentTime, delay: delta });
      }
    }
  }, []);

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
