// x is left right, y is up and down.
function initEmptySandPositions(x_dim, y_dim) {
  const arr = new Array(x_dim);
  for (let i = 0; i < x_dim; i++) {
    const row = new Array(y_dim);
    for (let j = 0; j < y_dim; j++) {
      row[j] = 0;
    }
    arr[i] = row;
  }
  return arr;
}

function setSquare(matrix, cx, cy, radius, value) {
  const rows = matrix.length;
  const cols = matrix[0].length;

  for (let i = cx - radius; i <= cx + radius; i++) {
    for (let j = cy - radius; j <= cy + radius; j++) {
      if (i < 0 || i >= rows || j < 0 || j >= cols) continue;
      matrix[i][j] = value;
    }
  }
}

function initCanvas(width, height) {
  const canvas = document.createElement("canvas");
  canvas.id = "sandCanvas";
  canvas.width = width;
  canvas.height = height;
  return canvas;
}
const numberOfRows = 500;
const numberOfColumns = 500;
const canvas = initCanvas(numberOfColumns, numberOfRows)
const container = document.getElementById("sandCanvasDiv");
container.appendChild(canvas);
let sandPositions = initEmptySandPositions(numberOfRows, numberOfColumns)
const grainSize = 5;

function drawCanvas() {
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let x = 0; x < numberOfRows; ++x) {
    for (let y = 0; y < numberOfColumns; ++y) {
      if (sandPositions[x][y] !== 0) {
        ctx.fillRect(x, y, 1, 1);
      }
    }
  }
}

function startProcessing(fps, functionToRun) {
  const interval = 1000 / fps;
  let lastTime = 0;

  function update(timestamp) {
    if (timestamp - lastTime >= interval) {
      lastTime = timestamp;

      functionToRun()
    }

    requestAnimationFrame(update);
  }

// Start loop
  requestAnimationFrame(update);
}


function simulateGravity() {
  const newSandPositions = initEmptySandPositions(numberOfRows, numberOfColumns);

  for (let x = 0; x < numberOfRows; ++x) {
    for (let y = 0; y < numberOfColumns; ++y) {
      const below = y + 1;
      const isSand = sandPositions[x][y] !== 0;
      const atBottom = below >= numberOfColumns;
      if (!atBottom && isSand && sandPositions[x][below] === 0) { // in air, can fall
        newSandPositions[x][below] = sandPositions[x][y];
      } else { // sitting on another grain of sand.
        newSandPositions[x][y] = newSandPositions[x][y] || sandPositions[x][y];
      }
    }
  }
  return newSandPositions;
}


function process() {
  sandPositions = simulateGravity();
  drawCanvas();
}

function main() {
  const sandCanvas = document.getElementById('sandCanvas');
  sandCanvas.addEventListener("mousemove", (e) => {
    const rect = sandCanvas.getBoundingClientRect();
    const x = Math.floor(e.clientX - rect.left);
    const y = Math.floor(e.clientY - rect.top);

    setSquare(sandPositions, x, y, grainSize, 1)
    sandPositions[x][y] = 1;
  });
  startProcessing(144,process);
  // process();
}


main();
