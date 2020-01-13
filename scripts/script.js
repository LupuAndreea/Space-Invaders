// Max and min elements are use to random generate the enemies.
var MAX_ELEMENT = 2;
var MIN_ELEMENT = 1;

// The setup variables.
var NR_LEVEL = 1;
var NR_POINTS = 0;
var NR_LIVES = 3;

var DELETED_ENEMIS = 0;

// The variables for the hero.
var SPEED_HERO = 10;
var SPEED_MISSILES = 10;
var SPEED_ENEMIES = 5;

// The Game_STATE variable is use to store if the gave have started or not.
var GAME_STATE = 0;

// There is a maximum of coloums that can appear on the screen.
var MAX_ENEMIES_COL = 5;

var modal;
var hero = {
    top: 700,
    left: 550
};

var missiles = [];
var enemies = [];

var timeOut;
var bgCoords;
var startButton;
var laserSound;
var hitSound;

window.onload = setupGame;

// In the setupGame function the main elements of the game are set.
function setupGame(){
    // Global inits
    bgCoords = document.getElementById("background").getBoundingClientRect();
    laserSound = document.getElementById("laserPlayer");
    hitSound = document.getElementById("hitPlayer");

    hero.left = parseInt(bgCoords.left + 1200 / 2 );
    hero.top =  parseInt(bgCoords.top + 800 / 1.2);
   
    startButton = document.getElementById("startButton");
    startButton.onclick = startGame;

    
    updateLabels();
    generateEnemies();
    moveHero();
    gameLoop();
    

}

function startGame() {
    console.log("Start Game!");
    this.style.visibility = "hidden";
    GAME_STATE = 1;
}

// The keydown event is detected and the hero is moved screen.
document.onkeydown = function(e) {

    if(GAME_STATE == 1){
        bgCoords = document.getElementById("background").getBoundingClientRect();

        console.log(e.keyCode);
        // move the hero to the left
        if(e.keyCode == 37  && hero.left > bgCoords.left) {
            hero.left = hero.left - SPEED_HERO;
            moveHero();
        }

        // move the hero to the right
        if(e.keyCode == 39 && hero.left + 50 < bgCoords.right) {
            hero.left = hero.left + SPEED_HERO;
            moveHero();
        }

        // kill the enemy
        if(e.keyCode == 32) {
            
            laserSound.pause();
            laserSound.play();

            missiles.push({
                left: hero.left - bgCoords.left + 20,
                top:  hero.top - bgCoords.top
            })
            console.log(missiles);
            drawMissiles();
        }
    }
}

function moveHero() {
        document.getElementById("hero").style.left = hero.left + "px";
        document.getElementById("hero").style.top = hero.top + "px";
}

// The missiles positions are drawn on the screen.
function drawMissiles() {
    document.getElementById('missiles').innerHTML = "";
    for(var index = 0; index < missiles.length; index++) {
        document.getElementById('missiles').innerHTML +=
         `<div class='missile' style='position:absolute;left:${missiles[index].left}px;
          top:${missiles[index].top}px;'></div>`;
    }

}

function drawEnemies() {
    document.getElementById('enemies').innerHTML = "";
    for(var index = 0; index < enemies.length; index++) {
        document.getElementById('enemies').innerHTML +=
         `<div class='enemy' style='left:${enemies[index].left}px;
          top:${enemies[index].top}px'></div>`;
    }

}

function moveMissiles() {
    for(var index = 0; index < missiles.length; index++) {
        if(missiles[index].top < 0 ) {
            missiles.splice(index,1);
        }
        else {
            missiles[index].top = missiles[index].top - SPEED_MISSILES;
        }
    }

}

function moveEnemies() {
    for(var index = 0; index < enemies.length; index++) {
        if(enemies[index].top > 850 ) {
            enemies.splice(index,1);
            DELETED_ENEMIS = 1;
        }
        else {
            enemies[index].top = enemies[index].top + SPEED_ENEMIES;
        }
    }
}

