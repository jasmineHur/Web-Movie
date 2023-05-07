import React from "react";
import DataGrid, { Column, Selection } from "devextreme-react/data-grid";
import { useNavigate } from "react-router-dom";
import {
  NotificationContainer,
  NotificationManager
} from "react-notifications";
import "react-notifications/lib/notifications.css";

export default function IndividualMovieTable({ data }) {
  const ALLTOKEN = JSON.parse(localStorage.getItem("token"));
  const navigate = useNavigate();

  const onSelectionChanged = ({ selectedRowsData }) => {
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
