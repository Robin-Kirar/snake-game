const bagicha = document.querySelector('#bagicha');
const startBtn = document.querySelector('#start');
const restartBtn = document.querySelector('#restart');

const header = document.querySelector('#header');
const pauseBtn = document.querySelector('#pause');
const gameScore = document.querySelector('#score');
const overScore = document.querySelector('#over-score');
const musicBtn = document.querySelector('#music');
const helpBtn = document.querySelector('#help');

const sScreen = document.querySelector('#start-screen');
const eScreen = document.querySelector('#end-screen');


// Khela ke tukde
let frames;
let lastRen = 0;
const gridSize = 25;
let scoreCount = 0;
let gamePause = false;
let gameOverState = false;
let music = true;

// Saanp ke tukde
let saanpSpeed = 5;
let saanpKiPosi = [{x: 13, y: 13}];
let posiTemp = 0;
let size = 1;

// Khana
let khanaKiPosi = randomPos();

// Main
startBtn.addEventListener('click', ()=>{
  sScreen.classList.add('active');
  header.classList.add('active');

  main();
});

restartBtn.addEventListener('click', ()=>{
  scoreCount = 0;
  saanpKiPosi = [{x: 13, y: 13}];
  khanaKiPosi = randomPos();
  gameOverState = false;

  eScreen.classList.remove('active')
  sScreen.classList.add('active');
  header.classList.add('active');

  main();
});

pauseBtn.addEventListener('click', ()=>{
  const pauseShow = document.querySelectorAll('#pause .fas');

  if (gamePause === false) {
    cancelAnimationFrame(frames);
    pauseShow[0].classList.remove('active');
    pauseShow[1].classList.add('active');
    gamePause = true;
  } else if(gamePause === true) {
    frames = requestAnimationFrame(main);
    pauseShow[1].classList.remove('active');
    pauseShow[0].classList.add('active');
    gamePause = false;
  }
});

musicBtn.addEventListener('click', ()=>{
  const musicShow = document.querySelectorAll('#music .fas');

  if (music === true) {
    musicShow[0].classList.remove('active');
    musicShow[1].classList.add('active');
    music = false;
  } else if(music === false) {
    musicShow[1].classList.remove('active');
    musicShow[0].classList.add('active');
    music = true;
  }
});

helpBtn.addEventListener('click', ()=>{
  sScreen.classList.add('active');
  document.querySelector('.help-screen').classList.add('active');
});

// Functions
function main(time){
  frames = requestAnimationFrame(main);

  if (gameOverState === true) {
    gameOver();
  }

  const secLastRen = (time - lastRen) / 1000;
  if (1/saanpSpeed>secLastRen) {return;}
  lastRen = time;

  update();
  gameOverCheck();
  paint();
}

function update(){
  input();

  if (onsnake(khanaKiPosi, saanpKiPosi, false)) {
    for (var i = 0; i < size; i++) {
      saanpKiPosi[saanpKiPosi.length] = { ...saanpKiPosi[saanpKiPosi.length - 1]};
    }
    khanaKiPosi = randomPos();
    scoreCount++;
  }
  for (let i = saanpKiPosi.length - 2; i >= 0; i--) {
    saanpKiPosi[i+1] = {...saanpKiPosi[i]};
  }

  saanpKiPosi[0].y += inputKey.y;
  saanpKiPosi[0].x += inputKey.x;


}
function paint(){
  if (gameOverState === true) {return;}

  bagicha.innerHTML = '';
  saanpPosition(saanpKiPosi);
  KhanaPosition(khanaKiPosi);
  headerUpdate(scoreCount);
}

function saanpPosition(position){
  position.forEach((item, i) => {
    const saanp = document.createElement('div');
    if (i==0) {
      saanp.classList.add('saanp', 'head');
      if (inputKey.y == -1) {
        saanp.style.transform = 'rotate(0deg)';
      } else if (inputKey.y == 1){
        saanp.style.transform = 'rotate(180deg)';
      } else if (inputKey.x == -1){
        saanp.style.transform = 'rotate(-90deg)';
      } else if (inputKey.x == 1){
        saanp.style.transform = 'rotate(90deg)';
      }
    } else {
      saanp.classList.add('saanp');
    }
    saanp.style.gridRowStart = item.y;
    saanp.style.gridColumnStart = item.x;
    bagicha.appendChild(saanp);
  });
}

function KhanaPosition(position){
  const khana = document.createElement('span');
  khana.classList.add('khana');
  khana.style.gridRowStart = position.y;
  khana.style.gridColumnStart = position.x;
  bagicha.appendChild(khana);
}

// inputs
const saanpMundi = document.querySelector('.head');
let inputKey = {x:0, y:0};
let lastInput = {x:0, y:0};
window.addEventListener('keydown', function(e){
  switch(e.key){
    case 'ArrowUp':
      if (lastInput.y !== 0){break;}
      inputKey = {x: 0, y: -1};
      break;
    case 'ArrowDown':
      if (lastInput.y !== 0){break;}
      inputKey = {x: 0, y: 1};
      break;
    case 'ArrowRight':
      if (lastInput.x !== 0){break;}
      inputKey = {x: 1, y: 0};
      break;
    case 'ArrowLeft':
      if (lastInput.x !== 0){break;}
      inputKey = {x: -1, y: 0};
      break;
  }
});

function input() {
  lastInput = inputKey;
  return inputKey;
}

function onsnake(food, snake, head){
  return snake.some((item, i) => {
    if (head === true && i === 0) {return false;}
    return item.x === food.x && item.y === food.y;
  });
}

function randomPos() {
  let pos;

  while (pos == null || onsnake(pos, saanpKiPosi, false)) {
    pos = {
      x: Math.floor(Math.random() * gridSize) + 1,
      y: Math.floor(Math.random() * gridSize) + 1
    };
  }

  return pos;
}

function headerUpdate(score) {
  gameScore.innerHTML = score;
}

function gameOverCheck(){
  if (saanpKiPosi[0].x < 1 || saanpKiPosi[0].y < 1 || saanpKiPosi[0].x > gridSize || saanpKiPosi[0].y > gridSize) {
    gameOverState = true;
  } else if (onsnake(saanpKiPosi[0], saanpKiPosi, true)) {
    gameOverState = true;
  }
}

function gameOver(){
  cancelAnimationFrame(frames);
  overScore.innerHTML = scoreCount;
  eScreen.classList.add('active');
}
