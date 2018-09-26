const icons = [
  "bars",
  "bug",
  "bowling-ball",
  "coffee",
  "couch",
  "football-ball",
  "gem",
  "laptop"
];
const btnStart = document.querySelector(".btnStart");
const gameOverElem = document.querySelector("#gameOverElem");
const container = document.getElementById("container");
const box = document.querySelector(".box");
const base = document.querySelector(".base");
const boxCenter = [
  box.offsetLeft + box.offsetWidth / 2,
  box.offsetTop + box.offsetHeight / 2
];
const scoreDash = document.querySelector(".scoreDash");
const progressbar = document.querySelector(".progress-bar");

let gamePlay = false;
let player;
let animateGame;

btnStart.addEventListener("click", startGame);
container.addEventListener("mousedown", mouseDown);
container.addEventListener("mousemove", movePosition);

function movePosition(e) {
  let deg = getDeg(e);
  box.style.webkitTransform = "rotate(" + deg + "deg)";
  box.style.mozTransform = "rotate(" + deg + "deg)";
  box.style.msTransform = "rotate(" + deg + "deg)";
  box.style.oTransform = "rotate(" + deg + "deg)";
  box.style.transform = "rotate(" + deg + "deg)";
}

function isCollide(a, b) {
  let aRect = a.getBoundingClientRect();
  let bRect = b.getBoundingClientRect();
  return !(
    aRect.bottom < bRect.top ||
    aRect.top > bRect.bottom ||
    aRect.right < bRect.left ||
    aRect.left > bRect.right
  );
}

function getDeg(e) {
  let angle = Math.atan2(e.clientX - boxCenter[0], -(e.clientY - boxCenter[1]));
  return angle * (180 / Math.PI);
}

function degRad(deg) {
  return deg * (Math.PI / 180);
}

function mouseDown(e) {
  if (gamePlay) {
    let div = document.createElement("div");
    let deg = getDeg(e);
    div.setAttribute("class", "fireme");
    div.moverx = 5 * Math.sin(degRad(deg));
    div.movery = -5 * Math.cos(degRad(deg));
    div.style.left = boxCenter[0] - 5 + "px";
    div.style.top = boxCenter[1] - 5 + "px";
    div.style.width = 10 + "px";
    div.style.height = 10 + "px";
    container.appendChild(div);
  }
}

function startGame() {
  gamePlay = true;
  gameOverElem.style.display = "none";
  player = {
    score: 0,
    barwidth: 100,
    lives: 100
  };
  //setup badguys
  setupBadguys(15);
  // почитать про request animation frame
  animateGame = requestAnimationFrame(playGame);
}

function moveEnemy() {
  let tempEnemy = document.querySelectorAll(".baddy");
  let hitter = false;
  let tempShots = document.querySelectorAll(".fireme");

  for (let enemy of tempEnemy) {
    if (
      enemy.offsetTop > 550 ||
      enemy.offsetTop < 0 ||
      enemy.offsetLeft > 750 ||
      enemy.offset < 0
    ) {
      enemy.parentNode.removeChild(enemy);
      badmaker();
    } else {
      enemy.style.top = enemy.offsetTop + enemy.movery + "px";
      enemy.style.left = enemy.offsetLeft + enemy.moverx + "px";
      for (let shot of tempShots) {
        if (isCollide(shot, enemy) && gamePlay) {
          player.score += enemy.points;
          enemy.parentNode.removeChild(enemy);
          shot.parentNode.removeChild(shot);
          updateDash();
          badmaker();
          break;
        }
      }
    }
    if (isCollide(box, enemy)) {
      hitter = true;
      player.lives--;
      if (player.lives < 0) {
        gameOver();
      }
      break;
    }
  }
  if (hitter) {
    base.style.backgroundColor = "red";
    hitter = false;
  } else {
    base.style.backgroundColor = "";
  }
}

function randomMe(num) {
  return Math.floor(Math.random() * num);
}

function setupBadguys(num) {
  for (let x = 0; x < num; x++) {
    badmaker();
  }
}

function badmaker() {
  let div = document.createElement("div");
  let myIcon = "fa-" + icons[randomMe(icons.length)];
  let x, y, xmove, ymove;
  let randomStrat = randomMe(4);
  let dirSet = randomMe(4) + 1;
  let dirPos = randomMe(7) - 3;
  switch (randomStrat) {
    case 0:
      x = 0;
      y = randomMe(600);
      ymove = dirPos;
      xmove = dirSet;
      break;
    case 1:
      x = 800;
      y = randomMe(600);
      ymove = dirPos;
      xmove = dirSet * -1;
      break;
    case 2:
      x = randomMe(800);
      y = 0;
      ymove = dirSet;
      xmove = dirPos;
      break;
    case 3:
      x = randomMe(800);
      y = 600;
      ymove = dirSet * -1;
      xmove = dirPos;
      break;
  }
  div.innerHTML = '<i class="fas ' + myIcon + '"></i>';
  div.setAttribute("class", "baddy");
  div.style.fontSize = randomMe(20) + 30 + "px";
  div.style.left = x + "px";
  div.style.top = y + "px";
  div.points = randomMe(5) + 1;
  div.moverx = xmove;
  div.movery = ymove;
  div.style.color = randomColor();
  container.appendChild(div);
}

function randomColor() {
  function c() {
    let hex = randomMe(256).toString(16);
    return ("0" + String(hex)).substr(-2);
  }
  return "#" + c() + c() + c();
}

function moveShots() {
  let tempShots = document.querySelectorAll(".fireme");
  for (let shot of tempShots) {
    if (
      shot.offsetTop > 600 ||
      shot.offsetTop < 0 ||
      shot.offsetLeft > 800 ||
      shot.offsetLeft < 0
    ) {
      shot.parentNode.removeChild(shot);
    } else {
      shot.style.top = shot.offsetTop + shot.movery + "px";
      shot.style.left = shot.offsetLeft + shot.moverx + "px";
    }
  }
}

function updateDash() {
  scoreDash.innerHTML = player.score;
  let tempPer = (player.lives / player.barwidth) * 100 + "%";
  progressbar.style.width = tempPer;
}

function gameOver() {
  cancelAnimationFrame(animateGame);
  gameOverElem.style.display = "block";
  gameOverElem.querySelector("span").innerHTML =
    "GAME OVER<br>Your Score " + player.score;
  gamePlay = false;
  let tempEnemy = document.querySelectorAll(".baddy");
  for (let enemy of tempEnemy) {
    enemy.parentNode.removeChild(enemy);
  }
  let tempShots = document.querySelectorAll(".fireme");
  for (let shot of tempShots) {
    shot.parentNode.removeChild(shot);
  }
}

function playGame() {
  if (gamePlay) {
    //move shots
    moveShots();
    //update dashboard
    updateDash();
    //move enemy
    moveEnemy();

    animateGame = requestAnimationFrame(playGame);
  }
}
