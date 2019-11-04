function calcBreathDepth(dfDict,minDict,maxDict){

    var totalDiff = 0; // totalDiff is passed to the next function to show whether a person is breathing in or out based on the amount of movement in their breath state
    var diffValue = 0;
    var totalStCompln = 0;
    var ct = 1;
    for (var k in dfDict) {
        if (dfDict[k][0] != undefined) {
            // Most of this code below is for finding the diff value as to predict breath state. May need to be moved, but it also does calculate breath depth too with find state completion.
            // We get the first value of the point position, then the last value, and we find the difference between them as to see what the total 
            // difference is between them
            var firstValue = dfDict[k][0];
            //console.log('first val', firstValue);
            var lastValue = dfDict[k][dfDict[k].length-1];
            //console.log('last val',lastValue);
            diffValue = lastValue-firstValue;
            // Total diff gives you a number that represents the amount of breath 
            totalDiff += diffValue;
            //console.log(totalDiff);
            var temp = findStateCompletion(minDict[k], maxDict[k], lastValue);
            totalStCompln += isNaN(temp)?0:temp;
            ct +=1;
        }
    }

    // Basically it's saying, use the min and max values to set a range of the breath, and compare it against the current value as a percentage
    function findStateCompletion(stateMin, stateMax, curValue) {
        //console.log((curValue-stateMin)*100/(stateMax-stateMin));
        return (curValue-stateMin)*100/(stateMax-stateMin);
    }

    // Basically it's saying, use the min and max values to set a range, and compare it against the current value
    let singleStCom = findStateCompletion(minDict[0], maxDict[0], dfDict[0][dfDict[0].length-1]);

    // Push to global sessionData object for snapshot analysis + UI
    // Set to the current breath depth (the calculation represents it)
    sessionData.breathDepthNow = (100-parseInt(singleStCom));
    
    return totalDiff;
}

export default calcBreathDepth;