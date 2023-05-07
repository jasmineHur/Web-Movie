import React from "react";
import DataGrid, {
  Column,
  Selection,
  LoadPanel
} from "devextreme-react/data-grid";
import { useNavigate } from "react-router-dom";

export default function MovieTable({ data }) {
  const navigate = useNavigate();
  const onSelectionChanged = ({ selectedRowsData }) => {
    const data = selectedRowsData[0];
    navigate(`/data?key=${data.imdbID}`);
  };

  return (
    <div className="ag-theme-balham" style={{ height: "100vh", width: "100%" }}>
      <p>Showing: {data.length} rows</p>
      <DataGrid
        height={600}
        dataSource={data}
        showBorders={true}
        hoverStateEnabled={true}
        keyExpr="imdbID"
        onSelectionChanged={onSelectionChanged}
        className="movie-grid"
      >
        <Selection mode="single" />
        <Column dataField="title" width={250} caption="Title" dataType="text" />

        <Column dataField="year" caption="Year" dataType="number" />
        <Column dataField="imdbRating" caption="IMDB rating" />
        <Column
          dataField="rottenTomatoesRating"
          caption="RottenTomatoes"
          dataType="number"
        />
        <Column
          dataField="metacriticRating"
          caption="Metacrictic"
          dataType="number"
        />
        <Column dataField="classification" caption="Classification" />
        {/* <Scrolling mode="standard" /> */}
        {/* <Scrolling mode="infinite" />
        <ScrollView onScroll={onScroll} ref={fullContent} /> */}
        {/* <Editing mode="row" onEditRowKeyChange={setEditRowKey} /> */}
        <LoadPanel enabled={false} />
      </DataGrid>
    </div>
  );
}
