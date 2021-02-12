var PLAY = 1;
var END = 0;
var gameState = PLAY;

var harry, harry_flying, harry_collided;
var ground, invisibleGround, groundImage;

var potionsGroup, potion1Image, potion2Image;
var ghostsGroup, ghost1, ghost2, ghost3, ghost4, ghost5, ghost6;

var sky, skyImage;
var moon, moonImage

var score=0;

var gameOver, restart;

localStorage["HighestScore"] = 0;

function preload(){
  harry_flying =   loadAnimation("image/harryP3.png");
  
  harry_falling = loadAnimation("image/falling1.png");
  
  harry_collided = loadAnimation("image/falling1.png");
 
  potion1Image = loadImage("image/potion1.png");
  potion2Image = loadImage("image/potion2.png");
  
  ghost1 = loadImage("image/ghost1.png");
  ghost2 = loadImage("image/ghost2.png");

  skyImage = loadImage("image/sky.jpg");

  moonImage = loadImage("image/moon.png");

  /*ghost3 = loadImage("ghost3.png");
  ghost4 = loadImage("ghost4.png");
  ghost5 = loadImage("ghost5.png");
  ghost6 = loadImage("ghost6.png");
  
  
  gameOverImg = loadImage("gameOver.png");
  restartImg = loadImage("restart.png");*/
}

function setup() {
  createCanvas(displayWidth-10, displayHeight-130);
  
  sky = createSprite(width/2,height/2,10,10)
  sky.addImage(skyImage);
  sky.scale = 1.3;
  sky.velocityX = -5;

  

  harry = createSprite(200,180,20,50);
  harry.addAnimation("flying", harry_flying);
  harry.addAnimation("falling", harry_falling);
  harry.addAnimation("collided", harry_collided);
  harry.scale = 0.5;
  harry.debug = true;
  harry.setCollider("rectangle",0,0,600,harry.height-100);
  
  moon = createSprite(1000,100,10,10);
  moon.velocityX = -0.2;
  moon.addImage(moonImage);
  moon.scale = 0.3;

  /*ground = createSprite(200,180,400,20);
  ground.x = ground.width /2;
  ground.velocityX = -(6 + 3*score/100);
  
  gameOver = createSprite(300,100);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(300,140);
  restart.addImage(restartImg);
  
  gameOver.scale = 0.5;
  restart.scale = 0.5;

  gameOver.visible = false;
  restart.visible = false;
  */
  
  invisibleGround = createSprite(width/2,height+100,width,10);
  invisibleGround.visible = false;

  

  
  potionsGroup = new Group();
  ghostsGroup = new Group();
  
  score = 0;
}

function draw() {
  //harry.debug = true;
  background(0);
  text("Score: "+ score, 500,50);
  
  if (gameState===PLAY){
    score = score + Math.round(getFrameRate()/60);

    spawnPotions();
    spawnGhosts();
  
    if(harry.isTouching(potionsGroup)){
      potionsGroup.setLifetimeEach(0);
    } 

    if(sky.x < 500){
      sky.x = width/2;
    }
    if(ghostsGroup.isTouching(harry)){
        gameState = END;
    }
  }
  else if (gameState === END) {
    /*gameOver.visible = true;
    restart.visible = true;
    */
   sky.x = sky.width/2;
    
 
    harry.velocityY = 10;
    harry.scale = 0.3;
    ghostsGroup.setVelocityXEach(0);
    potionsGroup.setVelocityXEach(0);
    
    moon.velocityY = 0;
    //change the harry animation
    harry.changeAnimation("falling",harry_falling);
    harry.collide(invisibleGround);
    if(harry.isTouching(invisibleGround)){
      harry.changeAnimation("collided",harry_collided);
    }
    
    //set lifetime of the game objects so that they are never destroyed
    ghostsGroup.setLifetimeEach(-1);
    potionsGroup.setLifetimeEach(-1);
    
    /*if(mousePressedOver(restart)) {
      reset();
    }
    */
  }

  
  getPotion();
  drawSprites();
}

function getPotion(){
  
  
}
function spawnPotions() {
  //write code here to spawn the potions
  if (frameCount % 40 === 0) {
    var potion = createSprite(600,120,40,10);
    potion.y = Math.round(random(80,250));
    var r = Math.round(random(1,2));

    switch (r) {
     case 1: potion.addImage(potion1Image);
     break
     case 2: potion.addImage(potion2Image);
    }
   
    potion.scale = 0.3;
    potion.velocityX = -3;
    
    potion.lifetime = 80;
    
    //adjust the depth
    potion.depth = harry.depth;
    harry.depth = harry.depth + 1;

    potion.debug = true;
    
    
    //add each potion to the group
    potionsGroup.add(potion);

    
  }
  
}

function spawnGhosts() {
  if(frameCount % 160 === 0) {
    var ghost = createSprite(width,165,10,40);
    //ghost.debug = true;
    ghost.y = Math.round(random(100,300));
    ghost.velocityX = -(6 + 2*score/100);
    
    
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: ghost.addImage(ghost1);
              break;
      case 2: ghost.addImage(ghost2);
              break;
      case 3: ghost.addImage(ghost1);
              break;
      case 4: ghost.addImage(ghost2);
              break;
      case 5: ghost.addImage(ghost1);
              break;
      case 6: ghost.addImage(ghost2);
              break;
      default: break;
    }
    
    //assign scale and lifetime to the ghost           
    ghost.scale = 0.5;
    ghost.lifetime = 300;
    ghost.debug = false;
    //add each ghost to the group
    ghostsGroup.add(ghost);
  }
}

function reset(){
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  
  ghostsGroup.destroyEach();
  potionsGroup.destroyEach();
  
  harry.changeAnimation("flying",harry_flying);
  
  if(localStorage["HighestScore"]<score){
    localStorage["HighestScore"] = score;
  }
  console.log(localStorage["HighestScore"]);
  
  score = 0;
  
}