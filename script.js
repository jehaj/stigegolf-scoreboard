"use strict";

const table = document.getElementById("scoreboard")
const tableScores = document.getElementById("scores");
const tableHeader = document.getElementById("table-header");

const clearButton = document.getElementById("clear-button");
const addButton = document.getElementById("add-button");
const addText = document.getElementById("add-field");

const addOneButton = document.getElementById("plus-one");
addOneButton.addEventListener("click", () => { updateScore(1) })
const addTwoButton = document.getElementById("plus-two");
addTwoButton.addEventListener("click", () => { updateScore(2) })
const addThreeButton = document.getElementById("plus-three");
addThreeButton.addEventListener("click", () => { updateScore(3) })
const newRoundButton = document.getElementById("new-round");

const tableData = document.getElementsByTagName("td");

let selected = null;

function selectEvent(e) {
    if (selected !== null) {
        selected.classList.remove("bold");
    }
    if (selected === e.target) {
        selected.classList.remove("bold");
        selected = null;
        return;
    }
    // get index in row
    const index = Array.from(e.target.parentElement.children).indexOf(e.target);
    // highlight header with index
    console.log(index);
    selected = tableHeader.children[index];
    selected.classList.add("bold");
}

addButton.addEventListener("click", function () {
    const player = addText.value;
    console.log(`Adding the player "${player}".`);
    const playerElement = document.createElement("td");
    playerElement.innerText = player;
    playerElement.addEventListener("click", selectEvent);
    tableHeader.appendChild(playerElement);
    // add initial score of zero
    if (scores.childElementCount == 0) {
        const row = document.createElement("tr");
        row.id = "1-round";
        tableScores.appendChild(row);
    }
    const score = document.createElement("td");
    score.innerText = "0";
    score.addEventListener("click", selectEvent);
    tableScores.lastChild.appendChild(score);
});

newRoundButton.addEventListener("click", function () {
    addButton.setAttribute("disabled", "");

    const row = document.createElement("tr");
    row.id = "1-round";
    tableScores.appendChild(row);

    const players = tableHeader.childElementCount;
    for (let i = 0; i < players; i++) {
        const score = document.createElement("td");
        score.addEventListener("click", selectEvent);
        score.innerText = "0";
        tableScores.lastChild.appendChild(score);
    }
});

clearButton.addEventListener("click", function () {
    addButton.removeAttribute("disabled");
    tableHeader.innerHTML = "";
    tableScores.innerHTML = "";
});

function updateScore(value) {
    if (selected === null) {
        console.error("Nothing is selected.");
        return;
    }
    const index = Array.from(selected.parentElement.children).indexOf(selected);
    const toUpdate = tableScores.lastChild.children[index];
    const oldValue = parseInt(toUpdate.innerText);
    const newValue = oldValue + value;
    console.log(`Updating player at ${index} from value ${oldValue} to ${newValue}`);
    toUpdate.innerText = newValue.toFixed();
}
