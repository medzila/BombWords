/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var canvas, ctx, w, h , canvasT , ctxT, wT, hT,pos,index;
var motEntree = [];

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
    
};

function mainloop(){
    requestAnimationFrame(mainloop);
}

function toucheAppuyee(evt){
    console.log("touche appuyee code=" + evt.keyCode);
    ctxT.font = "68px Calibri,Geneva,Arial";
    ctxT.fillStyle = "black";
}

function toucheRelachee(evt){
    ctxT.clearRect(0,0,wT,hT);
    motEntree.push(evt.keyCode);
    console.log("touche relachee");
    index = 0;
    pos = 10;
    for	(index = 0; index < motEntree.length; index++) {
        ctxT.fillText(String.fromCharCode(motEntree[index]),pos, 68);
        pos+=45;
    }
}