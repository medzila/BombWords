//Partie serveur
var missileSend;
var bulletSend;
// Autres joueurs
var allPlayers = {};


var canvas, ctx, w, h; 
var canvasE , ctxE, wE, hE;
var canvasW , ctxW, wW, hW;
var pos,index,ind,posY;
var currentTarget = null;
var currentLetters = null;
var currentWord = null;
var missiles = [];
var missilesToEnemy = [];
var bullets = [];

var SPRITESHEET_MISSILES_URL = "image/sprite_sheet_missiles.png";
var SPRITE_MISSILES_WIDTH = 32;
var SPRITE_MISSILES_HEIGHT = 132;
var NB_POSTURES_MISSILES=1;
var NB_FRAMES_PER_POSTURE_MISSILES = 25;

var SPRITESHEET_EXPLOSION_URL = "image/sprite_sheet_explosion.png";
var SPRITE_EXPLOSION_WIDTH = 64;
var SPRITE_EXPLOSION_HEIGHT = 148;
var NB_POSTURES_EXPLOSION=1;
var NB_FRAMES_PER_POSTURE_EXPLOSION = 24;

var SPRITESHEET_URL = "image/explosions.png";
var SPRITE_WIDTH = 900/9;
var SPRITE_HEIGHT = 900/9;
var NB_POSTURES=1;
var NB_FRAMES_PER_POSTURE = 73;

var lifebar_profile_URL = "image/lifebar_profil.png";
var lifebar_end_URL = "image/lifebar_end.png";
var cannon_socle_URL = "image/cannon_socle.png";
var cannon_URL = "image/cannon.png";
var mute_URL = "image/mute.png";
var cannonball_URL = "image/cannon_ball.png";
var target_URL = "image/target.png";

var lifebar_profile_img;
var lifebar_end_img;
var cannon_socle_img;
var cannon_img;
var mute_img;
var cannonball_img;
var target_img;

var posX;
var posY;

var spritesheet, spritesheet_explosion;

var missilesExplosion = [];

var wordsToWrite = [];

var backgroundAudio, bulletSound, launchSound, explosionSound;

var player1;
var playerEnemy;

var endGame;
var enemyLoose;

var restart = false;
var restartSend = false;

window.onload = function(){
    init();
};

function init(){
    console.log("Page chargée");
    canvas = document.getElementById("canvasGame");
    w = canvas.width;
    h = canvas.height;
    ctx = canvas.getContext('2d');
    
    canvasE = document.getElementById("canvasEnemy");
    wE = canvasE.width;
    hE = canvasE.height;
    ctxE = canvasE.getContext('2d');
    
    canvasW = document.getElementById("canvasWords");
    wW = canvasW.width;
    hW = canvasW.height;
    ctxW = canvasW.getContext('2d');
    
    canvasWin = document.getElementById("canvasWin");
    wWin = canvasWin.width;
    hWin = canvasWin.height;
    ctxWin = canvasWin.getContext('2d');
    canvasWin.style.display="none";
    
    canvasLoose = document.getElementById("canvasLoose");
    wLoose = canvasLoose.width;
    hLoose = canvasLoose.height;
    ctxLoose = canvasLoose.getContext('2d');
    canvasLoose.style.display="none";
    
    loadSprites();
    
    lifebar_profile_img = new Image();
    lifebar_profile_img.src = lifebar_profile_URL;

    lifebar_end_img = new Image();
    lifebar_end_img.src = lifebar_end_URL;

    cannon_socle_img = new Image();
    cannon_socle_img.src = cannon_socle_URL;

    cannon_img = new Image();
    cannon_img.src = cannon_URL;
    
    cannonball_img = new Image();
    cannonball_img.src = cannonball_URL;

    target_img = new Image();
    target_img.src = target_URL;

    mute_img = new Image();
    mute_img.src = mute_URL;

    selectWordsToWrite(wordsToWrite);
    writeWordsCanvas();
        
    backgroundAudio = new Audio("sounds/backgroundAudio.wav");
    backgroundAudio.loop = true;
    backgroundAudio.volume = .25;
    backgroundAudio.load();
    backgroundAudio.play();

    bulletSound = new SoundPool(15);
    bulletSound.init("bullet");

    launchSound = new SoundPool(20);
    launchSound.init("launch");

    explosionSound = new SoundPool(20);
    explosionSound.init("explosion");
    
    player1 = new player(100);
    playerEnemy = new player(100);
    
    endGame = true;
    restartSend = false;
    
    requestAnimationFrame(mainloop);
    document.addEventListener('keydown',toucheAppuyee,false);
    canvas.addEventListener('keyup',toucheRelachee,false);
    canvas.addEventListener("mousedown", clickFunction);
    canvasW.addEventListener('keyup', writeOnCanvasW, false);
    
    canvasWin.addEventListener('click',restartWinner);
    canvasLoose.addEventListener('click',restartLooser);
};

