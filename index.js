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
}

main();
