window.onload=function() {
    canv=document.getElementById("game-canvas");
    cx=canv.getContext("2d");
    canv.addEventListener("contextmenu", e => e.preventDefault());
    document.addEventListener("click", click);
    setInterval(update, 1000/10);
}

CanvasRenderingContext2D.prototype.fillCircle = function(x, y, radius) {
    this.beginPath();
    this.arc(x + CELL_SIZE / 2, y + CELL_SIZE / 2, radius, 0, 2 * Math.PI);
    this.fill();
};

const Space = Object.freeze({
    NONE: 0,
    GREEN: 1,
    RED: 2
});

const GRID_OFF = {x: 88, y: 104};
const GRID_SIZE = {w: 7, h: 6};
const GRID_COUNT = GRID_SIZE.w * GRID_SIZE.h;
const CELL_SIZE = 32;

var grid = new Array(GRID_COUNT).fill(Space.NONE);
var dirs = [{x: -1, y: 0}, {x: 1, y: 0}, {x: 0, y: -1}, {x: 0, y: 1}, {x: -1, y: -1}, {x: 1, y: 1}, {x: -1, y: 1}, {x: 1, y: -1}]
var turn = Space.GREEN;

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
                var pos = {x: clickedX, y: 0};
                while (pos.y < GRID_SIZE.h) {
                    if (grid[pos.y * GRID_SIZE.w + pos.x] == Space.NONE) pos.y += 1;
                    else break;
                }
                if (pos.y > 0) pos.y -= 1;
                var idx = pos.y * GRID_SIZE.w + pos.x;
                if (grid[idx] == Space.NONE) {
                    grid[idx] = turn;
                    for (var i = 0; i < 4; i++) {
                        var m = i * 2;
                        var n = m + 1;
                        pos = {x: idx % GRID_SIZE.w, y: Math.floor(idx / GRID_SIZE.w)};
                        while (pos.x >= 0 && pos.x < GRID_SIZE.w && pos.y >= 0 && pos.y < GRID_SIZE.h) {
                            if (grid[pos.y * GRID_SIZE.w + pos.x] != turn) break;
                            pos.x += dirs[m].x;
                            pos.y += dirs[m].y;
                        }
                        pos.x -= dirs[m].x;
                        pos.y -= dirs[m].y;
                        var count = 0;
                        while (pos.x >= 0 && pos.x < GRID_SIZE.w && pos.y >= 0 && pos.y < GRID_SIZE.h) {
                            if (grid[pos.y * GRID_SIZE.w + pos.x] != turn) break;
                            pos.x += dirs[n].x;
                            pos.y += dirs[n].y;
                            count += 1;
                            if (count > 3) {
                                win = true;
                                break;
                            }
                        }
                        if (win) break;
                    }
                    if (!win) turn = turn == Space.GREEN ? Space.RED : Space.GREEN;
                }
            }
        }
        else {
            grid = new Array(GRID_COUNT).fill(Space.NONE);
            win = false;
            turn = turn == Space.GREEN ? Space.RED : Space.GREEN;
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
        cx.strokeStyle = "white";
        cx.strokeRect(ix, iy, CELL_SIZE, CELL_SIZE);
        if (grid[i] != Space.NONE) {
            cx.fillStyle = grid[i] == Space.GREEN ? "green" : "red";
            cx.fillCircle(ix, iy, CELL_SIZE / 4);
        }
    } 

    cx.fillStyle =  turn == Space.GREEN ? "green" : "red";
    cx.font = "20px Arial";
    cx.textAlign = "center";
    if (win) var info = turn == Space.GREEN ? "GREEN WINS!" : "RED WINS!";
    else var info = turn == Space.GREEN ? "GREEN'S TURN" : "RED'S TURN";
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