function mainloop(){
    if(endGame){
        ctx.clearRect(0, 0, w, h);
        ctxE.clearRect(0, 0, wE, hE);
        ctxW.clearRect(0, 0, wW, hW);
        drawCanvasWords();
        updateMissilesToEnemy();

        updateBullets();
    
        updateExplosion(ctx);
        
        drawAllPlayers();
    
        drawVueEnemy();

        player1.draw(ctx);
    }else{
        document.getElementById("gameDiv").style.display="none";      
        
        if(player1.life > 0){
            canvasWin.style.display="block";
            ctxWin.font="30px Verdana";
            ctxWin.fillStyle='blue';
            ctxWin.fillText("Bravo ! Vous avez gagné :)" ,wWin/2-180,hWin/2);
            ctxWin.fillText("Cliquez pour recommencer en attendant l'adversaire ..." ,(wWin/2)-330,(hWin/2)+50);
            
        }else{
            canvasLoose.style.display="block";
            ctxLoose.font="30px Verdana";
            ctxLoose.fillStyle='red';
            ctxLoose.fillText("Dommage ! Vous avez perdu :(" ,wLoose/2-180,hLoose/2);
            ctxLoose.fillText("Cliquez pour recommencer en attendant l'adversaire ..." ,(wLoose/2)-330,(hLoose/2)+50);
        }
        if(restart && restartSend){
            restartFunction();
        }
    }
    requestAnimationFrame(mainloop);
}

////////////////////////////////////////////
//              Evenements               //
///////////////////////////////////////////

/**
 * Affiche les mots à taper dans le canvas du jeu
 */
function drawCanvasWords(){
    ctxW.save();

    ctxW.globalAlpha = 0.8;
    ctxW.fillStyle = "red";
    ctxW.fillRect(0, 0, wW, 30);
    ctxW.globalAlpha = 1;
    ctxW.fillStyle = "black";
    writeWordsCanvas();

    ctxW.restore();
}
/*
 * Ecris les mots à taper dans le canvas du jeu
 */
function writeWordsCanvas(){
    ctxW.font = "15px Calibri,Geneva,Arial";
    pos = 10;
    posY = 20;

    for(var i = 0;i<wordsToWrite.length;i++){
       ctxW.fillText(wordsToWrite[i],pos,posY);
       pos+= 10*wordsToWrite[i].length;
       if(pos+wordsToWrite.length*10 > wW){
           pos = 10;
           posY+=20;
       }
    }
}

// Empeche d'aller a la page precedente avec la touche retour
function toucheAppuyee(evt){
    if(evt.keyCode === 8 || evt.keyCode === 46){ 
	evt.preventDefault();
    };
    
}

/*
 * Recherche la cible en fonction de la premiere lettre tapee
 */
function toucheRelachee(evt){
    car = String.fromCharCode(evt.keyCode);
    if(currentTarget === null){
	findMissileToDestroy(car);
	checkFirstLetterOfCurrentTarget(car);
    }else{
	checkFirstLetterOfCurrentTarget(car);
    }
}


var clickFunction = function(e) {
    var positions = getMousePosition(e,canvas);
 
    if ( positions[ 0 ] > 0 && positions[ 0 ] < 20 
      && positions[ 1 ] > 0 && positions[ 1 ] < 20 + 19 ) {
        mute();
    }
}

