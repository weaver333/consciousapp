// This file isn't just used for Breaths per minute. It is also used for function calls at certain points in the breath sequence.
// Such as: sessionData.topOfBreathData.push(sessionData.breathDepthNow + delayCompensation);

function calcBreathsPerMinute(trueState) {
    //console.log(sessionData.breathStateNow);

    function incrementBreathCount(){
        sessionData.breathCycles++;
    }

    function calculateBrPM(){
        sessionData.breathsPerMin = sessionData.totalSessionTime ? ((sessionData.breathCycles / sessionData.totalSessionTime) * 60).toFixed(1) : '';
    }

    function calculateTopOfBreath(){
        // Delay compensation is added because the system takes a certain amount of ms to predict the state
        // and so the captured top of breath is usually lower than it really is. Average is about 20 percentage points from actual value on exhale.
        if(!Number.isNaN(sessionData.breathDepthNow) && sessionData.breathDepthNow > 50){
            sessionData.topOfBreathData.push(sessionData.breathDepthNow + performanceVars.breathDepthDelayCompensation);
        }
    }

    function calculateBreathInfo(){
        // Breaths per session and per minute calculator based on sessionData.breathStateNow
        // Create sessionData.breathsequence array which shows the last breath events, never pushing the same states more than once
        // Max array length of 3 breath states held
        // if array order is inhale, hold, exhale, or inhale, exhale at any point in the array - increment one to breath counter
        if (sessionData.breathSequence[0] === 'Exhaling' && sessionData.breathSequence[1] === 'Holding' && sessionData.breathSequence[2] === 'Inhaling') {
            incrementBreathCount();
            calculateBrPM();
        }
        if (sessionData.breathSequence[1] === 'Exhaling' && sessionData.breathSequence[2] === 'Inhaling') {
            incrementBreathCount();
            calculateBrPM();
        }
        if(sessionData.breathSequence[1] === 'Inhaling' && sessionData.breathSequence[2] === 'Holding'){
            calculateTopOfBreath();
        }
    }

    // Add to breath sequencer, then calculate the breath info (breath count and breaths per minute)
    if (sessionData.breathSequence.length < 3) {
        sessionData.breathSequence.push(sessionData.breathStateNow);
        calculateBreathInfo();

    } else if (sessionData.breathStateNow !== sessionData.breathSequence[2] && sessionData.breathSequence.length === 3) {
        sessionData.breathSequence.shift();
        sessionData.breathSequence.push(sessionData.breathStateNow);
        calculateBreathInfo();
    }
    if (sessionData.breathCycles !== NaN) {
        //console.log(breathCount);
    } else {
        reject(console.log(Error));
    }
}

export {
    calcBreathsPerMinute
};