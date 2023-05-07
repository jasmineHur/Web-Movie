import React from "react";
import DataGrid, { Column, Selection } from "devextreme-react/data-grid";
import { useNavigate } from "react-router-dom";

export default function IndividualPersonTable({ data }) {
  const navigate = useNavigate();
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