function writeOnCanvasW(evt){
    var car = String.fromCharCode(evt.keyCode);

    if(currentLetters === null){
        currentWord = wordsToWrite[0];
        currentLetters = wordsToWrite[0];
    }

    if(car.toUpperCase() === currentLetters.charAt(0).toUpperCase()){
        currentLetters = currentLetters.substring(1);
        wordsToWrite[0] = currentLetters;

        if(currentLetters === ""){
            launchMissile(currentWord);
            wordsToWrite.splice(0,1);
            var rand = Math.floor(Math.random() * 10)+2;
            wordsToWrite.push(WORDS[rand][Math.floor(Math.random()*WORDS[rand].length)]);
            currentWord = null;
            currentLetters = null;
        }
    }
}

////////////////////////////////////////////
//          Lancement Missiles           //
///////////////////////////////////////////

function launchMissile(word){
    launchSound.get();
    missileSend = new missileToEnemy(Math.random()*w,word,true);
    missilesToEnemy.push(missileSend);
}

////////////////////////////////////////////
//          Recherche mot Cible           //
///////////////////////////////////////////


/* On regarde si la lettre tapee est bien la premiere*/
function checkFirstLetterOfCurrentTarget(letter){
    if(currentTarget !== null){
	var currLett = currentTarget.remainingLetters;
	if(currentTarget !== "" && currLett.charAt(0) === letter.toLowerCase()){
                var toSendTarget = {'user':username, 'word':currentTarget.motMissile,'letter':letter}
                socket.emit('sendTarget', toSendTarget);
		bullets.push(new bullet(currentTarget));
        bulletSound.get();
		currentTarget.remainingLetters = currLett.substring(1);
		if(currentTarget.remainingLetters === ""){
			//currentTarget.isDestroyed = true;
			currentTarget.color = "grey";
			currentTarget = null;
		}
	}
    }
}

/* On trouve la prochaine cible */
function findMissileToDestroy(letter){
    allPlayers[username].some(function(m, index) {
	if(m.motMissile.charAt(0) === letter.toLowerCase()){
	     currentTarget = m;
	     currentTarget.color = 'red';
	     return true;
	}
  });
}

//////////////////////////////////////////////
//          Fonction de mise à jour         //
/////////////////////////////////////////////

//Gestion des boulets de canon lancer par le joueur
function updateBullets(){
    for(i=0; i < bullets.length; i++){
        if(bullets[i].dead){
            bullets.splice(i--,1);
        }
	else{
	    bullets[i].move();
	    bullets[i].draw(ctx);
	}
    }
}

// Gere les missiles ennemies lancer par le joueur
function updateMissilesToEnemy(){
    for(i = 0; i<missilesToEnemy.length; i++){
        var m = missilesToEnemy[i];

        if(m.isDestroyed){
            missilesToEnemy.splice(i--, 1);
        }else{
            m.draw(ctx);
            m.move();
        }
    }
}

/**
 * Dessine l'explosion d'un missile
 */
function updateExplosion(){
    for(var i = 0; i<missilesExplosion.length;i++){
        if(missilesExplosion[i].explode.currentFrame<missilesExplosion[i].explode.spriteArray.length-1){ // Pour que l'explosion prenne fin.
           missilesExplosion[i].explode.draw(ctx,missilesExplosion[i].posExplodeX,missilesExplosion[i].posExplodeY,1); 
        }else{
            missilesExplosion.splice(i--, 1);
        }
    }
}

/**
 * gestion du missile envoyer par l'adversaire
 */
function updatePlayerNewPos(newPos){
    allPlayers[username].push(new missile(newPos.posX,newPos.word,true));
}

function updatePlayers(listOfPlayers) {
  allPlayers = listOfPlayers;
}

////////////////////////////////////////////////////////
//      Affichage missiles ennemis cote adversaire    //
////////////////////////////////////////////////////////

/**
 * Affiche les missiles ennemi à detruire par le joueur
 */
function drawAllPlayers() {
  for(var name in allPlayers) {
      for(i = 0; i<allPlayers[name].length; i++){
        var m = allPlayers[name][i];
        if(m instanceof missile){
            if(m.isDestroyed){
                if(m === currentTarget){
                    currentTarget = null;
                }
                posX = m.x;
                posY = m.y;
                allPlayers[name].splice(i--, 1);
                var explo;
                if(posY >= h){
                    explo = new explosions(1,posX, posY-148);
                }else{
                    explo = new explosions(0,posX, posY-50);
                }
                missilesExplosion.push(explo); // Ajout d'un objet sprite pour l'explosion du missile.
                explosionSound.get();
            }else{
                m.draw(ctx);
                m.move();
            }
            
        }
    }
  }
}

