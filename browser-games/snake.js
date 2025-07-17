window.onload=function() {
    canv=document.getElementById("game-canvas");
    cx=canv.getContext("2d");
    document.addEventListener("keydown", keyPush);
    canv.addEventListener("touchstart", touch);
    setInterval(update, 1000/10);
}

const FIELD = {w: 25, h: 25};
const CELL_SIZE = 16;

var keys = [false, false, false, false, false];
var cRect = {x: 160, y: 160, ex: 240, ey: 240};

var snake = [{x: 10, y: 10}];
var dir = {x: 1, y: 0};
var food = {x: 20, y: 20};
var dirChanged = false;
var gameOver = false;

var score = 0;

var inGame = false;

function aspectRatio() {
    return canv.width / canv.height;
}

function hitSelf(x, y) {
    var hit = false;
    for (var i = 0; i < snake.length; i++) {
        if (x == snake[i].x && y == snake[i].y) {
            hit = true;
            break;
        }
    }
    return hit;
}

function hitBounds(x, y) {
    return x < 0 || x >= FIELD.w || y < 0 || y >= FIELD.h;
}

function update() {
    if (!inGame) {
        if (keys[0]) inGame = true;
        draw();
        return;
    }

    if (!dirChanged) {
        var nDir = {x: 0, y: 0};
        if (keys[1] && dir.y == 0) nDir = {x: 0, y: -1};
        else if (keys[2] && dir.y == 0) nDir = {x: 0, y: 1};
        else if (keys[3] && dir.x == 0) nDir = {x: -1, y: 0};
        else if (keys[4] && dir.x == 0) nDir = {x: 1, y: 0};
        if (nDir.x != 0 || nDir.y != 0) {
            dir = nDir;
            dirChanged = true;
        }
    }

    if (gameOver) {
        if (keys[0]) {
            snake = [{x: 10, y: 10}];
            dir = {x: 1, y: 0};
            food = {x: 20, y: 20};
            dirChanged = false;
            gameOver = false;
            score = 0;
            inGame = false;
        }
    }
    else {
        dirChanged = false;
        var next = {x: snake[0].x + dir.x, y: snake[0].y + dir.y};
        if (hitSelf(next.x, next.y) || hitBounds(next.x, next.y)) gameOver = true;
        else {
            snake.unshift(next);
            if (snake[0].x == food.x && snake[0].y == food.y) {
                fx = Math.floor(1 + Math.random() * 24);
                fy = Math.floor(1 + Math.random() * 24);
                food = {x: fx, y: fy};
                score++;
            }
            else snake.pop();
        }
    }
    for (var i = 0; i < keys.length; i++) keys[i] = false;
    draw();
}

function draw() {
    cx.fillStyle = "black";
    cx.fillRect(0, 0, canv.width, canv.height);
    cx.fillStyle = "green";
    snake.forEach(seg => {
        cx.fillRect(seg.x * 16, seg.y * 16, 16, 16);
    });
    cx.fillStyle = "red";
    cx.fillRect(food.x * 16, food.y * 16, 16, 16);
    cx.font = "20px Arial";
    cx.textAlign = "center";
    cx.fillText(score, canv.width / 2, 16);
    if (!inGame) {
        cx.fillText("Press Enter/Tap Center to Start", canv.width / 2, canv.height / 2);
        cx.fillText("Press Arrow Keys/Tap Sides", canv.width / 2, canv.height / 2 + 24);
        cx.fillText("to Control Snake", canv.width / 2, canv.height / 2 + 48);
    }
    if (gameOver) {
        cx.fillText("GAME OVER!", canv.width / 2, canv.height / 2 - 16);
        cx.fillText("Press Enter", canv.width / 2, canv.height / 2 + 16);
    }
}

function keyPush(e) {
    switch(e.keyCode) {
        case 13: keys[0] = true; break;
        case 37: keys[3] = true; break;
        case 38: keys[1] = true; break;
        case 39: keys[4] = true; break;
        case 40: keys[2] = true; break;
    }
}

function touch(e) {
    e.preventDefault();
    const rect = canv.getBoundingClientRect();
    const touch = e.touches[0];
    mouseX = (touch.clientX - rect.left) * (canv.width / rect.width);
    mouseY = (touch.clientY - rect.top) * (canv.height / rect.height);
    var diag1 = mouseY > (mouseX * aspectRatio());
    var diag2 = mouseX < ((canv.height - mouseY) / aspectRatio());
    if (mouseX > cRect.x && mouseX < cRect.ex && mouseY > cRect.y && mouseY < cRect.ey) {
        keys[0] = true;
    }
    else {
        if (diag1) {
            if (diag2) keys[3] = true;
            else keys[2] = true;
        }
        else {
            if (diag2) keys[1] = true;
            else keys[4] = true;
        }
    }
}