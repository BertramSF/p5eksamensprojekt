// Variabler for skærm
const Width = 800;
const Height = 750;

// Varibler for pointsystem
let point = 0;
let HighScore = 0;

// Runde
let runde = 1;

// PowerUp
let PowerupPlads
let PowerupType

// Lyde
let DeathSound;
let BaggrundsLyd;
let PowerUpSound;
let songPlaying = false;

// Baggrund
let Baggrund

//Genstartknap
let Button;
let ButtonWidth = 230;
let ButtonHeight = 60;

// Variabler for Player
let d = 72;
let x = 800 / 2;
let y = 725 - d;
const fart = 10;
const r = d / 2;

// Variabler for Enemies
let enemies = [];
const numberOfEnemies = 10;
let Ehastighed = 5;

// Powerup
let isPowerupHit = false;

// Funktion for Enemy Spawning
function generateEnemies(hastighed) {
  isPowerupHit = false;
  enemies = [];

// Powerup spawning
PowerupPlads = floor(random(0, numberOfEnemies));
PowerupType = floor(random(0, 3));

  console.log("Ehastighed", Ehastighed);
  console.log("PowerupType", PowerupType);
  console.log("PowerupPlads", PowerupPlads);

  // Powerup Score +2
  for (let index = 0; index < numberOfEnemies; index++) {
    if (index === PowerupPlads && PowerupType === 1) {
      enemies.push(
        new Enemy(
          random(50, Width - 50),
          -50,
          100,
          100,
          "green",
          hastighed,
          true
        )
      );
    // Powerup Hastighed -5
    } else if (index === PowerupPlads && PowerupType === 2 && runde >= 3) {
      enemies.push(
        new Enemy(
          random(50, Width - 50),
          -50,
          100,
          100,
          "Purple",
          hastighed,
          true
        )
      );
    } else {
      enemies.push(
        new Enemy(
          random(50, Width - 50),
          -50,
          100,
          100,
          "red",
          hastighed,
          false
        )
      );
    }
  }
  enemies[0].drawEnemy = true;
}

// Preload
function preload() {
  DeathSound = loadSound('YodaDeathSound.mp3');
  BaggrundsLyd = loadSound('Jumper.mp3');
  PowerUpSound = loadSound('PowerUpSound.mp3');
  Baggrund = loadImage('Nattehimmel.jpeg')
}

// Baggrundslyd Loop
function PlaySound() {
  BaggrundsLyd.loop();
}

// Setup af Spillet
function setup() {
  BaggrundsLyd.setVolume(0.3)
  PlaySound()
  let cnv = createCanvas(Width, Height);
  let x = (windowWidth - width) / 2;
  let y = (windowHeight - height) / 2;
  cnv.position(x, y);

  

  // Genstartknap
  Button = createButton("Genstart");
  Button.position(
    windowWidth / 2 - ButtonWidth / 2,
    windowHeight / 2 - ButtonHeight / 2
  );
  Button.size(ButtonWidth, ButtonHeight);
  Button.style("font-family", "Helvetica");
  Button.style("font-size", "48px");
  Button.style("background-color", "#E13112");
  Button.mousePressed(reset);
  Button.hide();

  rectMode(CENTER);

  // Kald Enemy Spawning funktion
  generateEnemies(Ehastighed);
  console.log(enemies);
}

// Score funktion
function drawScore() {
  push();
  textSize(40);
  fill("white");
  text("Score: " + point, Width - 200, 40);
  pop();
}

// Runde funktion
function drawRunde() {
  push();
  textSize(40);
  fill("white");
  text("Runde: " + runde, 20, 40);
  pop();
}

// HighScore funktion
function drawHighScore() {
  push();
  textSize(40);
  fill("white");
  text("Highscore: " + HighScore, 250, 40);
  pop();
}

function draw() {
  // Player
  background(Baggrund);
  circle(x, y, d);
  strokeWeight(5);
  fill(0, 255, 183);
 

  // Nyt Enemy efter forrige Enemy er nået halvejs ned på skærmen
  for (let index = 0; index < enemies.length; index++) {
    const enemy = enemies[index];
    if (enemy.drawEnemy) {
      enemy.draw();
    } else {
      if (index > 0 && enemies[index - 1].Ey >= windowHeight / 2) {
        enemy.drawEnemy = true;
      }
    }

    // Hitbox registrering
    if (
      dist2p(enemy.Ex, enemy.Ey, x, y) < d / 2 + enemy.Ew / 2 &&
      enemy.isPowerup === false
    ) {
      console.log("Vi ramte en fjende");
      DeathSound.play()
      // Stop spil
      noLoop();
      Button.show();
    } else if (
      dist2p(enemy.Ex, enemy.Ey, x, y) < d / 2 + enemy.Ew / 2 &&
      enemy.isPowerup === true &&
      isPowerupHit === false &&
      PowerupType === 1 
    ) {
      point += 2;
      isPowerupHit = true;
      console.log("Vi ramte en ScorePowerup");
      PowerUpSound.play()
    } else if (
      dist2p(enemy.Ex, enemy.Ey, x, y) < d / 2 + enemy.Ew / 2 &&
      enemy.isPowerup === true &&
      isPowerupHit === false &&
      PowerupType === 2 
    ) {
      Ehastighed -= 5;
      isPowerupHit = true;
      console.log("Vi ramte en HastighedPowerup");
      PowerUpSound.play()
    }
    // Point-optælling
    if (enemy.Ey >= Height + enemy.Eh && enemy.point === false) {
      point += 1;
      enemy.point = true;
    }
  }

  // Forøgelse af Enemy Hastighed
  if (enemies[numberOfEnemies - 1].Ey + 50 >= Height) {
    Ehastighed += 5;
    point += 1;
    runde += 1;

    generateEnemies(Ehastighed);
  }

  // Player Movement
  if (keyIsDown(RIGHT_ARROW || 68)) {
    if (x <= Width - r) {
      x = x + fart;
    }
    if (songPlaying === false){
      PlaySound();
      songPlaying = true;
    }
  }

  if (keyIsDown(LEFT_ARROW)) {
    if (x >= 0 + r) {
      x = x - fart;
    }
    if (songPlaying === false){
      PlaySound();
      songPlaying = true;
    }
  }

  drawScore();
  drawRunde();
  drawHighScore();
}

// Klasse for Enemy
class Enemy {
  constructor(Ex, Ey, Ew, Eh, farve, Ehastighed, isPowerup) {
    this.Ex = Ex;
    this.Ey = Ey;
    this.Ew = Ew;
    this.Eh = Eh;
    this.farve = farve;
    this.hastighed = Ehastighed;
    this.drawEnemy = false;
    this.point = false;
    this.isPowerup = isPowerup;
  }

  // Draw Enemy
  draw() {
    push();
    fill(this.farve);
    rect(this.Ex, this.Ey, this.Ew, this.Eh);
    this.Ey += this.hastighed;
    pop();
  }
}

// Funktion for Afstand mellem to punkter
function dist2p(x1, y1, x2, y2) {
  const dist = sqrt(pow(x1 - x2, 2) + pow(y1 - y2, 2));
  return dist;
}

// Restart funktion
function reset() {
  Ehastighed = 5;
  enemies = [];
  runde = 1;
  generateEnemies(Ehastighed);
  if(point > HighScore) {
    HighScore = point
  }
  point = 0;
  x = 800 / 2;
  y = 725 - d;
  Button.hide();
  loop();
}