////////////////////////////////////////////
//              Constructeur             //
///////////////////////////////////////////

function player(health) {
    this.playerName = username;
    this.life = health;
    this.looseLife = function() {
        this.life = this.life <= 0 ? 0 : this.life - 20;
        if(this.life <= 0){
            endGame = false;
            var toSendEndGame = {'user':this.playerName.toString(), 'end':false}
            socket.emit('sendEndGame', toSendEndGame);
        }
    };
    this.draw = function(ctx) {
        ctx.save();

        ctx.drawImage(lifebar_profile_img, w/8 , h/8);
        ctx.drawImage(lifebar_end_img, 7*w/8, h/8 + 16);

        ctx.fillStyle = "grey";
        posX = w/8+66;
        posY = h/8+19;
        long = 234;
        larg = 20;
        ctx.fillRect(posX, posY, long, larg);

        ctx.fillStyle = "green";
        ctx.fillRect(posX, posY+2, long*(this.life/100) -2, larg-4);

        ctx.drawImage(cannon_img, w/2 -10, h-46);
        ctx.drawImage(cannon_socle_img, w/2 - 13, h - 18);

        ctx.drawImage(mute_img, 0, 0, mute_img.width, mute_img.height, 0, 0, 20, 20);
        ctx.restore();
    };
}

/*
 * Missile envoyer par l'ennemi
 */
function missile(posX,word,loose) {
    this.x=posX;
    this.y=0;
    this.color='blue';
    this.speed=1.3;
    this.rand = Math.floor(Math.random() * 4);
    this.motMissile = word;
    this.remainingLetters = this.motMissile;
    this.isDestroyed = false;
    this.alreadyHit = this.motMissile.length;
    this.sprite = new Sprite();
    this.sprite.extractSprites(spritesheet_missile, NB_POSTURES_MISSILES, NB_FRAMES_PER_POSTURE_MISSILES, SPRITE_MISSILES_WIDTH, SPRITE_MISSILES_HEIGHT);
    this.sprite.setNbImagesPerSecond(60);
    this.wordWidth = 8*this.motMissile.length;
    this.move = function(){
        this.y+=this.speed;
	if(this.y >= h){
        if(player1.playerName === username && loose){
                player1.looseLife();
                var toSendHealth = {'user':username, 'health':player1.life}
                socket.emit('sendHealth', toSendHealth);
            }
	    this.isDestroyed = true;
	}
    };
    this.draw = function(ctx){
        ctx.save();
	ctx.translate(this.x, this.y);
        ctx.fillStyle = this.color;
        ctx.fillRect(0,0,this.wordWidth,20);
        ctx.font = "15px Calibri,Geneva,Arial";
        ctx.fillStyle = "white";
        ctx.fillText(this.remainingLetters,0,15);

	    ctx.rotate(180*Math.PI/180);
	    this.sprite.draw(ctx,  - this.wordWidth/2 - 16 , 0);

        ctx.rotate(-180*Math.PI/180);
        if(this === currentTarget){
            ctx.drawImage(target_img, 0, 0, target_img.width, target_img.height, this.wordWidth / 2 - 40, -100, 80, 80);
        }

        ctx.restore();
    };
}

/*
 * Missile envoyer par le joueur
 */
