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
        const value = sandPositions[x][y]
        ctx.fillStyle = `rgb(${value}, ${255 - value}, 128)`

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

  for (let x = 1; x < numberOfRows - 1; ++x) {
    for (let y = 0; y < numberOfColumns; ++y) {
      const belowIdx = y + 1;
      const sandValue = sandPositions[x][y];
      const belowRValue = sandPositions[x + 1][belowIdx];
      const belowLValue = sandPositions[x - 1][belowIdx];
      if (sandValue !== 0) {
        if (sandPositions[x][belowIdx] === 0) { // in air, can fall
          newSandPositions[x][belowIdx] = sandValue;
        } else if (belowLValue === 0) {
          newSandPositions[x - 1][y] = sandValue;
        }else if (belowRValue === 0) {
          newSandPositions[x + 1][y] = sandValue;
        } else { // sitting on another grain of sand.
          newSandPositions[x][y] = sandValue;
        }
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
  function getCanvasPos(canvas, clientX, clientY) {
    const rect = canvas.getBoundingClientRect();
    return {
      x: Math.floor(clientX - rect.left),
      y: Math.floor(clientY - rect.top)
    };
  }

  function drawAt(x, y) {
    setSquare(sandPositions, x, y, grainSize, Math.random() * 256);
  }

  /* Mouse */
  sandCanvas.addEventListener("mousemove", (e) => {
    if (e.buttons !== 1) return; // draw only when mouse button held
    const { x, y } = getCanvasPos(sandCanvas, e.clientX, e.clientY);
    drawAt(x, y);
  });

  /* Touch */
  sandCanvas.addEventListener("touchmove", (e) => {
    e.preventDefault(); // stop page scrolling
    const touch = e.touches[0];
    const { x, y } = getCanvasPos(sandCanvas, touch.clientX, touch.clientY);
    drawAt(x, y);
  }, { passive: false });

  sandCanvas.addEventListener("touchstart", (e) => {
    const touch = e.touches[0];
    const { x, y } = getCanvasPos(sandCanvas, touch.clientX, touch.clientY);
    drawAt(x, y);
  });
  startProcessing(144,process);
}


main();
