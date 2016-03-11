/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/*
 * Lecture du fichier words + ecriture dans le tableau
 * dictionaryWords de tous les mots.
 */

function readTextFile(file)
{
    var rawFile = new XMLHttpRequest();
    var tab;
    rawFile.open("GET", file, false);
    rawFile.onreadystatechange = function ()
    {
        if(rawFile.readyState === 4)
        {
            if(rawFile.status === 200 || rawFile.status === 0)
            {
                var allText = rawFile.responseText;
                tab = allText.split("\n");
            }
        }
    };
    rawFile.send(null);
    return tab;
}