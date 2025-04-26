window.onload=function() {
    canv=document.getElementById("game-canvas");
    cx=canv.getContext("2d");
    canv.addEventListener("contextmenu", e => e.preventDefault());
    canv.addEventListener("mousedown", click);
    setInterval(update, 1000/10);
}

const GRID_OFF = {x: 72, y: 72};
const GRID_SIZE = {w: 4, h: 4};
const GRID_COUNT = GRID_SIZE.w * GRID_SIZE.h;
const CELL_SIZE = 64;

var symbols =
[
    "🐶", "🐱", "🐭", "🐹", "🐰", "🦊", "🐻", "🐼",
    "🐨", "🐯", "🦁", "🐮", "🐷", "🐸", "🐵", "🐤",
    "🐝", "🦋", "🐞", "🐢", "🐙", "🦑", "🦀", "🐬",
    "🦓", "🦒", "🐘", "🐊", "🦖", "🦕", "🐲", "🐉"
];
var grid = [];
var visible = new Array(GRID_COUNT).fill("?");
var matching = "?";
var showTimer = 10;
var temp1 = -1;
var temp2 = -1;
var win = false;

var buttons = [false, false, false];
var mouseX, mouseY;

function intersection(x, y, w, h) {
    return x >= 0 && x < w && y >= 0 && y < h;
}

function shuffle(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * i + 1);
        [array[i], array[j]] = [array[j], array[i]];
    }
}

restart();

function restart() {
    var sample = symbols.slice();
    shuffle(sample);
    var selected = sample.slice(0, Math.floor(GRID_COUNT / 2));
    grid = selected.concat(selected);
    shuffle(grid);
    for (var i = 0; i < visible.length; i++) visible[i] = "?";
    win = false;
}

function update() {
    if (showTimer > 0) {
        showTimer--;
        if (showTimer <= 0) {
            showTimer = 0;
            visible[temp1] = "?";
            visible[temp2] = "?";
            temp1 = -1;
                            temp2 = -1;
        }
    }

    if (showTimer <= 0 && buttons[0]) {
        if (!win) {
            mouseX -= GRID_OFF.x;
            mouseY -= GRID_OFF.y;
            var clickedX = Math.floor(mouseX / CELL_SIZE);
            var clickedY = Math.floor(mouseY / CELL_SIZE);
            if (intersection(clickedX, clickedY, GRID_SIZE.w, GRID_SIZE.h)) {
                var idx = clickedY * GRID_SIZE.w + clickedX;
                if (matching != "?") {
                    if (idx != temp1) {
                        visible[idx] = grid[idx];
                        if (grid[idx] == matching) {
                            matching = "?";
                            temp1 = -1;
                            temp2 = -1;
                        }
                        else {
                            showTimer = 10;
                            matching = "?";
                            temp2 = idx;
                        }
                    }
                }
                else {
                    visible[idx] = grid[idx]
                    matching = grid[idx]
                    temp1 = idx
                }
                var success = true;
                for (var i = 0; i < visible.length; i++) {
                    if (visible[i] == "?") success = false;
                }
                if (success) win = true;
            }
        }
        else {
            restart();
        }
    }
    for (var i = 0; i < buttons.length; i++) buttons[i] = false;
    draw();
}

function draw() {
    cx.fillStyle = "black";
    cx.fillRect(0, 0, canv.width, canv.height);
    cx.fillStyle = "green";
    cx.font = "20px Arial";
    cx.textAlign = "center";
    for (var i = 0; i < grid.length; i++) {
        var ix = i % GRID_SIZE.w;
        var iy = Math.floor(i / GRID_SIZE.w);
        ix = GRID_OFF.x + ix * CELL_SIZE;
        iy = GRID_OFF.y + iy * CELL_SIZE;
        cx.strokeStyle = "green";
        cx.strokeRect(ix, iy, CELL_SIZE, CELL_SIZE);
        ix += CELL_SIZE / 2;
        iy += CELL_SIZE / 2 + 8;
        if (visible[i] != "?") {
            cx.fillText(visible[i], ix, iy);
        }
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