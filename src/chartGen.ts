import { Chart, registerables } from "chart.js";
Chart.register(...registerables);
// Sample data for labels and values
// const labels: string[] = [
//   "Label 1",
//   "Label 2",
//   "Label 3",
//   "Label 4",
//   "Label 5"
// ];
// const values: number[] = [10, 20, 30, 40, 50];

let myChart: Chart<"line", number[], string> | null = null;

export const generateGraph = (labels: string[], values: number[]) => {
  // Get canvas element and create a chart
  console.log(labels, values);
  try {
    const chartHolder = document.querySelector("#chartAppender");
    const canvas = <HTMLCanvasElement>document.createElement("canvas");
    if (canvas) {
      // Set the height and width for the canvas element
      canvas.height = 300; // Set the desired height
      canvas.width = 400; // Set the desired width
    }
    const ctx = canvas.getContext("2d");

    myChart = new Chart(ctx, {
      type: "line", // Set chart type to 'line'
      data: {
        labels: labels,
        datasets: [
          {
            label: "Value",
            data: values,
            borderColor: "rgba(75, 192, 192, 1)", // Customize the line color
            borderWidth: 2,
            fill: false // Set to false to create a line chart without fill
          }
        ]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
    while (chartHolder.firstChild) {
      chartHolder.removeChild(chartHolder.firstChild);
    }
    chartHolder.appendChild(canvas);
  } catch (error) {
    console.log(error);
  }
};
