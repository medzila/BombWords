//Partie serveur
var missileSend;
var bulletSend;
// Autres joueurs
var allPlayers = {};


var canvas, ctx, w, h; 
var canvasT , ctxT, wT, hT;
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

var SPRITESHEET_URL = "image/explosions.png";
var SPRITE_WIDTH = 900/9;
var SPRITE_HEIGHT = 900/9;
var NB_POSTURES=1;
var NB_FRAMES_PER_POSTURE = 73;
var posX;
var posY;

var spritesheet;

var missilesExplosion = [];

var wordsToWrite = [];


window.onload = function(){
    init();
};

function init(){
    console.log("Page chargée");
    canvas = document.getElementById("canvasGame");
    w = canvas.width;
    h = canvas.height;
    ctx = canvas.getContext('2d');
    
    // canvasT = document.getElementById("canvasTexte");
    // wT = canvasT.width;
    // hT = canvasT.height;
    // ctxT = canvasT.getContext('2d');
    
    canvasW = document.getElementById("canvasWords");
    wW = canvasW.width;
    hW = canvasW.height;
    ctxW = canvasW.getContext('2d');
    // load the spritesheet
    
    loadSprites();
    
    selectWordsToWrite(wordsToWrite);
    writeWordsCanvas();
    
    requestAnimationFrame(mainloop);
    canvas.addEventListener('keydown',toucheAppuyee,false);
    canvas.addEventListener('keyup',toucheRelachee,false);
    canvasW.addEventListener('keyup', writeOnCanvasW, false);

    
};

function mainloop(){
    ctx.clearRect(0, 0, w, h);
        
    updateMissilesToEnemy();

    updateBullets();
    
    updateExplosion();
        
    drawAllPlayers();
    
    requestAnimationFrame(mainloop);
}

////////////////////////////////////////////
//              Evenements               //
///////////////////////////////////////////

function writeWordsCanvas(){
    ctxW.font = "15px Calibri,Geneva,Arial";
    ctxW.clearRect(0, 0, wW, hW);
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

function toucheAppuyee(evt){
    //console.log("touche appuyee code=" + evt.keyCode);
    //ctxT.font = "68px Calibri,Geneva,Arial";
    //ctxT.fillStyle = "black";
    if(evt.keyCode === 8 || evt.keyCode === 46){ // Empeche d'aller a la page precedente avec la touche retour
	evt.preventDefault();
    };
    
}

function toucheRelachee(evt){
    //ctxT.clearRect(0,0,wT,hT);
    /*if(evt.keyCode===13){
        testMotEcrit();
        motTapee="";
        ctxT.clearRect(0,0,wT,hT);
    }else{
        car = String.fromCharCode(evt.keyCode);
	lastLetter = car;
        motTapee+=car;
    }*/
    car = String.fromCharCode(evt.keyCode);
    //console.log(car);
    if(currentTarget === null){
	findMissileToDestroy(car);
	checkFirstLetterOfCurrentTarget(car);
    }else{
	checkFirstLetterOfCurrentTarget(car);
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
        writeWordsCanvas();
    }

    //console.log(car+", "+currentLetters);
}

////////////////////////////////////////////
//          Lancement Missiles           //
///////////////////////////////////////////

function launchMissile(word){
    missileSend = new missileToEnemy(Math.random()*w,word);
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
		bullets.push(new bullet(currentTarget));
		currentTarget.remainingLetters = currLett.substring(1);
		if(currentTarget.remainingLetters === ""){
			currentTarget.isDestroyed = true;
			currentTarget = null;
		}
	}
    }
}

