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
    
    pos = 10;
        
    requestAnimationFrame(mainloop);
    document.addEventListener('keydown',toucheAppuyee,false);
    document.addEventListener('keyup',toucheRelachee,false);
    document.addEventListener('click',lancementMissile,false);

    
};

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
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x,this.y,12*this.motMissile.length,20);
        ctx.font = "15px Calibri,Geneva,Arial";
        ctx.fillStyle = "white";
        ctx.fillText(this.remainingLetters, this.x,this.y+15);
        ctx.restore();
    };
}

function mainloop(){
    ctx.clearRect(0, 0, w, h);
    
    updateMissiles();
    
    ctxT.fillText(motTapee,pos, 68);
    requestAnimationFrame(mainloop);
}

function toucheAppuyee(evt){
    //console.log("touche appuyee code=" + evt.keyCode);
    ctxT.font = "68px Calibri,Geneva,Arial";
    ctxT.fillStyle = "black";
    if(evt.keyCode == 8 || evt.keyCode == 46){ // Empeche d'aller a la page precedente avec la touche retour
	evt.preventDefault();
    };
    
}

function updateMissiles(){
    missiles.forEach(function(m, index, obj){
        if(m.isDestroyed){
	    if(m == currentTarget){
		currentTarget = null;
	    }
	    missiles.splice(index, 1);
	}
        else{
	    m.draw(ctx);
	    m.move();
	}
    });
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
    console.log(car);
    if(currentTarget == null){
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
    if(currentTarget != null){
	var currLett = currentTarget.remainingLetters;
	if(currentTarget != "" && currLett.charAt(0) == letter){
		currentTarget.remainingLetters = currLett.substring(1);
		if(currentTarget.remainingLetters == ""){
			currentTarget.isDestroyed = true;
			currentTarget = null;
		}
	}
    }
}

/* On trouve la prochaine cible */
function findMissileToDestroy(letter){
    missiles.some(function(m, index) {
	if(m.motMissile.charAt(0) == letter){
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
