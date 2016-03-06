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
    this.color='red';
    this.speed=0.5;
    this.rand = Math.floor(Math.random() * 4);
    this.motMissile = mots[this.rand];
    this.move = function(){
        this.y+=this.speed;
    };
    this.draw = function(ctx){
        ctx.save();
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x,this.y,12*this.motMissile.length,20);
        ctx.font = "15px Calibri,Geneva,Arial";
        ctx.fillStyle = "white";
        ctx.fillText(this.motMissile, this.x,this.y+15);
        ctx.restore();
    };
}

function mainloop(){
    ctx.clearRect(0, 0, w, h);
    for(index=0;index < missiles.length;index++){
        missiles[index].draw(ctx);
        missiles[index].move();
    }
    ctxT.fillText(motTapee,pos, 68);
    requestAnimationFrame(mainloop);
}

function toucheAppuyee(evt){
    //console.log("touche appuyee code=" + evt.keyCode);
    ctxT.font = "68px Calibri,Geneva,Arial";
    ctxT.fillStyle = "black";
}

function toucheRelachee(evt){
    ctxT.clearRect(0,0,wT,hT);
    if(evt.keyCode===13){
        testMotEcrit();
        motTapee="";
        ctxT.clearRect(0,0,wT,hT);
    }else{
        car = String.fromCharCode(evt.keyCode);
        motTapee+=car;
    }
}

function lancementMissile(){
    missiles.push(new missile());
}

function testMotEcrit(){
    for(ind=0;ind < missiles.length;ind++){
        if(motTapee===missiles[ind].motMissile){
            missiles.splice(ind,1);
            break;
        }
    }
}
