window.onload=function() {
    canv=document.getElementById("game-canvas");
    cx=canv.getContext("2d");
    canv.addEventListener("contextmenu", e => e.preventDefault());
    document.addEventListener("click", click);
    canv.addEventListener("touchstart", touch);
    setInterval(update, 1000/10);
}

const GRID_OFF = {x: 120, y: 120};
const GRID_SIZE = {w: 5, h: 5};
const GRID_COUNT = GRID_SIZE.w * GRID_SIZE.h;
const CELL_SIZE = 32;

var grid = new Array(GRID_COUNT).fill(false);
var dirs = [{x: -1, y: 0}, {x: 1, y: 0}, {x: 0, y: -1}, {x: 0, y: 1}]

var buttons = [false, false, false];
var mouseX, mouseY;

var win = false;

function intersection(x, y, w, h) {
    return x >= 0 && x < w && y >= 0 && y < h;
}

function update() {
    if (buttons[0]) {
        if (!win) {
            mouseX -= GRID_OFF.x;
            mouseY -= GRID_OFF.y;
            var clickedX = Math.floor(mouseX / CELL_SIZE);
            var clickedY = Math.floor(mouseY / CELL_SIZE);
            if (intersection(clickedX, clickedY, GRID_SIZE.w, GRID_SIZE.h)) {
                var idx = clickedY * GRID_SIZE.w + clickedX;
                grid[idx] = !grid[idx];
                for (var i = 0; i < dirs.length; i++) {
                    var nxt = {x: (idx % GRID_SIZE.w) + dirs[i].x, y: Math.floor(idx / GRID_SIZE.w) + dirs[i].y};
                    if (intersection(nxt.x, nxt.y, GRID_SIZE.w, GRID_SIZE.h)) {
                        var nxt_idx = nxt.y * GRID_SIZE.w + nxt.x;
                        grid[nxt_idx] = !grid[nxt_idx];
                    }
                }
                if (grid.every(b => b == true)) win = true;
            }
        }
        else {
            grid = new Array(GRID_COUNT).fill(false);
            win = false;
        }
    }
    for (var i = 0; i < buttons.length; i++) buttons[i] = false;
    draw();
}

function draw() {
    cx.fillStyle = "black";
    cx.fillRect(0, 0, canv.width, canv.height);
    for (var i = 0; i < grid.length; i++) {
        var ix = i % GRID_SIZE.w;
        var iy = Math.floor(i / GRID_SIZE.w);
        ix = GRID_OFF.x + ix * CELL_SIZE;
        iy = GRID_OFF.y + iy * CELL_SIZE;
        cx.fillStyle = grid[i] ? "rgb(0, 255, 0)" : "rgb(0, 64, 0)";
        cx.fillRect(ix, iy, CELL_SIZE, CELL_SIZE);
        cx.strokeStyle = "black";
        cx.strokeRect(ix, iy, CELL_SIZE, CELL_SIZE);
    } 
    if (win) {
        cx.fillStyle = "green";
        cx.font = "20px Arial";
        cx.textAlign = "center";
        cx.fillText("YOU WIN!", canv.width / 2, 32);
    }
}

function click(e) {
    var rect = canv.getBoundingClientRect();
    mouseX = e.clientX - rect.left;
    mouseY = e.clientY - rect.top;
    if (e.button == 0) buttons[0] = true;
    if (e.button == 1) buttons[1] = true;
    if (e.button == 2) buttons[2] = true;
}

function touch(e) {
    e.preventDefault();
    const rect = canv.getBoundingClientRect();
    const touch = e.touches[0];
    mouseX = (touch.clientX - rect.left) * (canv.width / rect.width);
    mouseY = (touch.clientY - rect.top) * (canv.height / rect.height);
    buttons[0] = true;
}