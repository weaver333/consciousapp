function newSessionDataModel(){
    let mode = '';

    if ( typeof sessionData != "undefined" ) {
        mode = sessionData.mode;
    }
    
    return sessionDataModel = {

        // Needs to be refactored as we don't need to send any of this to the server, this is all just for global variable access.
        calibration: {
            shoulderPoints: 0,
            facesDetected: 0,
            facePositionY: 0,
            faceHeightInFrame: 0,
            calibrationComplete: false,
            faceToBoundaryTopDiff: [],
            faceToBoundaryBottomDiff: []
        },
        mode, // Used to set the mode of the engine. Will behave differently based on different modes. Currently have session mode and monitor mode
        sessionMuted: false,
        breathDepthNow: 0, // COMPLETED Used to store breath depth now temporarily for snapshot analysis (averages and time series)
        breathStateNow: '', // COMPLETED Shows the users current breath state now, from Inhaling, Holding or Exhaling
        guideStateNow: '', // COMPLETED Shows the current guide state, what the guide wants the user to do Inhaling, Holding or Exhaling
        breathSequence: [], // COMPLETED Shows the last sequence of breath states as to increment the breath counter
    
        // Below should be sent to the server
        packType: '', // COMPLETED!
        totalSessionTime: 0, // COMPLETED!
        totalXP: 0, // COMPLETED! Will need to move to serverside calculation at some point
        breathCycles: 0, // COMPLETED!
        breathsPerMin: 0, // COMPLETED!
    
        // Breath depth/shallowness averaging
        topOfBreathData: [], // COMPLETED Used to store breath depths on hold or exhale as this is the top of the breath - for avg calc later
        topOfBreathAvg: 0, // COMPLETED
    
        // Breath depth graphing over time
        breathDepthTimestamps: [], // COMPLETED 
        breathDepthData: [], // COMPLETED
    
        // COMPLETED
        guideAccuracyData: [],
        guideAccuracyAvg: 0, // Used as breath consistency for now - as the consistency of accuracy is roughly correlated.
    
        // NOT COMPLETED
        // breathCoherenceAvg: 0, // This is yet to be implemented but looks at breath depth over time to get consistency of breath over time sine wave
        // breathCoherenceTimeSeries: [],
        
        timestamp: 0,
    }
}


export {newSessionDataModel};