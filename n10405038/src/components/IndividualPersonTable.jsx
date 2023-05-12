import React from "react";
import { useNavigate } from "react-router-dom";
// Table module
import DataGrid, { Column, Selection } from "devextreme-react/data-grid";

export default function IndividualPersonTable({ data }) {
  // Navigation
  const navigate = useNavigate();
  // when click the row it gose back to clicked movie detail
  const onSelectionChanged = ({ selectedRowsData }) => {
    const data = selectedRowsData[0];
    navigate(`/data?key=${data.movieId}`);
  };

  return (
    <div className="ag-theme-balham" style={{ width: "100%" }}>
      <DataGrid
        dataSource={data.roles}
        showBorders={true}
        hoverStateEnabled={true}
        onSelectionChanged={onSelectionChanged}
        className="movie-grid"
      >
        <Selection mode="single" />
        <Column dataField="category" caption="Role" dataType="text" />
        <Column dataField="movieName" caption="Movie" dataType="text"></Column>
        <Column dataField="characters" caption="Characters" dataType="text" />
        <Column dataField="imdbRating" caption="Ratings" dataType="text" />
      </DataGrid>
    </div>
  );
}
