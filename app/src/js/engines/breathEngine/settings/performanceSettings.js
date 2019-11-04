// Performance variables - These variables will dramatically affect the CPU/GPU performance and quality of experience

// REFERENCE
//
// performanceVars = {
//     // OPENCV PERFORMANCE VARS
//     FPS: 10, // How many frames are processed per second, also how many times the realtime analysis and updating UI are called per second
//     // SNAPSHOT ANALYSIS PERFORMANCE VARS
//     breathDepthSnapshotInterval: 200, // How often to calculate the breath depth snapshot (higher ms means less data and less accuracy but more performant)
//     guideAccuracySnapshotInterval: 500, // How often to calculate guide accuracy (trues/falses)(higher ms means less data and less accuracy but more performant)
//     realtimeGraphing: true, // allows realtime graphing of breath on the session screen, false disables for more performance
//     // REALTIME ANALYSIS PERFORMANCE VARS
//     maxLastBreathStates: 6, // Increases or decreases accuracy of breath prediction by smoothing results (looks at most frequent breath state in X predictions) - 0 indexed so 6 = 7
//     thValue: 0.35, // Threshold value for sensitivity of breath state detection, it'll update the breath state when it sees this value of movement
//     breathDepthDelayCompensation: 5, // percentage to add to the breath depth when calculating top of the breath. Necessary to add more if the FPS is lower as it may not calculate the top of breath as accurately
//     UI UPDATE OPTIONS
//     updateUIInterval: 1000 // defines how often to update the values in the realtime stats panel
// }


function performanceMode(mode){
    // AVERAGE
    // High Performance CPU/GPU wise, but low accuracy and less data (for slower devices)
    if(mode === 'HighPerfLowAcc'){
        return performanceVars = {
            mode: 'HighPerfLowAcc',
            // OPENCV PERFORMANCE VARS
            FPS: 10, 
            // SNAPSHOT ANALYSIS PERFORMANCE VARS
            breathDepthSnapshotInterval: 400,
            guideAccuracySnapshotInterval: 500,
            realtimeGraphing: false, 
            // REALTIME ANALYSIS PERFORMANCE VARS
            maxLastBreathStates: 6, 
            thValue: 0.35,
            breathDepthDelayCompensation: 10, 
            // UI UPDATE OPTIONS
            updateUIInterval: 2000
        }
    }
    // BETTER
    // Average Performance CPU/GPU wise, and average accuracy and average amount of data (standard mode)
    if(mode === 'AvgPerfAvgAcc'){
        return performanceVars = {
            mode: 'AvgPerfAvgAcc',
            // OPENCV PERFORMANCE VARS
            FPS: 30, 
            // SNAPSHOT ANALYSIS PERFORMANCE VARS
            breathDepthSnapshotInterval: 200,
            guideAccuracySnapshotInterval: 500,
            realtimeGraphing: true, 
            // REALTIME ANALYSIS PERFORMANCE VARS
            maxLastBreathStates: 6, 
            thValue: 0.35,
            breathDepthDelayCompensation: 5, 
            // UI UPDATE OPTIONS
            updateUIInterval: 1000
        }
    }
    // BEST
    // Lower Performance CPU/GPU wise, and highest accuracy and more data (ideal)
    if(mode === 'LowPerfHighAcc'){
        return performanceVars = {
            mode: 'LowPerfHighAcc',
            // OPENCV PERFORMANCE VARS
            FPS: 60, 
            // SNAPSHOT ANALYSIS PERFORMANCE VARS
            breathDepthSnapshotInterval: 100,
            guideAccuracySnapshotInterval: 500,
            realtimeGraphing: true, 
            // REALTIME ANALYSIS PERFORMANCE VARS
            maxLastBreathStates: 6, 
            thValue: 0.35,
            breathDepthDelayCompensation: 5, 
            // UI UPDATE OPTIONS
            updateUIInterval: 500

        }
    }
}

export { performanceMode };