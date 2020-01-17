var bullets; //bullet 
var meteor; // meteor
var ship; // ship
var shipImage, bulletImage, meteorImage; // images for ship,bullet,meteor
var MARGIN = 40; // help set postions for all sprites
var lives = 3;

//creates sprite
function setup() {
  createCanvas(800, 600);

  bulletImage = loadImage('bullet.png');
  shipImage = loadImage('Newspaceship.png');
  meteorImage = loadImage('');

//creates ship
  ship = createSprite(width/2, height/2);
  ship.maxSpeed = 6;
  ship.friction = 0.98;
  ship.setCollider('circle', 0, 0, 20);

  ship.addImage('normal', shipImage); //addes the ship image
 

  meteor = new Group(); //
  bullets = new Group();

  for(var i = 0; i<8; i++) {
    var ang = random(360);
    var px = width/2 + 1000 * cos(radians(ang));
    var py = height/2+ 1000 * sin(radians(ang));
    createAsteroid(3, px, py);
  }
}

// draws sprites and has they code for when keys are down
function draw() {
  background(0);
  fill(255);
  textAlign(CENTER);
  //writes text on canvas
  text('Controls: Arrow Keys + space', width/2, 20);
  text('Lives = ' + lives , 50, 20);

//when the ship live = 0 it ends the game
  if(lives === 0){
	ship.remove();
	text('GAME OVER' , width/2, height/2);
  }
//sets postions for all sprites
  for(var i=0; i<allSprites.length; i++) { //margins called here
    var s = allSprites[i];
    if(s.position.x<-MARGIN) s.position.x = width+MARGIN;
    if(s.position.x>width+MARGIN) s.position.x = -MARGIN;
    if(s.position.y<-MARGIN) s.position.y = height+MARGIN;
    if(s.position.y>height+MARGIN) s.position.y = -MARGIN;
  }

// when meteor gets hit by the bullet it calls the meteorHit function
  meteor.overlap(bullets, meteorHit);
  
// when meteor hits ship it calls shipHit function
  ship.overlap(meteor, shipHit); 

// makes ship bounce when meteor hits it 
  ship.bounce(meteor);

  if(keyDown(LEFT_ARROW))
    ship.rotation -= 4;
  if(keyDown(RIGHT_ARROW))
    ship.rotation += 4;
  if(keyDown(UP_ARROW))
  {
    ship.addSpeed(100, ship.rotation-90);
  }

  if(keyWentDown(' '))
  {
    var bullet = createSprite(ship.position.x, ship.position.y);
    bullet.addImage(bulletImage);
	bullet.rotation = ship.rotation;
    bullet.setSpeed(10, ship.rotation-90);
    bullet.life = 30;
    bullets.add(bullet);
  }

  drawSprites();

}

//makes the meteors
function createAsteroid(type, x, y) {
  var a = createSprite(x, y);
  var img = loadImage('Newbigmeteor.png');
  a.addImage(img);
  a.setSpeed(2.5-(type/2), random(360));
  a.rotationSpeed = 0.5;
  a.type = type;

  if(type == 2)
    a.scale = 0.6;
  if(type == 1)
    a.scale = 0.3;

  a.mass = 2+a.scale;
  a.setCollider('circle', 0, 0, 50);
  meteor.add(a);
  return a;
}

// meteorHit function creates smaller meteors and removes bullet and meteor that was hit
function meteorHit(meteor, bullet) {
  var newType = meteor.type-1;

  if(newType>0) {
    createAsteroid(newType, meteor.position.x, meteor.position.y);
    createAsteroid(newType, meteor.position.x, meteor.position.y);
  }

  for(var i=0; i<10; i++) {
    var p = createSprite(bullet.position.x, bullet.position.y);
    p.addImage(meteorImage);
    p.setSpeed(random(3, 5), random(360));
    p.friction = 0.95;
    p.life = 15;
  }

  bullet.remove();
  meteor.remove();
}
// shipHit function subtracts lives and chages ship x and y 
function shipHit(ship, meteor){
	lives = lives - 1;
	ship.position.x = width/2;
	ship.position.y = height/2;
}