function missileToEnemy(posX,word,bool){
    this.motMissile = word;
    this.wordWidth = 8*this.motMissile.length;
    this.x=posX + this.wordwidth > w ? posX - this.wordWidth : posX;
    this.y=h; //h
    this.color='orange';
    this.speed=1.3;
    this.remainingLetters = this.motMissile;
    this.isDestroyed = false;
    this.sprite = new Sprite();
    this.sprite.extractSprites(spritesheet_missile, NB_POSTURES_MISSILES, NB_FRAMES_PER_POSTURE_MISSILES, SPRITE_MISSILES_WIDTH, SPRITE_MISSILES_HEIGHT);
    this.sprite.setNbImagesPerSecond(60);
    this.move = function(){
        this.y-=this.speed;
    if(this.y <= 0){
        this.isDestroyed = true;
        if(bool){
            var toSend = {'user':username, 'word':this.motMissile,'posX':this.x}
            socket.emit('sendpos', toSend);
            var targetEnemy = new missile(this.x,this.motMissile,false);
            missileVue.push(targetEnemy);
        }
    }
    };
    this.draw = function(ctx){
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.fillStyle = this.color;
        ctx.fillRect(0,0,this.wordWidth,20);
        ctx.font = "15px Calibri,Geneva,Arial";
        ctx.fillStyle = "white";
        ctx.fillText(this.remainingLetters,0,15);
        this.sprite.draw(ctx,this.wordWidth/2 - 16,-130)
        ctx.restore();
    };
    if(bool){
        var toSendVue = {'user':username, 'word':this.motMissile,'posX':this.x}
        socket.emit('sendVue', toSendVue);
    }
}

/*
 * Boulet envoyer par le joueur pour detruire un missile adversaire
 */
function bullet(target){
    this.x = w/2;
    this.y = h;
    this.target = target;
    this.color = 'red';
    this.speed = 5;
    this.dead = false;
    this.move = function(){
	var dist = distanceBetweenTwoPoints(this.x , this.y, this.target.x + this.target.wordWidth / 2, this.target.y);
	if(dist <= 10){
	    this.dead = true;
		this.target.alreadyHit --;
		if(this.target.alreadyHit <= 0){
			this.target.isDestroyed = true;
		}
	}else{
	    var angle = angleBetweenTwoPoints(this.target.x + this.target.wordWidth / 2, this.target.y, this.x, this.y);
	    
	    this.x += Math.cos(angle) * this.speed ;
	    this.y += Math.sin(angle) * this.speed;
	    
	}
    };
    this.draw = function(ctx){
        ctx.save();
	ctx.translate(this.x, this.y);
	ctx.drawImage(cannonball_img, 0, 0, cannonball_img.width, cannonball_img.height, 0, 0, 20, 20);
        ctx.restore();
    };
}

/**
 * Objet sprite permettant le dessin de l'explosion.
 */
function explosions(isGround,x,y) {
    this.explode = new Sprite();
    var spritesheet_explo, NB_POSTURES_EXPLO, NB_FRAMES_PER_POSTURE_EXPLO, SPRITE_EXPLO_WIDTH, SPRITE_EXPLO_HEIGHT;
    if(isGround === 0){
        spritesheet_explo= spritesheet;
        NB_POSTURES_EXPLO= NB_POSTURES;
        NB_FRAMES_PER_POSTURE_EXPLO= NB_FRAMES_PER_POSTURE;
        SPRITE_EXPLO_WIDTH= SPRITE_WIDTH;
        SPRITE_EXPLO_HEIGHT= SPRITE_HEIGHT;
    }else{
        spritesheet_explo= spritesheet_explosion;
        NB_POSTURES_EXPLO= NB_POSTURES_EXPLOSION;
        NB_FRAMES_PER_POSTURE_EXPLO= NB_FRAMES_PER_POSTURE_EXPLOSION;
        SPRITE_EXPLO_WIDTH= SPRITE_EXPLOSION_WIDTH;
        SPRITE_EXPLO_HEIGHT= SPRITE_EXPLOSION_HEIGHT;
    }
    this.explode.extractSprites(spritesheet_explo, NB_POSTURES_EXPLO, 
                                NB_FRAMES_PER_POSTURE_EXPLO, 
                                SPRITE_EXPLO_WIDTH, SPRITE_EXPLO_HEIGHT);
    this.explode.setNbImagesPerSecond(60);
    this.posExplodeX=x;
    this.posExplodeY=y;
}

////////////////////////////////////////////
//              Vue Ennemie              //
///////////////////////////////////////////

var missileVueEnemy = [];
var bulletVueEnemy = [];
var missileVue = [];
var explosionEnemy =[];
var theLetter = null;
var theTarget = null;
var healthEnemy = 100;

/*
 * Gestion des missiles envoyer par le joueur adverse
 * Apparait dans la vue ennemi
 */
function updateEnemyVue(newPos){
    missileVueEnemy.push(new missileToEnemy(newPos.posX,newPos.word,false));
}