/* On trouve la prochaine cible */
function findMissileToDestroy(letter){
    console.log(letter+" "+allPlayers[username][0].motMissile);
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

function updateMToEnemy(){
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

function updateMissiles(){
    for(i = 0; i< missiles.length; i++){
	var m = missiles[i];
        if(m.isDestroyed){
	    if(m === currentTarget){
		currentTarget = null;
	    }
            posX = m.x;
            posY = m.y;
            missiles.splice(i--, 1);
            missilesExplosion.push(new explosions(posX,posY)); // Ajout d'un objet sprite pour l'explosion du missile.
	}
        else{
	    m.draw(ctx);
	    m.move();
	}
    }
}

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

function updatePlayerNewPos(newPos){
    allPlayers[username].push(new missile(newPos.posX,newPos.word));
}

function updatePlayers(listOfPlayers) {
  allPlayers = listOfPlayers;
}
////////////////////////////////////////////////////////
//      Affichage missiles ennemis cote adversaire    //
////////////////////////////////////////////////////////

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
                missilesExplosion.push(new explosions(posX,posY)); // Ajout d'un objet sprite pour l'explosion du missile.
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

function missile(posX,word) {
    this.x=posX;
    this.y=0;
    this.color='blue';
    this.speed=0.5;
    this.rand = Math.floor(Math.random() * 4);
    this.motMissile = word;
    this.remainingLetters = this.motMissile;
    this.isDestroyed = false;
    this.sprite = new Sprite();
    this.sprite.extractSprites(spritesheet_missile, NB_POSTURES_MISSILES, NB_FRAMES_PER_POSTURE_MISSILES, SPRITE_MISSILES_WIDTH, SPRITE_MISSILES_HEIGHT);
    this.sprite.setNbImagesPerSecond(60);
    this.move = function(){
        this.y+=this.speed;
	if(this.y >= h){
	    this.isDestroyed = true;
	}
    };
    this.draw = function(ctx){
        ctx.save();
	ctx.translate(this.x, this.y);
        //console.log("la");
        ctx.fillStyle = this.color;
        ctx.fillRect(0,0,12*this.motMissile.length,20);
        ctx.font = "15px Calibri,Geneva,Arial";
        ctx.fillStyle = "white";
        ctx.fillText(this.remainingLetters,0,15);
	ctx.rotate(180*Math.PI/180);
	this.sprite.draw(ctx, -50, 0);
        ctx.restore();
    };
}

function missileToEnemy(posX,word){
    this.x=posX;
    this.y=h; //h
    this.color='orange';
    this.speed=0.5;
    //this.rand = Math.floor(Math.random() * 4);
    this.motMissile = word;
    this.remainingLetters = this.motMissile;
    this.isDestroyed = false;
    this.move = function(){
        this.y-=this.speed;
    if(this.y <= 0){
        this.isDestroyed = true;
        var toSend = {'user':username, 'word':this.motMissile,'posX':this.x}
        socket.emit('sendpos', toSend);
    }
    };
    this.draw = function(ctx){
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.fillStyle = this.color;
        ctx.fillRect(0,0,12*this.motMissile.length,20);
        ctx.font = "15px Calibri,Geneva,Arial";
        ctx.fillStyle = "white";
        ctx.fillText(this.remainingLetters,0,15);
        ctx.restore();
    };
}

function bullet(target){
    this.x = w/2;
    this.y = h;
    this.target = target;
    this.color = 'red';
    this.speed = 5;
    this.dead = false;
    this.move = function(){
	var dist = distanceBetweenTwoPoints(this.x, this.y, this.target.x, this.target.y);
	if(dist <= 10 || !this.target || this.target.isDestroyed){
	    this.dead = true;
	}else{
	    var angle = angleBetweenTwoPoints(this.target.x, this.target.y, this.x, this.y);
	    
	    this.x += Math.cos(angle) * this.speed ;
	    this.y += Math.sin(angle) * this.speed;
	    
	    //console.log("Apres:"+this.x+";"+this.y);
	    //console.log("==========================");
	}
    };
    this.draw = function(ctx){
        ctx.save();
	ctx.translate(this.x, this.y);
	ctx.beginPath();
	ctx.arc(0, 0, 5, 0, 2 * Math.PI, false);
	ctx.fillStyle = this.color;
	ctx.fill();
	ctx.lineWidth = 2;
	ctx.strokeStyle = '#003300';
	ctx.stroke();
        ctx.restore();
    };
}

/**
 * Objet sprite permettant le dessin de l'explosion.
 * @param {type} x positon x de l'explosion
 * @param {type} y position y de l'explosion
 */
function explosions(x,y) {
    this.explode = new Sprite();
    this.explode.extractSprites(spritesheet, NB_POSTURES, 
                                NB_FRAMES_PER_POSTURE, 
                                SPRITE_WIDTH, SPRITE_HEIGHT);
    this.explode.setNbImagesPerSecond(60);
    this.posExplodeX=x;
    this.posExplodeY=y;
}

