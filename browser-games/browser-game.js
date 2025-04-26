window.onload=function() {
  canv=document.getElementById("game-canvas");
  cx=canv.getContext("2d");
  document.addEventListener("keydown", keyPush);
  setInterval(game, 1000/10);
}

posX=10;
posY=30;
velX=velY=0;
gridSize=16;
tileCount=32;

function game() {
  posX+=velX;
  posY+=velY;
  velX=velY=0;
  if (posX<0) { posX=tileCount-1; }
  if (posX>tileCount-1) { posX=0; }
  if (posY<0) { posY=tileCount-1; }
  if (posY>tileCount-1) { posY=0; }

  cx.fillStyle="black";
  cx.fillRect(0, 0, canv.width, canv.height);
  cx.fillStyle="lime";
  cx.fillRect(posX*gridSize+1, posY*gridSize+1, gridSize-2, gridSize-2);
}

function keyPush(e) {
  switch(e.keyCode) {
    case 37:
    velX=-1;velY=0;
    break;
    case 38:
    velX=0;velY=-1;
    break;
    case 39:
    velX=1;velY=0;
    break;
    case 40:
    velX=0;velY=1;
    break;
  }
}

function gameover() {
  
}