/*
 * Gestion dela cible du joueur adverse
 * Apparait dans la vue ennemi
 */
function updateTarget(newPos){
    theLetter = newPos.letter;
    var tar = newPos.word;
    for(var i = 0; i<missileVue.length; i++){
        var m = missileVue[i];
        if(m.motMissile === tar){
            theTarget = m;
            theTarget.color = 'red';
        }
    }
}

/*
 * Mise a jour vie de l'adversaire
 */
function updateHealth(newPos){
    healthEnemy = newPos.health;
}

/*
 * Representation de la vue adversaire dans le canvas du joueur
 */
function drawVueEnemy(){
    for(var i = 0; i<missileVueEnemy.length; i++){
        var m = missileVueEnemy[i];

        if(m.isDestroyed){
            missileVueEnemy.splice(i--, 1);
        }else{
            m.draw(ctxE);
            m.move();
        }
    }
    for(var i = 0; i<missileVue.length; i++){
        var m = missileVue[i];
        if(m instanceof missile){
            if(m.isDestroyed){
                if(m === theTarget){
                    theTarget = null;
                }
                posX = m.x;
                posY = m.y;
                missileVue.splice(i--, 1);
                var explo;
                if(posY >= h){
                    explo = new explosions(1,posX, posY-148);
                }else{
                    explo = new explosions(0,posX, posY-50);
                }
                explosionEnemy.push(explo); // Ajout d'un objet sprite pour l'explosion du missile.
            }else{
                m.draw(ctxE);
                m.move();
            }
            
        }
    }
     for(var i = 0; i<explosionEnemy.length;i++){
        if(explosionEnemy[i].explode.currentFrame<explosionEnemy[i].explode.spriteArray.length-1){ // Pour que l'explosion prenne fin.
           explosionEnemy[i].explode.draw(ctxE,explosionEnemy[i].posExplodeX,explosionEnemy[i].posExplodeY,1); 
        }else{
            explosionEnemy.splice(i--, 1);
        }
    }
    if(theTarget !== null){
	var currLetter = theTarget.remainingLetters;
	if(theTarget !== "" && currLetter.charAt(0) === theLetter.toLowerCase()){
		bulletVueEnemy.push(new bullet(theTarget));
		theTarget.remainingLetters = currLetter.substring(1);
		if(theTarget.remainingLetters === ""){
			theTarget.color = "grey";
			theTarget = null;
		}
	}
    }
    for(var i=0; i < bulletVueEnemy.length; i++){
        if(bulletVueEnemy[i].dead){
            bulletVueEnemy.splice(i--,1);
        }
	else{
	    bulletVueEnemy[i].move();
	    bulletVueEnemy[i].draw(ctxE);
	}
    }
    playerEnemy.life = healthEnemy;
    playerEnemy.draw(ctxE);
}

////////////////////////////////////////////
//          Gestion Fin De Partie         //
///////////////////////////////////////////


function updateEndGame(newPos){
    endGame = newPos.end;
    enemyLoose = newPos.username;
}

function restartWinner(){
    var toSendRes = {'user':username, 'restart':true}
    socket.emit('sendRestart', toSendRes);
    restartSend = true;
}

function restartLooser(){
    var toSendRes = {'user':username, 'restart':true}
    socket.emit('sendRestart', toSendRes);
    restartSend = true;
}

function updateRestart(newPos){
    restart = newPos.restart;
}

function restartFunction(){
    player1 = new player(100);
    currentTarget = null;
    currentLetters = null;
    currentWord = null;
    missiles = [];
    missilesToEnemy = [];
    bullets = [];
    playerEnemy = new player(100);
    endGame = true;
    restartSend = false;
    document.getElementById("gameDiv").style.display="block";
    canvasWin.style.display="none";
    canvasLoose.style.display="none";
    wordsToWrite = [];
    missilesExplosion = [];
    selectWordsToWrite(wordsToWrite);
    writeWordsCanvas();
    missileVueEnemy = [];
    bulletVueEnemy = [];
    missileVue = [];
    explosionEnemy =[];
    theLetter = null;
    theTarget = null;
    healthEnemy = 100;
    allPlayers[username] = [];
    restart = false;
    restartSend = false;
}