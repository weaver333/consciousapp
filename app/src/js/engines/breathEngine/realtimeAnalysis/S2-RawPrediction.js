function calcRawPrediction(totalDiff, thValue, lastBreathStates, maxLastBreathStates) {

    diffValue = totalDiff;

    if (diffValue < thValue && diffValue > -thValue) {
        //console.log('Holding, the total diff is ' + totalDiff);
        //push to states array for moving average calculation (actually most frequent result)
        if (lastBreathStates.length > maxLastBreathStates) {
            //do a removal based on last breath states
            lastBreathStates.shift();
        } 
        lastBreathStates.push('Holding');
        return lastBreathStates; // values to pass to Step 2 (Raw state prediction)
    } else if (thValue > diffValue) {
        //console.log('breathing in, the total diff is' + totalDiff);
        //push to states array for simple moving average calculation
        if (lastBreathStates.length > maxLastBreathStates) {
            //do a removal based on last breath states
            lastBreathStates.shift();
        }
        lastBreathStates.push('Inhaling');
        return lastBreathStates; // values to pass to Step 2 (Raw state prediction)

    } else if (thValue < diffValue && thValue > -diffValue) {
        //console.log('breathing out, the total diff is ' + totalDiff);
        //push to states array for simple moving average calculation
        if (lastBreathStates.length > maxLastBreathStates) {
            //do a removal based on last breath states
            lastBreathStates.shift();
        }
        lastBreathStates.push('Exhaling');
        return lastBreathStates; // values to pass to Step 2 (Raw state prediction)
    }
    return lastBreathStates;
}

export default calcRawPrediction;