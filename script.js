const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 600;
canvas.height = 400;

let isPainting = false;
let isStraightMode = false;
let isErasing = false;

let lineWidth = 5;
let startX, startY;

// Save the last drawing color so we can restore after erasing
let currentColor = "#000000";

// ----- Toolbar -----

document.getElementById("stroke").addEventListener("change", (e) => {
    currentColor = e.target.value;
    ctx.strokeStyle = currentColor;

    // Leave eraser mode automatically when a color is chosen
    isErasing = false;
    document.getElementById("eraser").style.backgroundColor = "";
});

document.getElementById("lineWidth").addEventListener("change", (e) => {
    lineWidth = parseInt(e.target.value);
});

document.getElementById("efface").addEventListener("click", () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
});

document.getElementById("straight").addEventListener("click", () => {
    isStraightMode = !isStraightMode;
    document.getElementById("straight").style.backgroundColor =
        isStraightMode ? "lightgreen" : "";
});

document.getElementById("eraser").addEventListener("click", () => {
    isErasing = !isErasing;
    isStraightMode = false;

    document.getElementById("eraser").style.backgroundColor =
        isErasing ? "lightgreen" : "";

    document.getElementById("straight").style.backgroundColor = "";

    ctx.strokeStyle = isErasing ? "white" : currentColor;
});

document.getElementById("save").addEventListener("click", () => {
    const image = canvas.toDataURL("image/png");

    const link = document.createElement("a");
    link.download = "dessin.png";
    link.href = image;
    link.click();
});

// ----- Drawing Logic -----

function draw(e) {
    if (!isPainting || isStraightMode) return;

    ctx.lineWidth = lineWidth;
    ctx.lineCap = "round";

    ctx.strokeStyle = isErasing ? "white" : currentColor;

    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.stroke();
}

canvas.addEventListener("mousedown", (e) => {
    isPainting = true;

    startX = e.offsetX;
    startY = e.offsetY;

    ctx.beginPath();
    ctx.moveTo(startX, startY);
});

canvas.addEventListener("mouseup", (e) => {
    if (isStraightMode) {
        ctx.beginPath();
        ctx.lineWidth = lineWidth;
        ctx.strokeStyle = currentColor;
        ctx.moveTo(startX, startY);
        ctx.lineTo(e.offsetX, e.offsetY);
        ctx.stroke();
    }

    isPainting = false;
    ctx.beginPath();
});

canvas.addEventListener("mousemove", draw);
git