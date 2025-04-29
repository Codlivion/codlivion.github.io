window.onload=function() {
    canv=document.getElementById("game-canvas");
    cx=canv.getContext("2d");
    canv.addEventListener("contextmenu", e => e.preventDefault());
    canv.addEventListener("mousedown", click);
    canv.addEventListener("touchstart", touch);
    setInterval(update, 1000/10);
}

CanvasRenderingContext2D.prototype.fillCircle = function(x, y, radius) {
    this.beginPath();
    this.arc(x + CELL_SIZE / 2, y + CELL_SIZE / 2, radius, 0, 2 * Math.PI);
    this.fill();
};

const Space = Object.freeze({
    NONE: 0,
    YELLOW: 1,
    RED: 2
});

const GRID_OFF = {x: 88, y: 104};
const GRID_SIZE = {w: 7, h: 6};
const GRID_COUNT = GRID_SIZE.w * GRID_SIZE.h;
const CELL_SIZE = 32;

var grid = new Array(GRID_COUNT).fill(Space.NONE);
var dirs = [{x: -1, y: 0}, {x: 1, y: 0}, {x: 0, y: -1}, {x: 0, y: 1}, {x: -1, y: -1}, {x: 1, y: 1}, {x: -1, y: 1}, {x: 1, y: -1}];
var columns = [5, 5, 5, 5, 5, 5, 5];
const history = [];
var turn = Space.YELLOW;

var buttons = [false, false, false];
var mouseX, mouseY;

var win = false;

function intersection(x, y, w, h) {
    return x >= 0 && x < w && y >= 0 && y < h;
}

function playColumn(x) {
    if (columns[x] < 0) return -1;

    var idx = columns[x] * columns.length + x;
    grid[idx] = turn;
    columns[x] -= 1;
    history.push(idx);
    return idx;
}

function unplayLast() {
    if (history.length > 0) {
        var idx = history.pop();
        grid[idx] = Space.NONE;
        columns[idx % columns.length] += 1;
    }
}

function scoreColumn(x) {
    var highest = 0;
    for (var i = 0; i < 4; i++) {
        var m = i * 2;
        var n = m + 1;
        var pos = {x: x, y: columns[x]};
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
        }
        highest = Math.max(highest, count);
    }
    var score = 0;
    if (highest >= 4) score = 1000;
    else if (highest == 3) score = 100;
    else if (highest == 2) score = 10;
    else score = 1;
    var h = x > 3 ? 6 - x : x;
    return score + Math.pow(2, h);
}

function decide() {
    var col = 3;
    var highest = 0;
    for (var c = 0; c < columns.length; c++) {
        if (columns[c] >= 0) {
            playColumn(c);
            var score = scoreColumn(c);
            if (score > highest) {
                col = c;
                highest = score;
            }
            unplayLast();
        }
    }
    return col;
}

function update() {
    if (!win) {
        var played = -1;
        if (turn == Space.RED) {
            var d = decide();
            played = playColumn(d);
        }
        else {
            if (buttons[0]) {
                mouseX -= GRID_OFF.x;
                mouseY -= GRID_OFF.y;
                var clickedX = Math.floor(mouseX / CELL_SIZE);
                var clickedY = Math.floor(mouseY / CELL_SIZE);
                if (intersection(clickedX, clickedY, GRID_SIZE.w, GRID_SIZE.h)) {
                    played = playColumn(clickedX);
                }
            }
        }
        if (played != -1) {
            for (var i = 0; i < 4; i++) {
                var m = i * 2;
                var n = m + 1;
                pos = {x: played % GRID_SIZE.w, y: Math.floor(played / GRID_SIZE.w)};
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
            if (!win) turn = turn == Space.YELLOW ? Space.RED : Space.YELLOW;
        }
    }
    else {
        if (buttons[0]) {
            grid = new Array(GRID_COUNT).fill(Space.NONE);
            for (var i = 0; i < columns.length; i++) columns[i] = 5;
            win = false;
            turn = turn == Space.YELLOW ? Space.RED : Space.YELLOW;
        }
    }
    for (var i = 0; i < buttons.length; i++) buttons[i] = false;
    draw();
}

function draw() {
    cx.fillStyle = "black";
    cx.fillRect(0, 0, canv.width, canv.height);
    cx.fillStyle = "darkblue";
    cx.fillRect(GRID_OFF.x, GRID_OFF.y, GRID_SIZE.w * CELL_SIZE, GRID_SIZE.h * CELL_SIZE);
    for (var i = 0; i < grid.length; i++) {
        var ix = i % GRID_SIZE.w;
        var iy = Math.floor(i / GRID_SIZE.w);
        ix = GRID_OFF.x + ix * CELL_SIZE;
        iy = GRID_OFF.y + iy * CELL_SIZE;
        cx.fillStyle = grid[i] == Space.YELLOW ? "yellow" : grid[i] == Space.RED ? "red" : "black";
        cx.fillCircle(ix, iy, CELL_SIZE / 4);
    } 

    cx.fillStyle =  turn == Space.YELLOW ? "yellow" : "red";
    cx.font = "20px Arial";
    cx.textAlign = "center";
    if (win) var info = turn == Space.YELLOW ? "YELLOW WINS!" : "RED WINS!";
    else var info = turn == Space.YELLOW ? "YELLOW'S TURN" : "RED'S TURN";
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