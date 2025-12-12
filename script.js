
const COL_IDX_TO_LETTER = {
  0: "a",
  1: "b",
  2: "c",
  3: "d",
  4: "e",
  5: "f",
  6: "g",
  7: "h"
}

const COL_LETTER_TO_IDX = {
  "a": 0,
  "b": 1,
  "c": 2,
  "d": 3,
  "e": 4,
  "f": 5,
  "g": 6,
  "h": 7
}

let getNextRandomTile = false;
let currTile = {"row": getRandomDimen(), "col": getRandomDimen()};
let totalAttempts = 0;
let totalCorrect = 0;

function setup() {
  let boardSize = 60 * 8
  let canvas = createCanvas(boardSize, boardSize);
  canvas.id("gameScreen");
  canvas.parent("canvas-wrapper");

  board = new Board(boardSize);
  setupListeners();
}

function draw() {
  board.display();

  shouldGetRandomTile(board);
  board.highlightTile(currTile["row"], currTile["col"]);
}


class Board {
  constructor(boardSize) {
    this.tiles = [];
    this.x = 0;
    this.y = 0;
    this.boardSize = boardSize;
    this.numTiles = 8;

    this.initializeEmptyBoard();
    this.initializeTiles();
  }

  display() {
    push();
    for (let i = 0; i < this.tiles.length; i++) {
      for (let j = 0; j < this.tiles[0].length; j++) {
        this.tiles[i][j].display();
      }
    }
    pop();
  }

  highlightTile(row, col) {
    push();
    this.tiles[row][col].highlightSelf();
    pop();
  }

  initializeEmptyBoard() {
    for (let i = 0; i < this.numTiles; i++) {
      this.tiles.push([]);
    }
  }

  initializeTiles() {
    for (let i = 0; i < this.numTiles; i++) {
      for (let j = 0; j < this.numTiles; j++) {
        this.tiles[i][j] = new Tile(i, j, this.x, this.y, this.boardSize, this.numTiles);
      }
    }
  }
}

class Tile {
  constructor(i, j, x, y, boardSize, numTiles) {
    this.row = i;
    this.col = j;
    this.tileSize = boardSize / numTiles;
    this.x = x + j * this.tileSize;
    this.y = boardSize - this.tileSize - y - i * this.tileSize;
    this.highlightColor = "#FFFF00";
    this.setTileColor();
  }

  setTileColor() {
    let lightColor = "#A8946F";
    let darkColor = "#4A1F14";

    this.color = ((this.row + this.col) % 2 == 0) ? darkColor : lightColor;
  }

  display() {
    push();
    noStroke();
    fill(this.color);
    rect(this.x, this.y, this.tileSize, this.tileSize);
    pop();
  }

  highlightSelf() {
    push();
    noFill();
    strokeWeight(4);
    stroke(this.highlightColor);
    rect(this.x, this.y, this.tileSize, this.tileSize);
    pop();
  }
}

function shouldGetRandomTile(board) {
  if (getNextRandomTile) {
    genRandomTile();
  }
}

function genRandomTile() {
  let rowIdx = getRandomDimen();
  let colIdx = getRandomDimen();

  currTile["row"] = rowIdx
  currTile["col"] = colIdx

  getNextRandomTile = false
}

function updateText(elementId, newText) {
  let textElt = document.getElementById(elementId);
  textElt.innerHTML = newText;
}

function getRandomDimen() {
  let max = 8;
  let min = 0;

  return Math.floor(Math.random() * (max - min)) + min;
}

function setupListeners() {
  setupSubmissionOnEnter("current-tile-prompt-text", currentTilePromptCallback);
}

function setupSubmissionOnEnter(submissionInput, callback) {
  let input = document.getElementById(submissionInput);

  input.addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
      event.preventDefault();
      callback(input.value);
      input.value = "";
    }
  });
}

function currentTilePromptCallback(submissionValue) {
  getNextRandomTile = true;
  isSubmissionCorrect(submissionValue);
  updateText("score-text", `Score: ${totalCorrect} / ${totalAttempts}`);
  updateText("previous-tile-text", `Previous: ${COL_IDX_TO_LETTER[currTile["col"]]}${currTile["row"] + 1}`);
}

function isSubmissionCorrect(submissionValue) {
  let rowIdx = submissionValue[1] - 1;
  let colIdx = COL_LETTER_TO_IDX[submissionValue[0]];

  if (currTile["row"] == rowIdx && currTile["col"] == colIdx) {
    totalCorrect += 1
  }

  totalAttempts += 1;
}

