/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var canvas, ctx, w, h; 
var canvasT , ctxT, wT, hT;
var pos,index,ind;
var mots = ["BONJOUR","AUREVOIR","MERCI","MOMO"];
var motTapee="";
var currentTarget = null;
var missiles = [];
var bullets = [];

var SPRITESHEET_URL = "image/explosions.png";
var SPRITE_WIDTH = 900/9;
var SPRITE_HEIGHT = 900/9;
var NB_POSTURES=1;
var NB_FRAMES_PER_POSTURE = 73;
var posX;
var posY;

var spritesheet;

var missilesExplosion = [];

var dico;



window.onload = function(){
    init();
};

function init(){
    console.log("Page chargée");
    canvas = document.getElementById("canvasGame");
    w = canvas.width;
    h = canvas.height;
    ctx = canvas.getContext('2d');
    
    canvasT = document.getElementById("canvasTexte");
    wT = canvasT.width;
    hT = canvasT.height;
    ctxT = canvasT.getContext('2d');
    // load the spritesheet
    
    //Image de l'explosion d'un missile
    spritesheet = new Image();
    spritesheet.src = SPRITESHEET_URL;
    spritesheet.onload = function() {
      requestAnimationFrame(updateExplosion);
    }; // onload
    

    pos = 10;
    
    readTextFile("words.txt");
    
    
    requestAnimationFrame(mainloop);
    document.addEventListener('keydown',toucheAppuyee,false);
    document.addEventListener('keyup',toucheRelachee,false);
    document.addEventListener('click',lancementMissile,false);

    
};

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

function missile() {
    this.x=Math.random()*w;
    this.y=0;
    this.color='blue';
    this.speed=0.5;
    this.rand = Math.floor(Math.random() * 4);
    this.motMissile = mots[this.rand];
    this.remainingLetters = this.motMissile;
    this.isDestroyed = false;
    this.move = function(){
        this.y+=this.speed;
	if(this.y >= h){
	    this.isDestroyed = true;
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

function mainloop(){
    ctx.clearRect(0, 0, w, h);
    
    updateMissiles();
    
    updateBullets();
    
    updateExplosion();
 
    ctxT.fillText(motTapee,pos, 68);
    requestAnimationFrame(mainloop);
}

function toucheAppuyee(evt){
    //console.log("touche appuyee code=" + evt.keyCode);
    ctxT.font = "68px Calibri,Geneva,Arial";
    ctxT.fillStyle = "black";
    if(evt.keyCode === 8 || evt.keyCode === 46){ // Empeche d'aller a la page precedente avec la touche retour
	evt.preventDefault();
    };
    
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

function toucheRelachee(evt){
    ctxT.clearRect(0,0,wT,hT);
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

function lancementMissile(){
    missiles.push(new missile());
}

/* On regarde si la lettre tapee est bien la premiere*/
function checkFirstLetterOfCurrentTarget(letter){
    if(currentTarget !== null){
	var currLett = currentTarget.remainingLetters;
	if(currentTarget !== "" && currLett.charAt(0) === letter){
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
    missiles.some(function(m, index) {
	if(m.motMissile.charAt(0) === letter){
	     currentTarget = m;
	     currentTarget.color = 'red';
	     return true;
	}
  });
}
function testMotEcrit(){
    for(ind=0;ind < missiles.length;ind++){
        if(motTapee===missiles[ind].motMissile){
            missiles.splice(ind,1);
            break;
        }
    }
}
