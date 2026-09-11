"use strict";

const table = document.getElementById("scoreboard")
const tableHeader = document.getElementById("table-header");
const tableScores = document.getElementById("scores");
const tableResult = document.getElementById("result");

const clearButton = document.getElementById("clear-button");
const addButton = document.getElementById("add-button");
const addText = document.getElementById("add-field");

const addOneButton = document.getElementById("plus-one");
addOneButton.addEventListener("click", () => {
    updateScore(1)
})
const addTwoButton = document.getElementById("plus-two");
addTwoButton.addEventListener("click", () => {
    updateScore(2)
})
const addThreeButton = document.getElementById("plus-three");
addThreeButton.addEventListener("click", () => {
    updateScore(3)
})
const newRoundButton = document.getElementById("new-round");

const tableData = document.getElementsByTagName("td");
const STORAGE_KEY = "stigegolf-scoreboard";

let selected = null;

function createHeaderCell(text) {
    const playerElement = document.createElement("td");
    playerElement.innerText = text;
    playerElement.addEventListener("click", selectEvent);
    return playerElement;
}

function createScoreCell(value = 0) {
    const score = document.createElement("td");
    score.innerText = value.toString();
    score.addEventListener("click", selectEvent);
    return score;
}

function saveState() {
    const state = {
        headers: Array.from(tableHeader.children).map((cell) => cell.innerText),
        scores: Array.from(tableScores.children).map((row) =>
            Array.from(row.children).map((cell) => parseInt(cell.innerText, 10))
        ),
        results: tableResult.childElementCount > 0
            ? Array.from(tableResult.lastChild.children).map((cell) => parseInt(cell.innerText, 10))
            : [],
        selectedIndex: selected ? Array.from(tableHeader.children).indexOf(selected) : null,
        addDisabled: addButton.hasAttribute("disabled")
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function restoreState() {
    const rawState = localStorage.getItem(STORAGE_KEY);
    if (rawState === null) {
        return;
    }

    try {
        const state = JSON.parse(rawState);
        if (!Array.isArray(state.headers) || !Array.isArray(state.scores)) {
            return;
        }

        tableHeader.innerHTML = "";
        tableScores.innerHTML = "";
        tableResult.innerHTML = "";
        selected = null;

        for (const header of state.headers) {
            tableHeader.appendChild(createHeaderCell(header));
        }

        for (const scores of state.scores) {
            const row = document.createElement("tr");
            row.id = "1-round";
            for (const score of scores) {
                row.appendChild(createScoreCell(score));
            }
            tableScores.appendChild(row);
        }

        if (Array.isArray(state.results) && state.results.length > 0) {
            const resultRow = document.createElement("tr");
            for (const score of state.results) {
                const td = document.createElement("td");
                td.innerText = score.toString();
                resultRow.appendChild(td);
            }
            tableResult.appendChild(resultRow);
        }

        if (state.addDisabled) {
            addButton.setAttribute("disabled", "");
        } else {
            addButton.removeAttribute("disabled");
        }

        if (
            state.selectedIndex !== null &&
            state.selectedIndex >= 0 &&
            state.selectedIndex < tableHeader.childElementCount
        ) {
            selected = tableHeader.children[state.selectedIndex];
            selected.classList.add("bold");
        }
    } catch (error) {
        console.error("Could not restore previous scoreboard state", error);
    }
}

function selectEvent(e) {
    if (selected !== null) {
        selected.classList.remove("bold");
    }
    if (selected === e.target) {
        selected.classList.remove("bold");
        selected = null;
        saveState();
        return;
    }
    // get index in row
    const index = Array.from(e.target.parentElement.children).indexOf(e.target);
    // highlight header with index
    console.log(index);
    selected = tableHeader.children[index];
    selected.classList.add("bold");
    saveState();
}

addButton.addEventListener("click", function () {
    const player = addText.value;
    addText.value = "";
    addText.focus();
    console.log(`Adding the player "${player}".`);
    const playerElement = createHeaderCell(player);
    tableHeader.appendChild(playerElement);
    // add initial score of zero
    if (tableScores.childElementCount === 0) {
        const row = document.createElement("tr");
        row.id = "1-round";
        tableScores.appendChild(row);
    }
    const score = createScoreCell();
    tableScores.lastChild.appendChild(score);
    saveState();
});

newRoundButton.addEventListener("click", function () {
    addButton.setAttribute("disabled", "");

    const row = document.createElement("tr");
    row.id = "1-round";
    tableScores.appendChild(row);

    const players = tableHeader.childElementCount;
    for (let i = 0; i < players; i++) {
        const score = createScoreCell();
        tableScores.lastChild.appendChild(score);
    }
    saveState();
});

clearButton.addEventListener("click", function () {
    if (confirm("Er du sikker på, at du vil rydde alt?")) {
        addButton.removeAttribute("disabled");
        tableHeader.innerHTML = "";
        tableScores.innerHTML = "";
        tableResult.innerHTML = "";
        selected = null;
        localStorage.removeItem(STORAGE_KEY);
    }
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

    // update scores in result
    const headers = tableHeader.childElementCount;
    const results = tableResult.childElementCount;
    if (results === 0) {
        tableResult.appendChild(document.createElement("tr"));
    }
    for (let i = tableResult.lastChild.childElementCount; i < headers; i++) {
        const td = document.createElement("td");
        td.innerText = "0";
        tableResult.lastChild.appendChild(td);
    }

    const resultToUpdate = tableResult.lastChild.children[index];
    const oldResult = parseInt(resultToUpdate.innerText);
    const newResult = oldResult + value;
    resultToUpdate.innerText = newResult.toFixed();
    saveState();
}

restoreState();
