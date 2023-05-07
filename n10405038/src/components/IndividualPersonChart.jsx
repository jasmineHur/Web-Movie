import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";
import { Chart, Series } from "devextreme-react/chart";
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);
// https://js.devexpress.com/Demos/WidgetsGallery/Demo/Charts/StandardBar/React/SoftBlue/
//https://react-chartjs-2.js.org/examples/vertical-bar-chart
export default function IndividualPersonChart({ data }) {
  let arrRating = [];
  let objRating = [
    {
      rating: "1-2",
      count: 0
    },
    {
      rating: "2-3",
      count: 0
    },
    {
      rating: "3-4",
      count: 0
    },
    {
      rating: "4-5",
      count: 0
    },
    {
      rating: "5-6",
      count: 0
    },
    {
      rating: "6-7",
      count: 0
    },
    {
      rating: "7-8",
      count: 0
    },
    {
      rating: "8-9",
      count: 0
    },
    {
      rating: "9-10",
      count: 0
    }
  ];

  if (!data.error) {
    data.roles.map((data) => {
      arrRating.push(Math.floor(data.imdbRating));
    });

    arrRating.forEach((x) => {
      if (x === 1) {
        objRating[0].count++;
      } else if (x === 2) {
        objRating[1].count++;
      } else if (x === 3) {
        objRating[2].count++;
      } else if (x === 4) {
        objRating[3].count++;
      } else if (x === 5) {
        objRating[4].count++;
      } else if (x === 6) {
        objRating[5].count++;
      } else if (x === 7) {
        objRating[6].count++;
      } else if (x === 8) {
        objRating[7].count++;
      } else if (x === 9) {
        objRating[8].count++;
      } else if (x === 10) {
        objRating[9].count++;
      }
    });
  } else {
    objRating = null;
  }

  return (
    <div>
      <h3>IMDB ratings at a glance</h3>
      <Chart id="chart" dataSource={objRating}>
        <Series
          valueField="count"
          argumentField="rating"
          name="Ratings"
          type="bar"
          color="#be3455"
        />
      </Chart>
    </div>
  );
}
