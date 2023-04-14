"use strict";

const tableHeader = document.getElementById("table-header");

const clearButton = document.getElementById("clear-button");
const addButton = document.getElementById("add-button");
const addText = document.getElementById("add-field");

addButton.addEventListener("click", function () {
    const player = addText.value;
    console.log(`Adding the player "${player}".`);
    const playerElement = document.createElement("td");
    playerElement.innerText = player;
    tableHeader.appendChild(playerElement);
});

clearButton.addEventListener("click", function () {
    tableHeader.innerHTML = "";
})
