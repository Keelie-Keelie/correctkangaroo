/*--------------------------------------------------------*/
var PLAY = 1;
var END = 0;
var WIN = 2;
var gameState = PLAY;

var trex, trex_running, trex_collided;
var jungle, invisiblejungle;
var kangaroo; //by me
var invisibleground; // by me

var obstaclesGroup, obstacle1;

var score=0;

var gameOverImg, restartImg, gameOver, restart;

function preload(){
  kangaroo_running =   loadAnimation("assets/kangaroo1.png","assets/kangaroo2.png","assets/kangaroo3.png");
  kangaroo_collided = loadAnimation("assets/kangaroo3.png");
  jungleImage = loadImage("assets/bg.png");
  shrub1 = loadImage("assets/shrub1.png");
  shrub2 = loadImage("assets/shrub2.png");
  shrub3 = loadImage("assets/shrub3.png");
  obstacle1 = loadImage("assets/stone.png");
  gameOverImg = loadImage("assets/gameOver.png");
  restartImg = loadImage("assets/restart.png");
  jumpSound = loadSound("assets/jump.wav");
  collidedSound = loadSound("assets/collided.wav");
}

function setup() {
  createCanvas(800, 400);
 
  

  jungle = createSprite(400,100,400,20);
  jungle.addImage("jungle",jungleImage);
  jungle.scale=0.3
  jungle.x = width /2;

  kangaroo = createSprite(50,200,20,50); //by me
  kangaroo.scale = 0.15;
  kangaroo.addAnimation("running",kangaroo_running); //by me
  kangaroo.addAnimation("collided",kangaroo_collided); //by me
  kangaroo.setCollider("circle",0,0,300);//by me

  gameOver = createSprite(430,100);
  restart = createSprite(430,150);
  restart.scale= 0.1
  gameOver.scale = 0.5
  
gameOver.addImage("game over",gameOverImg);
restart.addImage("restart game",restartImg);
gameOver.visible = false;
restart.visible = false;



  invisibleground = createSprite(400,350,800,10); //by me
  invisibleground.visible = false;
  
  score = 0;

  shrubG = new  Group();
  obstacleG = new Group();
}

function draw() {
  background(255);
  
  kangaroo.x = camera.position.x-270;


  if(gameState === PLAY){ //byme

    jungle.velocityX = -3; //byme

    if(jungle.x < 100){

      jungle.x = 400;

    }

    if(keyDown("SPACE") && kangaroo.y > 220) {

      jumpSound.play();

      kangaroo.velocityY = -7

    }
    kangaroo.velocityY = kangaroo.velocityY + 0.2;
    spawnObstacles();
    spawnShrubs();
    kangaroo.collide(invisibleground);


    if(obstacleG.isTouching(kangaroo)){
     collidedSound.play();
     kangaroo.changeAnimation("collided", kangaroo_collided);
      gameState = END;
    }


    if(shrubG.isTouching(kangaroo)){

      score = score+1;
      shrubG.destroyEach();
    }

    

  }else if(gameState===END){
     
    gameOver.visible = true;
    restart.visible = true;
    kangaroo.velocityX = 0;
    kangaroo.velocityY = 0;
    jungle.velocityX = 0;
    obstacleG.setVelocityEach(0);
    shrubG.setVelocityEach(0);

    obstacleG.setLifetimeEach(-1);
    shrubG.setLifetimeEach(-1);

    
    if(mousePressedOver(restart)){
      reset();
    }
   
    
    
  }else if(gameState === WIN){

    jungle.velocityX = 0;
    kangaroo.velocityY = 0;
    obstacleG.setVelocityXEach(0);
    shrubG.setVelocityXEach(0);

    kangaroo.changeAnimation("collided",kangaroo_collided);

    obstacleG.setLifetimeEach(-1);
    shrubG.setLifetimeEach(-1);

  }



  drawSprites();

  textSize(20);
  stroke(3);
 fill("black")
 text("Score:"+score, camera.position.x,50);

 if(score >=5){

  kangaroo.visible = false;
  textSize(30);
  stroke(3);
  fill("black");
  text("Congratulations, you win the game!",200,200);
  gameState = WIN;
 }


}


function spawnShrubs(){

  if(frameCount %150===0){
var shrub = createSprite(camera.position.x+500,330,40,10);
   shrub.velocityX = -(6 + 3*score/100);
   shrub.scale = 0.05
   var rand = Math.round(random(1,3));
    switch(rand) {
      case 1: shrub.addImage(shrub1);
              break;
      case 2: shrub.addImage(shrub2);
              break;
      case 3: shrub.addImage(shrub3);
              break;
      default: break;
    }
    shrub.lifetime=800/shrub.velocityX;
    shrubG.add(shrub);
    
  }

}

function spawnObstacles(){
  if (frameCount % 120 === 0) {
    var obstacle = createSprite(camera.position.x+400,330,40,40);
    obstacle.addImage(obstacle1);
    obstacle.scale = 0.15;
    obstacle.velocityX = -(6 + 3*score/100);
    
     //assign lifetime to the variable
     obstacle.lifetime = 800/obstacle.velocityX;
    
   
    
    obstacleG.add(obstacle);
  }

}

function reset(){
gameState = PLAY;
gameOver.visible = false;
restart.visible = false;
kangaroo.visible = true;
kangaroo.changeAnimation("running",kangaroo_running);
obstacleG.destroyEach();
shrubG.destroyEach();
score=0;


}