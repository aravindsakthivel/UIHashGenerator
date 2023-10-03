import { MultiplierHandler } from "./hashGenerator";

const input1 = document.querySelector(".input1")! as HTMLInputElement;
const input2 = document.querySelector("#customHash") as HTMLInputElement;
const input3 = document.querySelector("#customHashClient") as HTMLInputElement;
const button = document.querySelector("button")! as HTMLButtonElement;
const taskContainer = document.querySelector(
  ".task-container"
)! as HTMLDivElement;
const chartHolder = document.querySelector("#chartAppender");
const copyButton = document.getElementById("initialHash");

const addTask = (task: string) => {
  if (!task) return alert("First add a number");
  let numbersVal = Number(task);
  if (numbersVal > 10000) {
    alert("Don't use value more than 10000");
    return;
  }
  const customHash = input2.value;
  const clientSeed = input3.value;
  MultiplierHandler.getInstance().noOfHashes(numbersVal);
  button.disabled = true;
  button.innerHTML = "Loading...";
  MultiplierHandler.getInstance()
    .generateHashForGames(customHash, clientSeed)
    .then(() => {
      button.disabled = false;
      button.innerHTML = "Generate";
    })
    .catch(() => {
      button.disabled = false;
      button.innerHTML = "Generate";
    });
};

button.addEventListener("click", () => {
  addTask(input1.value);
});

// Function to sort the table by the "Value" column
function sortTableByValue() {
  const table = document.getElementById("valueTable");
  const tbody = table.querySelector("tbody");
  const rows = Array.from(tbody.querySelectorAll("tr"));

  rows.sort((a, b) => {
    const valueA = parseFloat(a.querySelector("td:nth-child(4)").textContent);
    const valueB = parseFloat(b.querySelector("td:nth-child(4)").textContent);

    return valueA - valueB;
  });

  // Clear the table body
  while (tbody.firstChild) {
    tbody.removeChild(tbody.firstChild);
  }

  // Append the sorted rows to the table body
  rows.forEach((row) => {
    tbody.appendChild(row);
  });
}

// Add click event listener to the crashVal <th>
const crashValTh = document.getElementById("crashValTh");
crashValTh.addEventListener("click", () => {
  sortTableByValue();
});
