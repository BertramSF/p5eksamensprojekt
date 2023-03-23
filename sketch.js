// Variabler for skærm
const Width = 800
const Height = 750

// Varibler for pointsystem
let point = 0

//Genstartknap
let Button
let ButtonWidth = 230
let ButtonHeight = 60

// Variabler for Player
const d = 72
let x = 800 / 2
const y = 725 - d
const fart = 10
const r = d / 2

// Variabler for Enemies
let enemies = []
const numberOfEnemies = 10
let Ehastighed = 5

// Funktion for Enemy Spawning
function generateEnemies(hastighed) {
  for (let index = 0; index < numberOfEnemies; index++) {
    enemies.push(
      new Enemy(random(50, Width - 50), -50, 100, 100, "red", hastighed)
    );
  }
  enemies[0].drawEnemy = true
}

// Setup af Spillet
function setup() {


  let cnv = createCanvas(Width, Height)
  let x = (windowWidth - width) / 2;
  let y = (windowHeight - height) / 2;
  cnv.position(x, y);

  // Genstartknap
  Button = createButton("Genstart")
  Button.position((windowWidth / 2 - ButtonWidth / 2), (windowHeight / 2 - ButtonHeight / 2))
  Button.size(ButtonWidth, ButtonHeight)
  Button.style("font-family", "Helvetica");
  Button.style("font-size", "48px")
  Button.style("background-color", "#E13112")
  Button.mousePressed(reset)
  Button.hide()

  rectMode(CENTER)
  // console.log(dist2p(0, 0, 3, 4))
  // Kald Enemy Spawning funktion
  generateEnemies(Ehastighed)
}

function drawScore() {
  push()
  textSize(40)
  fill("white")
  text("Score: " + point, Width - 200, 40)
  pop()
}

function draw() {
  // Player
  background(69)
  circle(x, y, d)
  strokeWeight(5)
  fill(162, 120, 9)


  // Nyt Enemy efter forrige Enemy er nået halvejs ned på skærmen
  for (let index = 0; index < enemies.length; index++) {
    const enemy = enemies[index]
    if (enemy.drawEnemy) {
      enemy.draw()
    } else {
      if (index > 0 && enemies[index - 1].Ey >= windowHeight / 2) {
        enemy.drawEnemy = true
      }
    }

    // Hitbox registrering
    if (dist2p(enemy.Ex, enemy.Ey, x, y) < d / 2 + enemy.Ew / 2) {
      console.log("Vi ramte en fjende")
      // Stop spil
      noLoop()
      Button.show()
    }

    // point-optælling
    if (enemy.Ey >= 744 && enemy.point === false) {
      point += 1
      enemy.point = true
    }

  }

  // Forøgelse af Enemy Hastighed
  if (enemies[numberOfEnemies - 1].Ey + 50 >= Height) {
    Ehastighed += 5;
    generateEnemies(Ehastighed)
  }

  // Player Movement
  if (keyIsDown(RIGHT_ARROW || 68)) {
    if (x <= Width - r) {
      x = x + fart
    }
  }

  if (keyIsDown(LEFT_ARROW)) {
    if (x >= 0 + r) {
      x = x - fart
    }
  }

  drawScore()
}

// Klasse for Enemy
class Enemy {
  constructor(Ex, Ey, Ew, Eh, farve, Ehastighed) {
    this.Ex = Ex
    this.Ey = Ey
    this.Ew = Ew
    this.Eh = Eh
    this.farve = farve
    this.hastighed = Ehastighed
    this.drawEnemy = false
    this.point = false
  }

  // Draw Enemy
  draw() {
    push()
    fill(this.farve)
    rect(this.Ex, this.Ey, this.Ew, this.Eh)
    this.Ey += this.hastighed
    pop()
  }
}

//Funktion for Afstands mellem to punkter
function dist2p(x1, y1, x2, y2) {
  const d = sqrt(pow(x1 - x2, 2) + pow(y1 - y2, 2))
  return d
}

function reset() {
  Ehastighed = 5
  enemies = []
  generateEnemies(Ehastighed)
  point = 0
  Button.hide()
  loop()
}
