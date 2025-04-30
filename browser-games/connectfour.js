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

class piece {
    constructor() {
        this.color = Space.NONE;
        this.hVal = 0;
        this.vVal = 0;
        this.fDiag = 0;
        this.bDiag = 0;
    }

    set(col) {
        this.color = col;
    }
}

const GRID_OFF = {x: 88, y: 104};
const GRID_W = 7;
const GRID_H = 6;
const GRID_COUNT = GRID_W * GRID_H;
const CELL_SIZE = 32;

var grid = new Array(GRID_COUNT);
for (var i = 0; i < GRID_COUNT; i++) grid[i] = new piece();
var dirs = [{x: -1, y: 0}, {x: 1, y: 0}, {x: 0, y: -1}, {x: 0, y: 1}, {x: -1, y: -1}, {x: 1, y: 1}, {x: -1, y: 1}, {x: 1, y: -1}];
var columns = [5, 5, 5, 5, 5, 5, 5];
const history = [];
var turn = Space.YELLOW;

var buttons = [false, false, false];
var mouseX, mouseY;

var win = false;

var scores = new Array(GRID_COUNT).fill(0);

function intersection(x, y, w, h) {
    return x >= 0 && x < w && y >= 0 && y < h;
}

function playColumn(x) {
    if (columns[x] < 0) return -1;

    var idx = columns[x] * columns.length + x;
    grid[idx].color = turn;
    columns[x] -= 1;
    history.push(idx);
    return idx;
}

function unplayLast() {
    if (history.length > 0) {
        var idx = history.pop();
        grid[idx].color = Space.NONE;
        columns[idx % columns.length] += 1;
    }
}

function scoreGrid() {
    scores = new Array(GRID_COUNT).fill(0);
    for (var x = 0; x < GRID_W; x++) {
        if (columns[x] >= 0 && columns[x] < 5) {
            var y = columns[x] + 1;
            while (y < GRID_H) {
                var idx = y * GRID_W + x;
                var matrix = [grid[idx].hVal, grid[idx].hVal, grid[idx].vVal, grid[idx].vVal, grid[idx].bDiag, grid[idx].bDiag, grid[idx].fDiag, grid[idx].fDiag];
                for (var i = 0; i < dirs.length; i++) {
                    var nx = x + dirs[i].x;
                    var ny = y + dirs[i].y;
                    if (nx >= 0 && nx < GRID_W && ny >= 0 && ny < GRID_H) {
                        if (grid[ny * GRID_W + nx].color == Space.NONE) scores[ny * GRID_W + nx] += matrix[i];
                    }
                }
                y++;
            }
        }
    }
}

function decide() {
    scoreGrid();
    var centerBonus = [0, 1, 2, 3, 2, 1, 0];
    var sums = new Array(GRID_W).fill(0);
    for (var x = 0; x < GRID_W; x++) {
        if (columns[x] >= 0) {
            scores[columns[x] * GRID_W + x] += centerBonus[x];
            sums[x] = scores[columns[x] * GRID_W + x];
        }
        /*
        var y = 0;
        //var mult = (columns[x] % 2) == 1 ? 1 : -1;
        while (y < GRID_H) {
            var idx = y * GRID_W + x;
            sums[x] += scores[idx]; //* mult
            y++;
            //mult *= -1;
        }
        */
    }
    return sums.indexOf(Math.max(...sums));
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
                if (intersection(clickedX, clickedY, GRID_W, GRID_H)) {
                    played = playColumn(clickedX);
                }
            }
        }
        if (played != -1) {
            for (var i = 0; i < 4; i++) {
                var m = i * 2;
                var n = m + 1;
                var pos = {x: played % GRID_W, y: Math.floor(played / GRID_W)};
                while (pos.x >= 0 && pos.x < GRID_W && pos.y >= 0 && pos.y < GRID_H) {
                    if (grid[pos.y * GRID_W + pos.x].color != turn) break;
                    pos.x += dirs[m].x;
                    pos.y += dirs[m].y;
                }
                pos.x -= dirs[m].x;
                pos.y -= dirs[m].y;
                var count = 0;
                var counted = [];
                while (pos.x >= 0 && pos.x < GRID_W && pos.y >= 0 && pos.y < GRID_H) {
                    if (grid[pos.y * GRID_W + pos.x].color != turn) break;
                    count += 1;
                    counted.push(grid[pos.y * GRID_W + pos.x]);
                    if (count > 3) {
                        win = true;
                        break;
                    }
                    pos.x += dirs[n].x;
                    pos.y += dirs[n].y;
                }
                if (win) break;
                if (i==0) counted.forEach((p) =>{p.hVal  = Math.pow(10, count)});
                if (i==1) counted.forEach((p) =>{p.vVal  = Math.pow(10, count)});
                if (i==2) counted.forEach((p) =>{p.bDiag = Math.pow(10, count)});
                if (i==3) counted.forEach((p) =>{p.fDiag = Math.pow(10, count)});
            }
            if (!win) turn = turn == Space.YELLOW ? Space.RED : Space.YELLOW;
            scoreGrid();
        }
    }
    else {
        if (buttons[0]) {
            for (var i = 0; i < GRID_COUNT; i++) grid[i] = new piece();
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
    cx.fillRect(GRID_OFF.x, GRID_OFF.y, GRID_W * CELL_SIZE, GRID_H * CELL_SIZE);
    for (var i = 0; i < grid.length; i++) {
        var ix = i % GRID_W;
        var iy = Math.floor(i / GRID_W);
        ix = GRID_OFF.x + ix * CELL_SIZE;
        iy = GRID_OFF.y + iy * CELL_SIZE;
        cx.fillStyle = grid[i].color == Space.YELLOW ? "yellow" : grid[i].color == Space.RED ? "red" : "black";
        cx.fillCircle(ix, iy, CELL_SIZE / 4);
        
        //cx.fillStyle = grid[i].color == Space.YELLOW ? "yellow" : grid[i].color == Space.RED ? "red" : "darkblue";
        //cx.fillText(scores[i], ix, iy);
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