//If the colision has occurred the hero gains 5 points and a sound is made.
function collisionDetection() {
    // 50 = the enemy's height
    for(var index = 0; index < enemies.length; index++) {
        for(var index2 = 0; index2 < missiles.length; index2++) {
            if( ( enemies[index] != null && enemies[index].top + 50 >= missiles[index2].top) &&
                (enemies[index].top < missiles[index2].top) &&
                (enemies[index].left <= missiles[index2].left) &&
                (enemies[index].left + 50 >= missiles[index2].left) ) {
                    
                    hitSound.pause();
                    hitSound.play();

                    enemies.splice(index,1);
                    missiles.splice(index2,1);
                    NR_POINTS +=5;
                }
                     
        }
    }

}


function randomInt(min, max) {
    
	return min + Math.floor((max - min + 1) * Math.random());
}

// The enemies are generated automaticaly by a random function.
function generateEnemies() {

    MAX_ELEMENT = MAX_ELEMENT % 50;
    MIN_ELEMENT = MIN_ELEMENT % 30;
    
    SPEED_ENEMIES = SPEED_ENEMIES + SPEED_ENEMIES*parseInt(MAX_ELEMENT/50);
    var nrEnemies = randomInt(MIN_ELEMENT, MAX_ELEMENT);
    var nrCols = nrEnemies < 5 ? nrEnemies : 5;
    var nrRows = Math.ceil(nrEnemies / nrCols);

    for (var indexR = 0; indexR < nrRows; indexR++ )
        for (var indexC = 0; indexC < nrCols; indexC++)
            enemies.push({left: 200 * (indexC), top: 100 * (indexR)});

}

function level() {

    if(enemies.length == 0) {
        if (DELETED_ENEMIS == 0) {
            NR_LEVEL++;
            nextLevel();
        }
        if(DELETED_ENEMIS == 1) {
            NR_LIVES--;
            if(NR_LIVES > 0) nextLevel();
            else restartGame();
        }
    }
}

// If the player loses the game is restarted.
function restartGame() {
    console.log("Restart game!");
    DELETED_ENEMIS = 0;
    GAME_STATE = 0;
    NR_LIVES = 3;
    NR_LEVEL = 1;
    NR_POINTS = 0;
    startButton.style.visibility = "visible";
    window.clearTimeout(timeOut);
    setupGame();
}

function updateLabels() {
    document.getElementById("level").innerHTML="LEVEL :   " + NR_LEVEL;
    document.getElementById("lives").innerHTML="LIVES :   " + NR_LIVES;
    document.getElementById("score").innerHTML="SCORE :   " + NR_POINTS;
}

function nextLevel() {
    DELETED_ENEMIS = 0;
    MAX_ELEMENT ++;
    MIN_ELEMENT++;
    window.clearTimeout(timeOut);
    setupGame();
} 

function gameLoop() {

    if(GAME_STATE == 1) {
        modal = document.getElementById('id01');
        // When the user clicks anywhere outside of the modal, close it
        window.onclick = function(event) {
            if (event.target == modal) {
                modal.style.display = "none";
                }
        }

        
        drawEnemies();
        moveEnemies();
        moveMissiles();
        drawMissiles();
        collisionDetection();
        level();
        updateLabels();
    }
    
   timeOut = setTimeout(gameLoop, 100);
}

// Change the background and the game elements.
function changeStyle (){

    if(document.getElementById("christmasStyle").checked == true) {
        document.getElementById("background").style.backgroundImage = "url('style/cb.jpg')";
       
    } else  if(document.getElementById("secondStyle").checked == true){
        document.getElementById("background").style.backgroundImage = "url('style/background2.png')";
  
    } else {
        document.getElementById("background").style.backgroundImage = "url('style/background.png')";
    }
}

function validateEmail() {

    var text = document.getElementById("email").value;
    console.log(text);
    var regex = /^[a-zA-Z0-9!#$_-]+(\.[a-zA-Z0-9!#$_-]+)*@([a-z]+([a-z]*)\.)+[a-z]+$/;

    if ( regex.test(text) == false)
     alert('Please enter a valid email address.');
}