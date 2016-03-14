/* 
 * Utils functions
 */
 
 function distanceBetweenTwoPoints(x1, y1, x2, y2){
	//console.log("Apl fctn: dist");
	var a = x1 - x2;
	var b = y1 - y2;
	
	return Math.sqrt(a*a + b*b);
}

function angleBetweenTwoPoints(x1, y1, x2, y2){
	var dx = x1 - x2;
	var dy = y1 - y2;
	var angle = Math.atan2(dy, dx); 
	
	return angle;
	/*x[i] = xin - cos(angle) * segLength;
	y[i] = yin - sin(angle) * segLength;*/
}

function selectWordsToWrite(tab){
    var rand = Math.floor(Math.random() * 10)+2;
    while(tab.length < 10){
        wordsToWrite.push(WORDS[rand][Math.floor(Math.random()*WORDS[rand].length)]);
        rand = Math.floor(Math.random() * 10)+2;
    }
}