// We'll build this together, step by step:
// 1. Get the canvas + context
// 2. Size the canvas to its container (and handle resize)
// 3. Track mouse/touch events to draw lines
// 4. Wire up the tool buttons, color picker, brush size, clear, and save

// ---------- 1. Grab all the elements we'll need ----------

// The canvas itself + its 2D "pen" (context)
const canvas = document.getElementById("drawCanvas");
const ctx = canvas.getContext("2d");

// Controls
const colorPicker = document.getElementById("colorPicker");
const brushSize = document.getElementById("brushSize");
const brushSizeValue = document.getElementById("brushSizeValue");

// Buttons
const clearBtn = document.getElementById("clearBtn");
const saveBtn = document.getElementById("saveBtn");

// All tool buttons (pen, eraser, line, rect, circle) — a list, not a single element
const toolButtons = document.querySelectorAll(".tool-btn");

// ---------- 2. Size the canvas to match how big it looks on screen ----------

function resizeCanvas() {
  // Save whatever is currently drawn, because resizing wipes the canvas
  const imageData = canvas.toDataURL();

  const rect = canvas.getBoundingClientRect();
  canvas.width = rect.width;
  canvas.height = rect.height;

  // Restore the drawing after resizing
  const img = new Image();
  img.onload = () => ctx.drawImage(img, 0, 0);
  img.src = imageData;
}

resizeCanvas();
window.addEventListener("resize", resizeCanvas);

// ---------- 3. Track the drawing state ----------

let isDrawing = false;   // are we currently mid-stroke?
let lastX = 0;           // last known x position
let lastY = 0;           // last known y position
let currentTool = "pen"; // which tool is active right now

// ---------- 4. Helper: convert a mouse/touch event into canvas coordinates ----------

function getPos(e) {
  const rect = canvas.getBoundingClientRect();
  // Support both mouse events and touch events
  const clientX = e.touches ? e.touches[0].clientX : e.clientX;
  const clientY = e.touches ? e.touches[0].clientY : e.clientY;

  return {
    x: clientX - rect.left,
    y: clientY - rect.top
  };
}

// ---------- 5. Pen tool: draw on mousedown → mousemove → mouseup ----------

let snapshot = null; // stores a copy of the canvas before drawing a shape preview

function startDrawing(e) {
  isDrawing = true;
  const pos = getPos(e);
  lastX = pos.x;
  lastY = pos.y;

  // For shape tools, remember what the canvas looked like BEFORE this stroke,
  // so we can redraw that + a fresh preview shape on every mouse move
  // (otherwise you'd get a trail of shapes instead of one that follows the cursor).
  if (["line", "rect", "circle"].includes(currentTool)) {
    snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height);
  }
}

function draw(e) {
  if (!isDrawing) return; // do nothing unless the mouse button is held down

  const pos = getPos(e);

  ctx.strokeStyle = currentTool === "eraser" ? "#ffffff" : colorPicker.value;
  ctx.lineWidth = brushSize.value;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  if (currentTool === "pen" || currentTool === "eraser") {
    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();

    lastX = pos.x;
    lastY = pos.y;
    return;
  }

  // Shape tools: restore the pre-shape snapshot, then draw a fresh preview
  // from the starting point to the current cursor position.
  ctx.putImageData(snapshot, 0, 0);
  ctx.beginPath();

  if (currentTool === "line") {
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(pos.x, pos.y);
  }

  if (currentTool === "rect") {
    const width = pos.x - lastX;
    const height = pos.y - lastY;
    ctx.rect(lastX, lastY, width, height);
  }

  if (currentTool === "circle") {
    const radius = Math.hypot(pos.x - lastX, pos.y - lastY);
    ctx.arc(lastX, lastY, radius, 0, Math.PI * 2);
  }

  ctx.stroke();
}

function stopDrawing() {
  isDrawing = false;
  snapshot = null;
}

// Mouse events
canvas.addEventListener("mousedown", startDrawing);
canvas.addEventListener("mousemove", draw);
canvas.addEventListener("mouseup", stopDrawing);
canvas.addEventListener("mouseleave", stopDrawing); // stop if the cursor leaves the canvas mid-stroke

// Touch events (phones/tablets)
canvas.addEventListener("touchstart", startDrawing);
canvas.addEventListener("touchmove", draw);
canvas.addEventListener("touchend", stopDrawing);

// ---------- 6. Switching tools ----------

toolButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    // Remove "active" styling from every button...
    toolButtons.forEach((b) => b.classList.remove("active"));
    // ...then add it back only to the one that was clicked
    btn.classList.add("active");

    currentTool = btn.dataset.tool; // reads the data-tool="pen" attribute
  });
});// ---------- 7. Clear button ----------

clearBtn.addEventListener("click", () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
});

// ---------- 8. Save / download button ----------

saveBtn.addEventListener("click", () => {
  // Since the canvas background is white via CSS but the pixels themselves
  // are transparent where you haven't drawn, let's flatten it onto a white
  // background before exporting — otherwise a saved PNG could look wrong
  // on dark backgrounds.
  const exportCanvas = document.createElement("canvas");
  exportCanvas.width = canvas.width;
  exportCanvas.height = canvas.height;

  const exportCtx = exportCanvas.getContext("2d");
  exportCtx.fillStyle = "#ffffff";
  exportCtx.fillRect(0, 0, exportCanvas.width, exportCanvas.height);
  exportCtx.drawImage(canvas, 0, 0);

  const link = document.createElement("a");
  link.download = `sketchboard-${Date.now()}.png`;
  link.href = exportCanvas.toDataURL("image/png");
  link.click();
});