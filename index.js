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

function drawCanvas() {
  for (let x = 0; x < numberOfRows; ++x) {
    for (let y = 0; y < numberOfColumns; ++y) {
      if (sandPositions[x][y] !== 0) {
        const ctx = canvas.getContext("2d");
        ctx.fillRect(x, y, 10, 10);
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
      const below = x + 1;
      if (below >= numberOfRows)
        continue;

      const isSand = sandPositions[x][y] !== 0;
      const belowIsEmpty = sandPositions[below] === 0;

      if (isSand && belowIsEmpty) {
        newSandPositions[x][y + 1] = 1;
      } else if (isSand) {
        newSandPositions[x][y] = 1;
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
    sandPositions[x][y] = 1;
  });
  startProcessing(144,process);
  // process();
}


main();
