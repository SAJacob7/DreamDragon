import Player from "./Player.js";
import Cloud from "./Cloud.js";
import StarController from "./StarController.js";
import Score from "./Score.js";


const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");


const GAME_SPEED_START = 0.75;


const GAME_WIDTH = 700;
const GAME_HEIGHT = 325;
const PlAYER_WIDTH = 1148 / 15;
const PLAYER_HEIGHT = 1236 / 15;
const MAX_JUMP_HEIGHT = GAME_HEIGHT;
const MIN_JUMP_HEIGHT = 150;
const CLOUD_WIDTH = 1874 / 2;
const CLOUD_HEIGHT = 213 / 2;
const CLOUD_AND_STAR_SPEED = 0.5;


const STAR_CONFIG = [
   {width: 1080 / 8, height: 1080 / 8, images: "../static/images/stars1.png"},
   {width: 1080 / 8, height: 1080 / 8, images: "../static/images/stars2.png"},
   {width: 1080 / 8, height: 1080 / 8, images: "../static/images/stars3.png"}
]


// Game objects
let player = null;
let cloud = null;
let starController = null;
let score = null;


let scaleRatio = null;
let previousTime = null;
let gameSpeed = GAME_SPEED_START;
let gameOver = false;
let hasAddedEventListenersForRestart = false;
let waitingToStart = true;
let spritesLoaded = false;


async function createSprites() {
   let dragonLevel = 1;
   try {
       const response = await fetch('/api/dragon_level')
       const data = await response.json()
       dragonLevel = data.level || 1;
       console.log('Dragon level:', dragonLevel);
   }
   catch (error) {
       console.error('Error fetching dragon level:', error);
   }


   const playerWidthInGame = PlAYER_WIDTH * scaleRatio * 0.8;
   const playerHeightInGame = PLAYER_HEIGHT * scaleRatio * 0.8;
   const minJumpHeightInGame = MIN_JUMP_HEIGHT * scaleRatio * 0.8;
   const maxJumpHeightInGame = MAX_JUMP_HEIGHT * scaleRatio * 0.8;


   const cloudWidthInGame = CLOUD_WIDTH * scaleRatio * 0.8;
   const cloudHeightInGame = CLOUD_HEIGHT * scaleRatio * 0.8;


   player = new Player(
       ctx,
       playerWidthInGame,
       playerHeightInGame,
       minJumpHeightInGame,
       maxJumpHeightInGame,
       scaleRatio,
       dragonLevel
   );


   cloud = new Cloud(
       ctx,
       cloudWidthInGame,
       cloudHeightInGame,
       CLOUD_AND_STAR_SPEED,
       scaleRatio
   );
  
   const starImages = STAR_CONFIG.map(star => {
       const image = new Image();
       image.src = star.images;
       return {
           image: image,
           width: star.width * scaleRatio * 0.8,
           height: star.height * scaleRatio * 0.8
       };
   });


   starController = new StarController(ctx,
       starImages, scaleRatio, CLOUD_AND_STAR_SPEED);


   score = new Score(ctx, scaleRatio);


   spritesLoaded = true;
}


function getScaleRatio() {
   const screenHeight = Math.min(window.innerHeight, document.documentElement.clientHeight);
   const screenWidth = Math.min(window.innerWidth, document.documentElement.clientWidth);
  
   if (screenWidth / screenHeight < GAME_WIDTH / GAME_HEIGHT) {
       return screenWidth / GAME_WIDTH;
   } else {
       return screenHeight / GAME_HEIGHT;
   }
}


async function setScreen() {
   scaleRatio = getScaleRatio();
   canvas.width = GAME_WIDTH * scaleRatio
   canvas.height = GAME_HEIGHT * scaleRatio * 0.8;
   await createSprites();
}


setScreen();
window.addEventListener("resize", ()=>setTimeout(setScreen, 500));


if(screen.orientation) {
   screen.orientation.addEventListener("change", setScreen);
}


function showGameOver() { // CHANGE
   // Show points left to player
   // Message like sleep more to play again
   const fontSize = 50 * scaleRatio * 0.8;
   ctx.font = `${fontSize}px Verdana`;
   ctx.fillStyle = "white";
   const x = canvas.width / 4.5;
   const y = canvas.height / 2;
   ctx.fillText("GAME OVER", x, y);
}


function showStartGameText() {
   const fontSize = 50 * scaleRatio * 0.8;
   ctx.font = `${fontSize}px Verdana`;
   ctx.fillStyle = "white";
   const x = canvas.width / 4.5;
   const y = canvas.height / 2;
   ctx.fillText("TAP TO START", x, y);
}


function setupGameReset() {
   if (!hasAddedEventListenersForRestart) {
       hasAddedEventListenersForRestart = true;


       setTimeout(() => {
           window.addEventListener("keyup", tryStartGame, {once: true});
           window.addEventListener("touchstart", tryStartGame, {once: true});
       }, 1000);
      
   }
}


function reset() {
   hasAddedEventListenersForRestart = false;
   gameOver = false;
   waitingToStart = false;
   cloud.reset();
   gameSpeed = GAME_SPEED_START;
   starController.reset();
   score.reset();
}


function clearScreen() {
   ctx.clearRect(0, 0, canvas.width, canvas.height);
}


function gameLoop(currentTime) {
   if(previousTime === null) {
       previousTime = currentTime;
       requestAnimationFrame(gameLoop);
       return;
   }
   const frameTimeDelta = currentTime - previousTime;
   previousTime = currentTime;
   clearScreen();


   if (!spritesLoaded) {
       requestAnimationFrame(gameLoop);
       return;
   }


   if (!gameOver && !waitingToStart){
       // Update game objects
       cloud.update(gameSpeed, frameTimeDelta);
       starController.update(gameSpeed, frameTimeDelta);
       player.update(gameSpeed, frameTimeDelta);
       score.update(frameTimeDelta);
   }


   if (!gameOver && starController.collideWith(player)) {
       gameOver = true;
       setupGameReset();
    //    score.setHighScore();
   }


   // Draw game objects
   cloud.draw();
   score.draw();
   starController.draw();
   player.draw();


   if (gameOver) {
       showGameOver();
   }


   if (waitingToStart) {
       showStartGameText();
   }


   requestAnimationFrame(gameLoop);
}


requestAnimationFrame(gameLoop);


window.addEventListener("keyup", tryStartGame, {once: true});
window.addEventListener("touchstart", tryStartGame, {once: true});


async function tryStartGame() {
   try {
       const response = await fetch('/api/check_points');
       const data = await response.json();
       // const data = {canStart: false};
       if (data.canStart) {
           reset(); // start the game
           console.log("Game started!", data.canStart);
       } else {
           alert("You can't start the game yet. Come back later!");
           console.log("Game can't start yet.");
           // Optionally re-add the event listener so they can try again
           window.addEventListener("keyup", tryStartGame, {once: true});
           window.addEventListener("touchstart", tryStartGame, {once: true});
       }
   } catch (error) {
       console.error("Failed to check points:", error);
   }
}