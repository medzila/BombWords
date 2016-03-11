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

function selectWordsToWrite(tab1,tab2){
    var wordsNb;
    var firstLetter;
    while(tab2.length < 10){
        wordsNb = Math.floor(Math.random() * tab1.length);
        firstLetter = true;
        for(var i = 0;i<tab2.length;i++){
            if(tab1[wordsNb][0].toUpperCase() === tab2[i][0].toUpperCase()){
                firstLetter = false;
                break;
            }
        }
        if(firstLetter){
            tab2.push(tab1[wordsNb]);
        }
    }
}