import React from "react";
import { useNavigate } from "react-router-dom";
// Table module
import DataGrid, { Column, Selection } from "devextreme-react/data-grid";
// Notification module
import {
  NotificationContainer,
  NotificationManager
} from "react-notifications";
import "react-notifications/lib/notifications.css";

export default function IndividualMovieTable({ data }) {
  // localstorage token
  const ALLTOKEN = JSON.parse(localStorage.getItem("token"));
  // declare navigation
  const navigate = useNavigate();

  // when click the row the function will start
  const onSelectionChanged = ({ selectedRowsData }) => {
    // if there is no token the page will go to sign in
    // with notification
    if (!ALLTOKEN) {
      NotificationManager.info(
        "for getting more detail",
        "Please Signin",
        3000
      );
      setTimeout(function () {
        navigate(`/signin`);
      }, 3000);
    } else {
      // if there is token then redirect to person detail page
      const data = selectedRowsData[0];
      navigate(`/people?key=${data.id}`);
    }
  };

  return (
    <div className="ag-theme-balham" style={{ height: "100vh", width: "100%" }}>
      <DataGrid
        dataSource={data.principals}
        showBorders={true}
        hoverStateEnabled={true}
        onSelectionChanged={onSelectionChanged}
        className="movie-grid"
      >
        <Selection mode="single" />
        <Column dataField="category" caption="Role" dataType="text" />
        <Column dataField="name" caption="Name" dataType="text"></Column>
        <Column dataField="characters" caption="Character" dataType="text" />
      </DataGrid>
      <NotificationContainer />
    </div>
  );
}
