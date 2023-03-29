//escopo global
var trex, trexImg, trexCollided;
var chao;
var chaoImg;
var chaoFake;
var nuvem, nuvemImage;
var score = 0;

var PLAY = 1;
var END = 0;
var gameState = PLAY;

var grupoCacto;
var grupoNuvem;

var soundJump, soundDie, soundPoint;

var gameOver, restart, gameOverImg, restartImg;

function preload() {
  //carrega imagens, animações, sons etc...
  trexImg = loadAnimation("trex3.png", "trex4.png");
  chaoImg = loadImage("ground2.png");
  nuvemImage = loadImage("cloud.png");

  obs1 = loadImage("obstacle1.png");
  obs2 = loadImage("obstacle2.png");
  obs3 = loadImage("obstacle3.png");
  obs4 = loadImage("obstacle4.png");
  obs5 = loadImage("obstacle5.png");
  obs6 = loadImage("obstacle6.png");

  trexCollided = loadAnimation("trex_collided.png");

  soundJump = loadSound("jump.mp3");
  soundDie = loadSound("die.mp3");
  soundPoint = loadSound("checkPoint.mp3");

  gameOverImg = loadImage("gameOver.png");
  restartImg = loadImage("restart.png");
}

function setup() {
  //função de configuração
  createCanvas(windowWidth, windowHeight);

  trex = createSprite(50, height - 30);
  trex.addAnimation("running", trexImg);
  trex.addAnimation("F", trexCollided);
  //trex.scale = 0.5;

  //mostrar a hitbox do dino
  trex.debug = false;

  trex.setCollider("circle", -10, 5, 30);

  chao = createSprite(width / 2, height - 10, 600, 20);
  chao.x = chao.width / 2;
  chao.addImage(chaoImg);

  chaoFake = createSprite(width / 2, height, width, 20);
  chaoFake.visible = false;

  grupoCacto = new Group();
  grupoNuvem = new Group();

  gameOver = createSprite(width / 2, height / 2, 2, 100);
  gameOver.addImage(gameOverImg);
  gameOver.visible = false;

  restart = createSprite(width / 2, height / 2 + 50);
  restart.addImage(restartImg);
  restart.visible = false;

  // var rand = Math.round(random(1, 10));
  // console.log(rand);
}

function draw() {
  background("white");

  textFont("fantasy");
  textSize(20);
  text("Score: " + score, width - 120, 30);

  if (gameState === PLAY) {
    score = score + Math.round(frameRate() / 60);
    // && une duas condições, onde ambas precisam ser verdadeiras
    if (score > 0 && score % 100 === 0) {
      soundPoint.play();
    }

    if (keyDown("space") && trex.isTouching(chao)) {
      trex.velocityY = -18;
      soundJump.play();
    }

    //gravidade
    trex.velocityY = trex.velocityY + 0.8;

    chao.velocityX = -Math.round(5 + (2 * score) / 100);

    //chao infinito
    if (chao.x < 0) {
      chao.x = chao.width / 2;
    }

    gerarNuvens();

    obstacles();

    if (trex.isTouching(grupoCacto)) {
      gameState = END;
      soundDie.play();
    }
  } else if (gameState === END) {
    grupoCacto.setVelocityXEach(0);
    grupoNuvem.setVelocityXEach(0);
    chao.velocityX = 0;

    grupoCacto.setLifetimeEach(-1);
    grupoNuvem.setLifetimeEach(-1);

    trex.velocityY = 0;
    trex.velocityX = 0;

    trex.changeAnimation("F");

    gameOver.visible = true;
    restart.visible = true;

    if (mousePressedOver(restart)) {
      resetar();
    }
  }

  trex.collide(chaoFake);

  drawSprites();
}

function gerarNuvens() {
  if (frameCount % 60 === 0) {
    nuvem = createSprite(
      width + 20,
      Math.round(random(50, height - 50)),
      10,
      10
    );
    nuvem.velocityX = -3;
    nuvem.addImage(nuvemImage);
    //nuvem.scale = 0.5;
    nuvem.lifetime = width;

    //depth significa camada
    nuvem.depth = trex.depth;
    gameOver.depth = trex.depth;
    trex.depth = trex.depth + 1;

    grupoNuvem.add(nuvem);
  }
}

function obstacles() {
  if (frameCount % 60 === 0) {
    cacto = createSprite(width + 20, height - 30, 30, 30);
    cacto.velocityX = -(5 + score / 100);

    //variavel de escopo local
    var num = Math.round(random(1, 6));

    switch (num) {
      case 1:
        cacto.addImage(obs1);
        break;
      case 2:
        cacto.addImage(obs2);
        break;
      case 3:
        cacto.addImage(obs3);
        break;
      case 4:
        cacto.addImage(obs4);
        break;
      case 5:
        cacto.addImage(obs5);
        break;
      case 6:
        cacto.addImage(obs6);
        break;
    }

    cacto.scale = 0.8;
    cacto.lifetime = width;

    cacto.depth = trex.depth;
    trex.depth = trex.depth + 1;

    //o grupo de cactos adiciona o cacto
    grupoCacto.add(cacto);
  }
}

function resetar() {
  gameState = PLAY;
  grupoCacto.destroyEach();
  grupoNuvem.destroyEach();

  gameOver.visible = false;
  restart.visible = false;

  trex.changeAnimation("running");

  score = 0;
}
