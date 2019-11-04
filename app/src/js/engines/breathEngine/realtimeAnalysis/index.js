// BREATH DATA PREDICTION AND ANALYSIS

// DEPS NEEDED: 
// DfDict (computer vision section)
// minDict (computer vision section)
// maxDict (computer vision section)
// totalSessionTime (init section)  

// import { showBreathDepthCircle, showBreathGuide } from '../UI/Circle';
import calcBreathDepth from './S1-BreathDepth.js';
import calcRawPrediction from './S2-RawPrediction.js';
import calcSmoothedPrediction from './S3-PredictionSmoothing.js';
import { calcBreathsPerMinute } from './S4-BreathsPerMin.js';

var lastBreathStates = []; // shows the last few states as to find the most common one for anomaly reduction. Set with performanceVars.maxLastBreathStates.

function analyseCVData(dfDictCV, minDictCV, maxDictCV, totalSessionTime) {

    var dfDict = dfDictCV;
    var minDict = minDictCV;
    var maxDict = maxDictCV;

    var calculateCompletion = new Promise(function(resolve, reject) {
        // STEP 1 - CALCULATE BREATH DEPTH
        totalDiff = calcBreathDepth(dfDict, minDict, maxDict);

        if (totalDiff !== undefined) {
            resolve(totalDiff); // values to pass to Step 2 (Raw state prediction)
        } else {
            reject(console.log(Error));
        }
        return totalDiff;
    });

    calculateCompletion.
    then(function(totalDiff) {
        //STEP 2 - RAW STATE PREDICTION - This is the raw prediction before the Simple Moving Average has been applied to discount anomilies
        // console.log('step 2 raw prediction hit', totalDiff);
        return calcRawPrediction(totalDiff, performanceVars.thValue, lastBreathStates, performanceVars.maxLastBreathStates);
    }).
    then(function(lastBreathStates) {
        // STEP 3 - BREATH STATE SMOOTHING/AVERAGING
        // Function to calculate true state by most frequent in LastBreathStates array. At a rate of 17~ results a second looking at last 5 results in Array, we'll get a true state every 0.3 seconds. This mitigates anomalies.
        // console.log('step 3 Smoothing hit', lastBreathStates);

        return calcSmoothedPrediction(lastBreathStates);
    }).
    then(function(trueState) {
        // STEP 4 - BrPM CALCULATION
        // console.log('step 4 BrPM hit', trueState);
        return calcBreathsPerMinute(trueState, totalSessionTime);
    }).
    catch(function(reason) {
        // console.log(reason);
    });

    if(sessionData.calibration.calibrationComplete === true){
        // Needs to be refactored into the UI module, but for now for some reason needs to run in the realtime area
        // showBreathDepthCircle();
        // showBreathGuide();
    }
}

export { analyseCVData };