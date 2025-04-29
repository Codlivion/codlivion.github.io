window.onload=function() {
    canv=document.getElementById("game-canvas");
    cx=canv.getContext("2d");
    canv.addEventListener("contextmenu", e => e.preventDefault());
    canv.addEventListener("mousedown", click);
    canv.addEventListener("touchstart", touch);
    setInterval(update, 1000/10);
}

const GRID_OFF = {x: 64, y: 64};
const GRID_SIZE = {w: 16, h: 16};
const GRID_COUNT = GRID_SIZE.w * GRID_SIZE.h;
const CELL_SIZE = 32;

var grid = new Array(GRID_COUNT).fill(0);
var visible = new Array(GRID_COUNT).fill("?");
var numOfMines = 40;
var score = 0;
var targetScore = GRID_COUNT - numOfMines;

var buttons = [false, false, false];
var mouseX, mouseY;

var win = false;
var gameOver = false;

var firstClick = true;

initField(); //initField after the first click?

function intersection(x, y, w, h) {
    return x >= 0 && x < w && y >= 0 && y < h;
}

function initField() {
    grid = new Array(GRID_COUNT).fill(0);
    visible = new Array(GRID_COUNT).fill("?");
    var count = 0;
    while (count < numOfMines) {
        var idx = Math.floor(Math.random() * GRID_COUNT);
        if (grid[idx] == 0) {
            grid[idx] = -1;
            count++;
        }
    }
    for (var i = 0; i < GRID_COUNT; i++) {
        if (grid[i] != -1) {
            count = 0;
            for (var y = -1; y <= 1; y++) {
                for (var x = -1; x <= 1; x++) {
                    var next = {x: (i % GRID_SIZE.w) + x, y: Math.floor(i / GRID_SIZE.w) + y};
                    if (intersection(next.x, next.y, GRID_SIZE.w, GRID_SIZE.h)) {
                        var idx = next.y * GRID_SIZE.w + next.x;
                        if (grid[idx] == -1) count++;
                    }
                }
            }
            grid[i] = count;
        }
    }
    win = false;
    gameOver = false;
    score = 0;
}

function openZeros(index, visited = []) {
    if (visited.includes(index)) return;
    visited.push(index);
    for (var y = -1; y <= 1; y++) {
        for (var x = -1; x <= 1; x++) {
            var next = {x: (index % GRID_SIZE.w) + x, y: Math.floor(index / GRID_SIZE.w) + y};
            if (intersection(next.x, next.y, GRID_SIZE.w, GRID_SIZE.h)) {
                var idx = next.y * GRID_SIZE.w + next.x;
                if (visible[idx] == "?") {
                    visible[idx] = grid[idx].toString();
                    score++;
                    if (grid[idx] == 0) openZeros(idx, visited);
                }
            }
        }
    }
}

function update() {
    if (buttons[0] || buttons[2]) {
        if (!win && !gameOver) {
            mouseX -= GRID_OFF.x;
            mouseY -= GRID_OFF.y;
            var clickedX = Math.floor(mouseX / CELL_SIZE);
            var clickedY = Math.floor(mouseY / CELL_SIZE);
            if (intersection(clickedX, clickedY, GRID_SIZE.w, GRID_SIZE.h)) {
                var idx = clickedY * GRID_SIZE.w + clickedX;
                if (buttons[0]) {
                    if (visible[idx] == "?") {
                        if (grid[idx] == 0) openZeros(idx);
                        else {
                            visible[idx] = grid[idx].toString();
                            if (grid[idx] == -1) {
                                gameOver = true;
                                for (var i = 0; i < grid.length; i++) {
                                    if (grid[i] == -1) visible[i] = grid[i];
                                }
                            }
                            else score++;
                            if (score == targetScore) win = true;
                        }
                    }
                }
                else if (buttons[2]) {
                    if (visible[idx] == "?") visible[idx] = "F";
                    else if (visible[idx] == "F") visible[idx] = "?";
                }
            }
        }
        else {
            initField();
        }
    }
    for (var i = 0; i < buttons.length; i++) buttons[i] = false;
    draw();
}

function draw() {
    cx.fillStyle = "gray";
    cx.fillRect(0, 0, canv.width, canv.height);
    cx.font = "20px Arial";
    cx.textAlign = "center";
    for (var i = 0; i < grid.length; i++) {
        var ix = i % GRID_SIZE.w;
        var iy = Math.floor(i / GRID_SIZE.w);
        ix = GRID_OFF.x + ix * CELL_SIZE;
        iy = GRID_OFF.y + iy * CELL_SIZE;
        cx.strokeStyle = "darkgray";
        cx.strokeRect(ix, iy, CELL_SIZE, CELL_SIZE);
        if (visible[i] == "?" || visible[i] == "F") {
            cx.fillStyle = "rgb(80, 80, 80)";
            cx.fillRect(ix + 1, iy + 1, CELL_SIZE - 2, CELL_SIZE - 2);
        }
        if (visible[i] != "?") {
            ix += CELL_SIZE / 2;
            iy += CELL_SIZE / 2 + 8;
            cx.fillStyle = (visible[i] == "F" || visible[i] == "-1") ? "red" : "green";
            if (visible[i] != 0) cx.fillText(visible[i], ix, iy);
        }
    }
    cx.fillStyle = gameOver ? "red" : "green";
    var info = win ? "YOU WIN!" : gameOver ? "YOU LOSE!" : "Spaces Left: " + (targetScore - score);
    cx.fillText(info, canv.width / 2, 32);
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