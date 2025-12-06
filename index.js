

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


function simulateGravity(imageData) {
  const width = imageData.width;
  const height = imageData.height;
  const src = imageData.data;
  const result = new Uint8ClampedArray(src); // copy original data

  for (let y = height - 2; y >= 0; y--) {
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * 4;
      const belowI = ((y + 1) * width + x) * 4;

      const isColored = src[i + 3] !== 0; // alpha > 0
      const belowIsEmpty = src[belowI + 3] === 0;

      if (isColored && belowIsEmpty) {
        // "Move" the pixel down in the result
        result[belowI] = src[i];     // R
        result[belowI + 1] = src[i + 1]; // G
        result[belowI + 2] = src[i + 2]; // B
        result[belowI + 3] = src[i + 3]; // A

        // Clear the current pixel
        result[i] = 0;
        result[i + 1] = 0;
        result[i + 2] = 0;
        result[i + 3] = 0;
      }
    }
  }

  return result;
}


function process() {
  const sandCanvas = document.getElementById('sandCanvas');
  const ctx = sandCanvas.getContext("2d");

  const imageData = ctx.getImageData(0, 0, sandCanvas.width, sandCanvas.height);
  const nextPixels = simulateGravity(imageData);

  const newImageData = new ImageData(nextPixels, sandCanvas.width, sandCanvas.height);
  ctx.putImageData(newImageData, 0, 0);
}

function main() {
  const sandCanvas = document.getElementById('sandCanvas');
  const ctx = sandCanvas.getContext("2d");

  sandCanvas.addEventListener("mousemove", (e) => {
    const rect = sandCanvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.fillStyle = "black";
    ctx.fillRect(x, y, 2, 2);
  });
  startProcessing(60,process);
  // process();
}

main();
