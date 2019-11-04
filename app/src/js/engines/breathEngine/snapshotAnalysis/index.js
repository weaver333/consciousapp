/// SNAPSHOT ANALYSIS ///

// Snapshot analysis is used to take samples of the realtime data so we can provide an averaged out result.
// The realtimeAnalysis modules cannot be slowed down as they are computed very fast, so here we look at data and store it at different time intervals.
// The more MS in the setInterval functions, the more performant and less data stored - yet the less accurate the averaging/dataset
// The less MS in the setInterval functions, the less performant and more data stored - yet the more accurate the averaging/dataset

import Dygraph from 'dygraphs';
import smoothPlotter from '../../../DygraphSmoothPlotter';

function startSnapshotAnalysis( options ) {

    // Graph the last x seconds for UI purposes
    // If its not been populated yet, give it a small value to keep the lib happy
    if(performanceVars.realtimeGraphing){
        var breathGraph = new Dygraph(document.getElementById("breathGraph"),
        sessionData.breathDepthData.length <= 0 ? [[0,1]] : sessionData.breathDepthData
        ,
        {
            labels: [ "Time", "Depth" ],
            valueRange: [0, 101],
            width: options.graphWidth,
            height: options.graphHeight
        }
        );
        // if(sessionData.mode === 'monitorMode'){
        //     var breathGraph = new Dygraph(document.getElementById("bigBreathGraph"),
        //     sessionData.breathDepthData.length <= 0 ? [[0,1]] : sessionData.breathDepthData
        //     ,
        //     {
        //         labels: [ "Time", "Depth" ],
        //         series: {
        //             Depth:{
        //                 plotter: smoothPlotter,
        //                 drawPoints: true,
        //                 pointSize: 3,
        //                 color: '#27B4AB',
        //                 strokeWidth: 2,
        //             }
        //         },
        //         valueRange: [0, 101],
        //         width: screen.width,
        //         height: 250
        //     }
        //     );
        // }
    } else {
        document.getElementById("breathGraph").style = 'display:none;'
    }
   
    
    newTime = 0;
    // This data is used for graphing the breath depth over time
    // Takes a snapshot of the breathdepth every 300ms and the time, and stores in SessionData
    // NOTE: Breath depth has a manually added amount of compensation given the latency of the tech for breath depth.
    // NOTE: This can be seen in the S4-BreathsPerMin.js file.

    calcBreathDepthTimeSeries = function() {
        newTime = newTime + 1;
        // Adds the breath depth every 300ms to the array
        // If NaN adds protection of stats when calibrating as sometimes its NaN when calibrating.
        // Also adds the timestamp every 300ms to the array
        if(!Number.isNaN(sessionData.breathDepthNow)){
            sessionData.breathDepthData.push([parseInt(newTime.toFixed(2)), sessionData.breathDepthNow]);
        }
        if(performanceVars.realtimeGraphing){
            breathGraph.updateOptions( { 'file':  sessionData.breathDepthData.slice(Math.max(sessionData.breathDepthData.length - 500, 0)) } );
        }
        setTimeout(calcBreathDepthTimeSeries, performanceVars.breathDepthSnapshotInterval);
    }
    setTimeout(calcBreathDepthTimeSeries, performanceVars.breathDepthSnapshotInterval);


    calcGuideAccuracyTimeSeries = function() {
        if (sessionData.breathStateNow === sessionData.guideStateNow) {
            sessionData.guideAccuracyData.push('true');
        } else {
            sessionData.guideAccuracyData.push('false');
        }
        setTimeout(calcGuideAccuracyTimeSeries, performanceVars.guideAccuracySnapshotInterval);
    }
    setTimeout(calcGuideAccuracyTimeSeries, performanceVars.guideAccuracySnapshotInterval);
}

function calcTopOfBreathAvg() {
    // calculates the breath depth average of the whole session
    let breathDataSum = 0;
    for (let i = 0; i < sessionData.topOfBreathData.length; i++){
        breathDataSum += sessionData.topOfBreathData[i];
    }
    sessionData.topOfBreathAvg = (breathDataSum / sessionData.topOfBreathData.length).toFixed(1);
}


function calcGuideAccuracyAvg() {
    // calculates the guide accuracy average of the whole session
    let trueResults = 0;
    for (let i = 0; i < sessionData.guideAccuracyData.length; i++){
        if(sessionData.guideAccuracyData[i] === 'true'){
            trueResults++
        }
    }
    sessionData.guideAccuracyAvg = ((trueResults / sessionData.guideAccuracyData.length)*100).toFixed(1);
}

function stopSnapshotAnalysis() {
    clearTimeout(calcBreathDepthTimeSeries);
    clearTimeout(calcGuideAccuracyTimeSeries);

    calcTopOfBreathAvg();
    calcGuideAccuracyAvg();
}

export {
    startSnapshotAnalysis,
    stopSnapshotAnalysis
};